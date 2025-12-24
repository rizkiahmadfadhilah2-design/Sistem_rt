import express from "express";
import db from "../../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===== GET ALL TRANSACTIONS =====
router.get("/", verifyToken, (req, res) => {
  const sql = "SELECT * FROM kas ORDER BY tanggal DESC";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ===== GET TOTAL KAS =====
router.get("/total", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      SUM(CASE WHEN jenis='pemasukan' THEN jumlah
               WHEN jenis='pengeluaran' THEN -jumlah
               ELSE 0 END) AS totalKas
    FROM kas
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ totalKas: Number(result[0].totalKas) || 0 });
  });
});

// ===== ADD NEW TRANSACTION =====
router.post("/", verifyToken, (req, res) => {
  const { tanggal, jenis, keterangan, jumlah } = req.body;

  if (!tanggal || !jenis || !keterangan || typeof jumlah !== "number") {
    return res.status(400).json({ error: "Data tidak lengkap atau salah format" });
  }

  if (!["pemasukan", "pengeluaran"].includes(jenis)) {
    return res.status(400).json({ error: "Jenis harus 'pemasukan' atau 'pengeluaran'" });
  }

  const sql = "INSERT INTO kas (tanggal, jenis, keterangan, jumlah) VALUES (?, ?, ?, ?)";
  db.query(sql, [tanggal, jenis, keterangan, jumlah], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Kas berhasil ditambahkan", id: result.insertId });
  });
});

// ===== DELETE TRANSACTION =====
router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM kas WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    res.json({ message: "Transaksi berhasil dihapus" });
  });
});

export default router;
