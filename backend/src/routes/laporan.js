import express from "express"
import db from "../../db.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

// LAPORAN KAS BULANAN
// GET /laporan/bulanan?bulan=1&tahun=2025
router.get("/bulanan", verifyToken, async (req, res) => {
  try {
    const { bulan, tahun } = req.query

    if (!bulan || !tahun) {
      return res.status(400).json({
        error: "Parameter bulan dan tahun wajib diisi"
      })
    }

    const [rows] = await db.promise().query(
      `
      SELECT
        SUM(CASE WHEN jenis='pemasukan' THEN jumlah ELSE 0 END) AS pemasukan,
        SUM(CASE WHEN jenis='pengeluaran' THEN jumlah ELSE 0 END) AS pengeluaran
      FROM kas
      WHERE MONTH(tanggal)=? AND YEAR(tanggal)=?
      `,
      [Number(bulan), Number(tahun)]
    )

    const pemasukan = Number(rows[0]?.pemasukan) || 0
    const pengeluaran = Number(rows[0]?.pengeluaran) || 0

    res.json({
      pemasukan,
      pengeluaran,
      saldo: pemasukan - pengeluaran
    })
  } catch (err) {
    console.error("Laporan error:", err)
    res.status(500).json({
      error: "Terjadi kesalahan server laporan"
    })
  }
})

export default router
