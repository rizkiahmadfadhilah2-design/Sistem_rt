import React, { useState, useEffect } from "react"
import api from "../services/Api"
import Sidebar from "../component/Sidebar1"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function AjukanSurat() {
  const [jenisSurat, setJenisSurat] = useState("")
  const [keperluan, setKeperluan] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    if (!token) return navigate("/")
    if (role !== "warga") {
      alert("Hanya warga yang dapat mengajukan surat")
      navigate("/dashboard-rt")
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!jenisSurat || !keperluan) {
      setMessage("Semua data wajib diisi")
      setSuccess(false)
      return
    }

    try {
      setLoading(true)
      setMessage("")

      await api.post("/surat-pengantar", {
        jenis_surat: jenisSurat,
        keperluan
      })

      setSuccess(true)
      setMessage("Pengajuan surat berhasil dikirim")

      setJenisSurat("")
      setKeperluan("")

      setTimeout(() => navigate("/surat-saya"), 1500)
    } catch (err) {
      setSuccess(false)
      setMessage(
        err.response?.data?.message || "Pengajuan surat gagal"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6F8]">
      <Sidebar />

      <main className="flex-1 px-4 sm:px-8 py-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Pengajuan Surat Pengantar
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Isi formulir di bawah ini dengan data yang benar
          </p>
        </div>

        {/* FORM CONTAINER */}
        <div className="max-w-3xl">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-base font-medium text-gray-700">
                Form Pengajuan
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="px-6 py-6 space-y-6"
            >
              {/* JENIS SURAT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Surat <span className="text-red-500">*</span>
                </label>
                <select
                  value={jenisSurat}
                  onChange={(e) => setJenisSurat(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5
                             focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Pilih jenis surat</option>
                  <option value="Domisili">Surat Domisili</option>
                  <option value="Usaha">Surat Keterangan Usaha</option>
                  <option value="Tidak Mampu">
                    Surat Keterangan Tidak Mampu
                  </option>
                </select>
              </div>

              {/* KEPERLUAN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keperluan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  placeholder="Contoh: Persyaratan administrasi kelurahan"
                  className="w-full rounded-md border border-gray-300 px-4 py-3
                             focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* ALERT */}
              {message && (
                <div
                  className={`rounded-md px-4 py-3 text-sm ${
                    success
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* ACTION */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-md bg-blue-600 text-white
                             font-medium hover:bg-blue-700 transition
                             disabled:opacity-50"
                >
                  {loading ? "Mengirim..." : "Kirim Pengajuan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
