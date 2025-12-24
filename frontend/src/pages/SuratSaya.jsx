import React, { useEffect, useState } from "react"
import api from "../services/Api"
import Sidebar from "../component/Sidebar1"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function SuratSaya() {
  const [surat, setSurat] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  /* =========================
     CEK LOGIN & ROLE
  ========================= */
  useEffect(() => {
    const role = localStorage.getItem("role")

    if (!token) return navigate("/")
    if (role !== "warga") return navigate("/dashboard")

    fetchSurat()
  }, [])

  /* =========================
     FETCH DATA
  ========================= */
  const fetchSurat = async () => {
    try {
      const res = await api.get("/surat-pengantar/saya")
      setSurat(res.data)
    } catch (err) {
      alert("Gagal mengambil data surat")
    } finally {
      setLoading(false)
    }
  }

  /* =========================
     STATUS STYLE
  ========================= */
  const statusBadge = status => {
    switch (status) {
      case "diajukan":
        return "bg-yellow-100 text-yellow-700"
      case "disetujui":
        return "bg-green-100 text-green-700"
      case "ditolak":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-500"
    }
  }

  const statusText = status => {
    if (status === "diajukan") return "Menunggu Verifikasi"
    if (status === "disetujui") return "Disetujui RT"
    if (status === "ditolak") return "Ditolak RT"
    return "-"
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===== SIDEBAR ===== */}
      <Sidebar />

      {/* ===== MAIN CONTENT ===== */}
      <main
        className="
          flex-1
          pt-20 md:pt-8
          px-4 md:px-8
          transition-all duration-300
        "
      >
        {/* ===== TITLE ===== */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold mb-6 text-gray-800"
        >
          📄 Surat Saya
        </motion.h1>

        {/* ===== CONTENT ===== */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* ===== DESKTOP TABLE ===== */}
          <div className="hidden md:block">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-4 text-left">Jenis Surat</th>
                  <th className="p-4 text-left">Keperluan</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-400">
                      Memuat data...
                    </td>
                  </tr>
                ) : surat.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-400">
                      📭 Belum ada surat yang diajukan
                    </td>
                  </tr>
                ) : (
                  surat.map(s => (
                    <tr
                      key={s.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-medium">{s.jenis_surat}</td>
                      <td className="p-4">{s.keperluan}</td>

                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                            s.status
                          )}`}
                        >
                          {statusText(s.status)}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        {s.status === "disetujui" ? (
                          <button
                            onClick={() =>
                              navigate(`/hasil-surat/${s.id}`)
                            }
                            className="text-blue-600 font-medium hover:underline"
                          >
                            Lihat Surat
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ===== MOBILE CARD ===== */}
          <div className="md:hidden divide-y">
            {loading ? (
              <p className="p-6 text-center text-gray-400">
                Memuat data...
              </p>
            ) : surat.length === 0 ? (
              <p className="p-6 text-center text-gray-400">
                📭 Belum ada surat yang diajukan
              </p>
            ) : (
              surat.map(s => (
                <div key={s.id} className="p-4 space-y-2">
                  <h3 className="font-semibold">{s.jenis_surat}</h3>
                  <p className="text-sm text-gray-600">{s.keperluan}</p>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                      s.status
                    )}`}
                  >
                    {statusText(s.status)}
                  </span>

                  {s.status === "disetujui" && (
                    <button
                      onClick={() =>
                        navigate(`/hasil-surat/${s.id}`)
                      }
                      className="block text-blue-600 text-sm font-medium mt-2"
                    >
                      Lihat Surat →
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
