import React, { useEffect, useState } from "react"
import Sidebar from "../component/Sidebar1"
import api from "../services/Api"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function SuratMasuk() {
  const [surat, setSurat] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    if (!token) return navigate("/")
    if (role !== "rt") return navigate("/dashboard-warga")

    fetchSurat()
  }, [])

  const fetchSurat = async () => {
    try {
      const res = await api.get("/surat-pengantar")
      setSurat(res.data)
    } catch (err) {
      alert("Gagal mengambil data surat")
    } finally {
      setLoading(false)
    }
  }

  const verifikasiSurat = async (id, status) => {
    const catatan_rt = prompt("Catatan RT (opsional):")

    try {
      await api.put(`/surat-pengantar/${id}`, {
        status,
        catatan_rt
      })
      fetchSurat()
    } catch {
      alert("Gagal memverifikasi surat")
    }
  }

  const statusStyle = status => {
    switch (status) {
      case "diajukan":
        return "bg-yellow-100 text-yellow-700"
      case "disetujui":
        return "bg-green-100 text-green-700"
      case "ditolak":
        return "bg-red-100 text-red-700"
      default:
        return ""
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6 text-gray-800"
        >
          📬 Surat Masuk
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-4 text-left">Nama Warga</th>
                <th className="p-4 text-left">Jenis Surat</th>
                <th className="p-4 text-left">Keperluan</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    Memuat data...
                  </td>
                </tr>
              ) : surat.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    📭 Belum ada surat masuk
                  </td>
                </tr>
              ) : (
                surat.map(s => (
                  <tr
                    key={s.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">{s.nama}</td>
                    <td className="p-4">{s.jenis_surat}</td>
                    <td className="p-4 text-gray-600">
                      {s.keperluan}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                          s.status
                        )}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2">
                      {s.status === "diajukan" && (
                        <>
                          <button
                            onClick={() =>
                              verifikasiSurat(s.id, "disetujui")
                            }
                            className="px-3 py-1 rounded-lg text-xs bg-green-500 text-white hover:bg-green-600 transition"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() =>
                              verifikasiSurat(s.id, "ditolak")
                            }
                            className="px-3 py-1 rounded-lg text-xs bg-red-500 text-white hover:bg-red-600 transition"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </main>
    </div>
  )
}
