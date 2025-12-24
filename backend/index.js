import "dotenv/config";

import express from "express"
import cors from "cors"

import authRoutes from "./src/routes/auth.js"
import wargaRoutes from "./src/routes/warga.js"
import dashboardRoutes from "./src/routes/dashboard.js"
import kasRoutes from "./src/routes/kas.js"
import laporanRoutes from "./src/routes/laporan.js"
import suratPengantarRoutes from "./src/routes/suratPengantar.js"

const app = express()

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://sistem-n12dn3h9m-rizkiahmadfadhilahs-projects.vercel.app",
    "https://backend-sistem-rt.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())

app.use("/auth", authRoutes)
app.use("/warga", wargaRoutes)
app.use("/dashboard", dashboardRoutes)
app.use("/kas", kasRoutes)
app.use("/laporan", laporanRoutes)
app.use("/surat-pengantar", suratPengantarRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(` yow Backend running on port ${PORT}`)
})
