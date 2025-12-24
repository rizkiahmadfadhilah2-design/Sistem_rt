import dotenv from "dotenv"
dotenv.config() // ⬅️ WAJIB PALING ATAS

import express from "express"
import cors from "cors"

// ROUTES
import authRoutes from "./src/routes/auth.js"
import wargaRoutes from "./src/routes/warga.js"
import dashboardRoutes from "./src/routes/dashboard.js"
import kasRoutes from "./src/routes/kas.js"
import laporanRoutes from "./src/routes/laporan.js"
import suratPengantarRoutes from "./src/routes/suratPengantar.js"

// INIT APP
const app = express()

// MIDDLEWARE
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(express.json())

// TEST ENV (boleh hapus setelah yakin)
console.log("JWT SECRET:", process.env.JWT_SECRET)

// ROUTES
app.use("/auth", authRoutes)
app.use("/warga", wargaRoutes)
app.use("/dashboard", dashboardRoutes)
app.use("/kas", kasRoutes)
app.use("/laporan", laporanRoutes)
app.use("/surat-pengantar", suratPengantarRoutes)

// SERVER
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Backend running http://localhost:${PORT}`)
})
