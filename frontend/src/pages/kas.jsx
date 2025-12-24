import React, { useEffect, useState } from "react"
import Sidebar from "../component/Sidebar1"
import api from "../services/Api"
import { ArrowUpCircle, ArrowDownCircle, Wallet, Trash2 } from "lucide-react"

export default function Kas() {
  const [kas, setKas] = useState([])
  const [totalKas, setTotalKas] = useState(0)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    tanggal: "",
    jenis: "pemasukan",
    keterangan: "",
    jumlah: ""
  })

  const fetchKas = async () => {
    setLoading(true)
    try {
      const [resKas, resTotal] = await Promise.all([
        api.get("/kas"),
        api.get("/kas/total")
      ])
      setKas(resKas.data || [])
      setTotalKas(resTotal.data?.totalKas || 0)
    } catch {
      setKas([])
      setTotalKas(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKas()
  }, [])

  const handleAdd = async () => {
    if (!form.tanggal || !form.keterangan || !form.jumlah)
      return alert("Lengkapi semua data!")

    try {
      await api.post("/kas", {
        ...form,
        jumlah: Number(form.jumlah)
      })
      setForm({ tanggal: "", jenis: "pemasukan", keterangan: "", jumlah: "" })
      fetchKas()
    } catch (err) {
      alert(err.response?.data?.error || "Gagal menambahkan transaksi")
    }
  }

  const handleDelete = async id => {
    if (!confirm("Yakin hapus transaksi ini?")) return
    await api.delete(`/kas/${id}`)
    fetchKas()
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 px-4 md:px-8 pt-20 md:pt-8 space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl shadow">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Kas RT</h1>
            <p className="text-gray-500 text-sm">
              Riwayat pemasukan & pengeluaran kas
            </p>
          </div>

          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl shadow">
            <Wallet />
            <div>
              <p className="text-xs opacity-80">Total Kas</p>
              <p className="font-bold">
                Rp {Number(totalKas).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="font-semibold">Tambah Transaksi</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="date"
              className="border p-2 rounded"
              value={form.tanggal}
              onChange={e => setForm({ ...form, tanggal: e.target.value })}
            />
            <select
              className="border p-2 rounded"
              value={form.jenis}
              onChange={e => setForm({ ...form, jenis: e.target.value })}
            >
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
            <input
              type="text"
              placeholder="Keterangan"
              className="border p-2 rounded"
              value={form.keterangan}
              onChange={e => setForm({ ...form, keterangan: e.target.value })}
            />
            <input
              type="number"
              placeholder="Jumlah"
              className="border p-2 rounded"
              value={form.jumlah}
              onChange={e => setForm({ ...form, jumlah: e.target.value })}
            />
          </div>

          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Tambah Transaksi
          </button>
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Tanggal</th>
                <th className="p-4 text-left">Jenis</th>
                <th className="p-4 text-left">Keterangan</th>
                <th className="p-4 text-right">Jumlah</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center">
                    Memuat data...
                  </td>
                </tr>
              ) : kas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center">
                    Belum ada transaksi
                  </td>
                </tr>
              ) : (
                kas.map(k => {
                  const isIn = k.jenis === "pemasukan"
                  return (
                    <tr key={k.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        {new Date(k.tanggal).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            isIn
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isIn ? (
                            <ArrowUpCircle size={14} />
                          ) : (
                            <ArrowDownCircle size={14} />
                          )}
                          {k.jenis.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">{k.keterangan}</td>
                      <td
                        className={`p-4 text-right font-semibold ${
                          isIn ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        Rp {Number(k.jumlah).toLocaleString("id-ID")}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(k.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARD ================= */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <p className="text-center text-gray-400">Memuat data...</p>
          ) : kas.length === 0 ? (
            <p className="text-center text-gray-400">Belum ada transaksi</p>
          ) : (
            kas.map(k => {
              const isIn = k.jenis === "pemasukan"
              return (
                <div
                  key={k.id}
                  className="bg-white p-4 rounded-xl shadow space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        isIn
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isIn ? "PEMASUKAN" : "PENGELUARAN"}
                    </span>
                    <button
                      onClick={() => handleDelete(k.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="font-semibold">{k.keterangan}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(k.tanggal).toLocaleDateString("id-ID")}
                  </p>
                  <p
                    className={`font-bold ${
                      isIn ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Rp {Number(k.jumlah).toLocaleString("id-ID")}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
