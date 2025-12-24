import PDFDocument from "pdfkit"
import db from "../db.js"

export const downloadSuratPDF = (req, res) => {
  const sql = `
    SELECT jenis_surat, isi_surat
    FROM surat_pengantar
    WHERE id = ?
  `

  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json(err)

    if (rows.length === 0 || !rows[0].isi_surat) {
      return res.status(404).json({
        message: "Isi surat belum tersedia"
      })
    }

    const surat = rows[0]

    const doc = new PDFDocument({ margin: 50 })

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      `inline; filename=surat-${req.params.id}.pdf`
    )

    doc.pipe(res)

    doc
      .font("Times-Roman")
      .fontSize(12)
      .text(surat.isi_surat, {
        align: "left"
      })

    doc.end()
  })
}
