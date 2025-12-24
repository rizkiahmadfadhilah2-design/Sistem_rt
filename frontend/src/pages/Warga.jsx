import React, { useState, useEffect } from "react"
import Sidebar from "../component/Sidebar1"
import api from "../services/Api"
import { motion, AnimatePresence } from "framer-motion"

export default function Warga() {
  const [warga, setWarga] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  /* FORM */
  const [editId, setEditId] = useState(null)
  const [nama, setNama] = useState("")
  const [nik, setNik] = useState("")
  const [noRumah, setNoRumah] = useState("")
  const [rt, setRt] = useState("016")
  const [alamat, setAlamat] = useState("")
  const [tanggalLahir, setTanggalLahir] = useState("")
  const [jenisKelamin, setJenisKelamin] = useState("L")
  const [status, setStatus] = useState("aktif")

  /* FETCH */
  const fetchWarga = async () => {
    setLoading(true)
    try {
      const res = await api.get("/warga")
      setWarga(res.data || [])
    } catch {
      alert("Gagal mengambil data warga")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWarga()
  }, [])

  /* STAT */
  const total = warga.length
  const aktif = warga.filter(w => w.status === "aktif").length
  const pindah = warga.filter(w => w.status === "pindah").length
  const meninggal = warga.filter(w => w.status === "meninggal").length

  const resetForm = () => {
    setEditId(null)
    setNama("")
    setNik("")
    setNoRumah("")
    setRt("016")
    setAlamat("")
    setTanggalLahir("")
    setJenisKelamin("L")
    setStatus("aktif")
  }

  const openModal = (w = null) => {
    if (w) {
      setEditId(w.id)
      setNama(w.nama)
      setNik(w.nik || "")
      setNoRumah(w.no_rumah)
      setRt(w.rt || "016")
      setAlamat(w.alamat)
      setTanggalLahir(w.tanggal_lahir?.split("T")[0] || "")
      setJenisKelamin(w.jenis_kelamin)
      setStatus(w.status)
    }
    setModalOpen(true)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const payload = {
      nama,
      nik,
      no_rumah: noRumah,
      rt,
      alamat,
      tanggal_lahir: tanggalLahir || null,
      jenis_kelamin: jenisKelamin,
      status
    }

    try {
      editId
        ? await api.put(`/warga/${editId}`, payload)
        : await api.post("/warga", payload)

      resetForm()
      setModalOpen(false)
      fetchWarga()
    } catch {
      alert("Gagal menyimpan data")
    }
  }

  const handleDelete = async id => {
    if (!confirm("Yakin hapus data warga?")) return
    await api.delete(`/warga/${id}`)
    fetchWarga()
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 px-4 md:px-8 pt-20 md:pt-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Data Warga RT 016 RW 012
        </h1>

        {/* === STAT === */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat title="Total" value={total} />
          <Stat title="Aktif" value={aktif} color="green" />
          <Stat title="Pindah" value={pindah} color="yellow" />
          <Stat title="Meninggal" value={meninggal} color="red" />
        </div>

        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          + Tambah Warga
        </button>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {["Nama", "NIK", "Alamat", "JK", "Status", "Aksi"].map(h => (
                  <th key={h} className="p-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center">Loading...</td>
                </tr>
              ) : warga.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center">Data kosong</td>
                </tr>
              ) : (
                warga.map(w => (
                  <tr key={w.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{w.nama}</td>
                    <td className="p-3">{w.nik}</td>
                    <td className="p-3">{w.alamat}</td>
                    <td className="p-3">{w.jenis_kelamin}</td>
                    <td className="p-3 capitalize font-semibold">{w.status}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => openModal(w)}
                        className="bg-yellow-400 px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(w.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARD ================= */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : warga.length === 0 ? (
            <p className="text-center text-gray-400">Data kosong</p>
          ) : (
            warga.map(w => (
              <div
                key={w.id}
                className="bg-white p-4 rounded-xl shadow space-y-1"
              >
                <h3 className="font-semibold">{w.nama}</h3>
                <p className="text-sm text-gray-500">{w.alamat}</p>
                <p className="text-sm">
                  {w.jenis_kelamin} • <span className="capitalize">{w.status}</span>
                </p>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => openModal(w)}
                    className="flex-1 bg-yellow-400 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="flex-1 bg-red-500 text-white py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= MODAL ================= */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-xl mx-4">
              <h2 className="font-bold mb-4">
                {editId ? "Edit Warga" : "Tambah Warga"}
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nama" value={nama} setValue={setNama} />
                <Input label="NIK" value={nik} setValue={setNik} />
                <Input label="No Rumah" value={noRumah} setValue={setNoRumah} />
                <Input label="Alamat" value={alamat} setValue={setAlamat} />

                <Select label="Jenis Kelamin" value={jenisKelamin} setValue={setJenisKelamin}>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </Select>

                <Select label="Status" value={status} setValue={setStatus}>
                  <option value="aktif">Aktif</option>
                  <option value="pindah">Pindah</option>
                  <option value="meninggal">Meninggal</option>
                </Select>

                <div className="md:col-span-2 flex justify-end gap-2">
                  <button className="bg-blue-600 text-white px-5 py-2 rounded">
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => { resetForm(); setModalOpen(false) }}
                    className="bg-gray-400 px-5 py-2 rounded"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

/* ===== KOMPONEN ===== */

function Stat({ title, value, color }) {
  const map = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600"
  }
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={`text-2xl md:text-3xl font-bold ${map[color] || ""}`}>
        {value}
      </p>
    </div>
  )
}

function Input({ label, value, setValue }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
    </div>
  )
}

function Select({ label, value, setValue, children }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <select
        value={value}
        onChange={e => setValue(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {children}
      </select>
    </div>
  )
}
