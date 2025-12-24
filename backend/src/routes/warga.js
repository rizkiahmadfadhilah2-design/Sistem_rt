import express from "express";
import db from "../../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   GET semua warga
========================= */
router.get("/", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      id,
      nama,
      nik,
      no_rumah,
      rt,
      alamat,
      tanggal_lahir,
      jenis_kelamin,
      status,
      created_at
    FROM warga
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* =========================
   POST tambah warga
========================= */
router.post("/", verifyToken, (req, res) => {
  const {
    nama,
    nik,
    no_rumah,
    rt,
    alamat,
    tanggal_lahir,
    jenis_kelamin,
    status
  } = req.body;

  if (!nama || !nik || !no_rumah || !alamat) {
    return res.status(400).json({ message: "Data wajib belum lengkap" });
  }

  const allowedStatus = ["aktif", "meninggal", "pindah"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  // cek NIK sudah ada atau belum
  db.query(
    "SELECT id FROM warga WHERE nik = ?",
    [nik],
    (err, cek) => {
      if (err) return res.status(500).json(err);
      if (cek.length > 0) {
        return res.status(400).json({ message: "NIK sudah terdaftar" });
      }

      const sql = `
        INSERT INTO warga
        (nama, nik, no_rumah, rt, alamat, tanggal_lahir, jenis_kelamin, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          nama,
          nik,
          no_rumah,
          rt,
          alamat,
          tanggal_lahir || null,
          jenis_kelamin,
          status
        ],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Warga berhasil ditambahkan" });
        }
      );
    }
  );
});

/* =========================
   PUT update warga
========================= */
router.put("/:id", verifyToken, (req, res) => {
  const {
    nama,
    nik,
    no_rumah,
    rt,
    alamat,
    tanggal_lahir,
    jenis_kelamin,
    status
  } = req.body;

  if (!nama || !nik || !no_rumah || !alamat) {
    return res.status(400).json({ message: "Data wajib belum lengkap" });
  }

  const allowedStatus = ["aktif", "meninggal", "pindah"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  // cek NIK dipakai warga lain atau tidak
  db.query(
    "SELECT id FROM warga WHERE nik = ? AND id != ?",
    [nik, req.params.id],
    (err, cek) => {
      if (err) return res.status(500).json(err);
      if (cek.length > 0) {
        return res.status(400).json({ message: "NIK sudah digunakan warga lain" });
      }

      const sql = `
        UPDATE warga
        SET
          nama = ?,
          nik = ?,
          no_rumah = ?,
          rt = ?,
          alamat = ?,
          tanggal_lahir = ?,
          jenis_kelamin = ?,
          status = ?
        WHERE id = ?
      `;

      db.query(
        sql,
        [
          nama,
          nik,
          no_rumah,
          rt,
          alamat,
          tanggal_lahir || null,
          jenis_kelamin,
          status,
          req.params.id
        ],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Warga berhasil diupdate" });
        }
      );
    }
  );
});

/* =========================
   DELETE warga
========================= */
router.delete("/:id", verifyToken, (req, res) => {
  db.query("DELETE FROM warga WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Warga berhasil dihapus" });
  });
});

export default router;
