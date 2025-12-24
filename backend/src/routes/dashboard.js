import express from "express";
import db from "../../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= DASHBOARD UTAMA ================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    const [wargaResult] = await db.promise().query(
      "SELECT COUNT(*) AS total FROM warga"
    );

    const [rumahResult] = await db.promise().query(
      "SELECT COUNT(DISTINCT no_rumah) AS total FROM warga"
    );

    const [kasResult] = await db.promise().query(`
      SELECT SUM(
        CASE 
          WHEN jenis='pemasukan' THEN jumlah 
          ELSE -jumlah 
        END
      ) AS total
      FROM kas
    `);

    const [wargaTerbaru] = await db.promise().query(`
      SELECT id, nama, no_rumah, rt, alamat
      FROM warga
      ORDER BY id DESC
      LIMIT 5
    `);

    const [kasTerbaru] = await db.promise().query(`
      SELECT id, tanggal, jenis, keterangan, jumlah
      FROM kas
      ORDER BY tanggal DESC
      LIMIT 5
    `);

    res.json({
      totalWarga: wargaResult[0]?.total || 0,
      totalRumah: rumahResult[0]?.total || 0,
      totalKas: kasResult[0]?.total || 0,
      wargaTerbaru,
      kasTerbaru
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/* ================= GRAFIK USIA ================= */
router.get("/grafik/usia", verifyToken, async (req, res) => {
  try {
    const [warga] = await db.promise().query(
      "SELECT tanggal_lahir FROM warga"
    );

    const now = new Date();
    let anak = 0, remaja = 0, dewasa = 0, lansia = 0;

    warga.forEach(w => {
      if (!w.tanggal_lahir) return;

      const lahir = new Date(w.tanggal_lahir);
      let umur = now.getFullYear() - lahir.getFullYear();
      const m = now.getMonth() - lahir.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < lahir.getDate())) umur--;

      if (umur <= 12) anak++;
      else if (umur <= 25) remaja++;
      else if (umur <= 60) dewasa++;
      else lansia++;
    });

    res.json({ anak, remaja, dewasa, lansia });
  } catch {
    res.status(500).json({ error: "Gagal mengambil grafik usia" });
  }
});

/* ================= GRAFIK KAS ================= */
router.get("/grafik/kas", verifyToken, async (req, res) => {
  try {
    const [data] = await db.promise().query(`
      SELECT DATE_FORMAT(tanggal, '%b %Y') AS bulan,
             SUM(CASE WHEN jenis='pemasukan' THEN jumlah ELSE 0 END) AS pemasukan,
             SUM(CASE WHEN jenis='pengeluaran' THEN jumlah ELSE 0 END) AS pengeluaran
      FROM kas
      GROUP BY DATE_FORMAT(tanggal, '%Y-%m')
      ORDER BY MIN(tanggal)
    `);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Gagal mengambil grafik kas" });
  }
});

/* ================= TAMBAHAN BARU ================= */

// Status Warga
router.get("/grafik/status", verifyToken, async (req, res) => {
  try {
    const [data] = await db.promise().query(`
      SELECT status, COUNT(*) AS total
      FROM warga
      GROUP BY status
    `);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Gagal mengambil status warga" });
  }
});

// Gender
router.get("/grafik/gender", verifyToken, async (req, res) => {
  try {
    const [data] = await db.promise().query(`
      SELECT jenis_kelamin, COUNT(*) AS total
      FROM warga
      GROUP BY jenis_kelamin
    `);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Gagal mengambil gender warga" });
  }
});

// Warga per RT
router.get("/grafik/rt", verifyToken, async (req, res) => {
  try {
    const [data] = await db.promise().query(`
      SELECT rt, COUNT(*) AS total
      FROM warga
      GROUP BY rt
      ORDER BY rt
    `);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Gagal mengambil data RT" });
  }
});

export default router;
