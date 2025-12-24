import express from "express"
import db from "../../db.js"
import PDFDocument from "pdfkit"
import { verifyToken } from "../middleware/authMiddleware.js"
import { isRT } from "../middleware/isRT.js"
import { generateIsiSurat } from "../template/templateSurat.js"

const router = express.Router()

/* =================================================
   WARGA - AJUKAN SURAT
================================================= */
router.post("/", verifyToken, (req, res) => {
  const { jenis_surat, keperluan, tujuan_surat } = req.body

  if (req.user.role !== "warga") {
    return res.status(403).json({ message: "Hanya warga yang dapat mengajukan surat" })
  }

  if (!jenis_surat || !keperluan) {
    return res.status(400).json({ message: "Jenis surat dan keperluan wajib diisi" })
  }

  const sql = `
    INSERT INTO surat_pengantar
    (warga_id, jenis_surat, keperluan, tujuan_surat, status, tanggal_pengajuan)
    VALUES (?, ?, ?, ?, 'diajukan', NOW())
  `

  db.query(
    sql,
    [req.user.warga_id, jenis_surat, keperluan, tujuan_surat || null],
    err => {
      if (err) return res.status(500).json(err)
      res.json({ message: "Surat berhasil diajukan" })
    }
  )
})

/* =================================================
   WARGA - SURAT SAYA
================================================= */
router.get("/saya", verifyToken, (req, res) => {
  if (req.user.role !== "warga") {
    return res.status(403).json({ message: "Akses ditolak" })
  }

  const sql = `
    SELECT
      id,
      jenis_surat,
      keperluan,
      status,
      catatan_rt,
      tanggal_pengajuan,
      tanggal_verifikasi
    FROM surat_pengantar
    WHERE warga_id = ?
    ORDER BY tanggal_pengajuan DESC
  `

  db.query(sql, [req.user.warga_id], (err, rows) => {
    if (err) return res.status(500).json(err)
    res.json(rows)
  })
})

/* =================================================
   RT - SEMUA SURAT MASUK
================================================= */
router.get("/", verifyToken, isRT, (req, res) => {
  const sql = `
    SELECT
      s.id,
      s.jenis_surat,
      s.keperluan,
      s.status,
      s.tanggal_pengajuan,
      w.nama
    FROM surat_pengantar s
    JOIN warga w ON s.warga_id = w.id
    ORDER BY s.tanggal_pengajuan DESC
  `

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err)
    res.json(rows)
  })
})

/* =================================================
   DETAIL SURAT (HASIL SURAT)
================================================= */
router.get("/:id", verifyToken, (req, res) => {
  const sql = `
    SELECT
      s.id,
      s.jenis_surat,
      s.keperluan,
      s.status,
      s.tanggal_verifikasi,
      s.isi_surat,
      w.id AS warga_id,
      w.nama,
      w.nik,
      w.alamat
    FROM surat_pengantar s
    JOIN warga w ON s.warga_id = w.id
    WHERE s.id = ?
  `

  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json(err)
    if (!rows.length) {
      return res.status(404).json({ message: "Surat tidak ditemukan" })
    }

    const surat = rows[0]

    if (req.user.role === "warga" && surat.warga_id !== req.user.warga_id) {
      return res.status(403).json({ message: "Akses ditolak" })
    }

    if (surat.status !== "disetujui") {
      return res.status(403).json({ message: "Surat belum disetujui" })
    }

    res.json(surat)
  })
})

/* =================================================
   RT - VERIFIKASI SURAT
================================================= */
router.put("/:id", verifyToken, isRT, (req, res) => {
  const { status, catatan_rt } = req.body

  if (!["disetujui", "ditolak"].includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" })
  }

  const sqlGet = `
    SELECT jenis_surat, keperluan
    FROM surat_pengantar
    WHERE id = ?
  `

  db.query(sqlGet, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json(err)
    if (!rows.length) {
      return res.status(404).json({ message: "Surat tidak ditemukan" })
    }

    const isiSurat =
      status === "disetujui"
        ? generateIsiSurat(rows[0])
        : null

    const sqlUpdate = `
      UPDATE surat_pengantar
      SET
        status = ?,
        catatan_rt = ?,
        isi_surat = ?,
        rt_id = ?,
        tanggal_verifikasi = NOW()
      WHERE id = ?
    `

    db.query(
      sqlUpdate,
      [
        status,
        catatan_rt || null,
        isiSurat,
        req.user.rt_id,
        req.params.id
      ],
      err => {
        if (err) return res.status(500).json(err)
        res.json({ message: "Surat berhasil diverifikasi" })
      }
    )
  })
})

/* =================================================
   DOWNLOAD PDF (FINAL RAPI)
================================================= */
router.get("/:id/download", verifyToken, (req, res) => {
  const sql = `
    SELECT
      s.jenis_surat,
      s.status,
      s.tanggal_verifikasi,
      s.isi_surat,
      w.nama,
      w.nik,
      w.alamat
    FROM surat_pengantar s
    JOIN warga w ON s.warga_id = w.id
    WHERE s.id = ?
  `

  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json(err)
    if (!rows.length) {
      return res.status(404).json({ message: "Surat tidak ditemukan" })
    }

    const surat = rows[0]

    if (surat.status !== "disetujui") {
      return res.status(403).json({ message: "Surat belum disetujui" })
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 })

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", "inline; filename=surat.pdf")

    doc.pipe(res)

    doc.font("Times-Roman").fontSize(12)

    /* ===== KOP ===== */
    doc.text("RUKUN TETANGGA (RT) 016 / RW 012", { align: "center" })
    doc.text("Kelurahan Mangunjaya", { align: "center" })
    doc.text("Kecamatan Tambun Selatan, Kabupaten Bekasi", { align: "center" })
    doc.moveDown(2)

    /* ===== JUDUL ===== */
    const judul =
      surat.jenis_surat === "domisili"
        ? "SURAT KETERANGAN DOMISILI"
        : surat.jenis_surat === "usaha"
        ? "SURAT KETERANGAN USAHA"
        : "SURAT KETERANGAN TIDAK MAMPU"

    doc.text(judul, { align: "center", underline: true })
    doc.moveDown(2)

    /* ===== PEMBUKA ===== */
    doc.text(
      "Yang bertanda tangan di bawah ini Ketua RT 016 / RW 012 " +
      "Kelurahan Mangunjaya, Kecamatan Tambun Selatan, Kabupaten Bekasi, " +
      "dengan ini menerangkan bahwa:"
    )
    doc.moveDown()

    /* ===== IDENTITAS ===== */
    doc.text(`Nama   : ${surat.nama}`)
    doc.text(`NIK    : ${surat.nik}`)
    doc.text(`Alamat : ${surat.alamat}`)
    doc.moveDown()

    /* ===== ISI SURAT ===== */
    doc.text(surat.isi_surat, {
      align: "justify",
      lineGap: 4
    })

    /* ===== PENUTUP ===== */
    doc.moveDown()
    doc.text(
      "Demikian surat ini dibuat dengan sebenarnya untuk dapat " +
      "dipergunakan sebagaimana mestinya."
    )


    doc.end()
  })
})

export default router
