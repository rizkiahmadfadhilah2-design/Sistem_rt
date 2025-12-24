import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/Api"

export default function HasilSurat() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [surat, setSurat] = useState(null)

  useEffect(() => {
    fetchSurat()
  }, [])

  const fetchSurat = async () => {
    try {
      const res = await api.get(`/surat-pengantar/${id}`)
      setSurat(res.data)
    } catch {
      alert("Gagal memuat surat")
    }
  }

  const printSurat = () => window.print()

  if (!surat) return <p className="p-8">Memuat surat...</p>

  // Normalisasi jenis surat
  const jenis = surat.jenis_surat
    ?.toLowerCase()
    .replace(/\s+/g, "_")
    .trim()

  /* ========================
     ISI SURAT
  ========================= */
  const renderIsiSurat = () => {
    switch (jenis) {
      case "domisili":
        return (
          <>
            <p className="isi">
              Yang bersangkutan benar merupakan warga yang berdomisili dan
              bertempat tinggal di wilayah RT 016 / RW 012 Kelurahan Mangunjaya,
              Kecamatan Tambun Selatan, Kabupaten Bekasi.
            </p>
            <p className="isi">
              Surat keterangan domisili ini dibuat untuk keperluan{" "}
              <b>{surat.keperluan}</b>.
            </p>
          </>
        )

      case "usaha":
        return (
          <>
            <p className="isi">
              Yang bersangkutan benar memiliki dan menjalankan usaha kecil yang
              berada di lingkungan RT 016 / RW 012 Kelurahan Mangunjaya,
              Kecamatan Tambun Selatan, Kabupaten Bekasi.
            </p>
            <p className="isi">
              Surat keterangan usaha ini dibuat untuk keperluan{" "}
              <b>{surat.keperluan}</b>.
            </p>
          </>
        )

      case "tidak_mampu":
        return (
          <>
            <p className="isi">
              Yang bersangkutan benar merupakan warga yang tergolong kurang
              mampu secara ekonomi dan berdomisili di wilayah RT 016 / RW 012
              Kelurahan Mangunjaya, Kecamatan Tambun Selatan, Kabupaten Bekasi.
            </p>
            <p className="isi">
              Surat keterangan tidak mampu ini dibuat untuk keperluan{" "}
              <b>{surat.keperluan}</b>.
            </p>
          </>
        )

      default:
        return <p className="isi">Jenis surat tidak dikenali.</p>
    }
  }

  const getJudulSurat = () => {
    switch (jenis) {
      case "domisili":
        return "SURAT KETERANGAN DOMISILI"
      case "usaha":
        return "SURAT KETERANGAN USAHA"
      case "tidak_mampu":
        return "SURAT KETERANGAN TIDAK MAMPU"
      default:
        return "SURAT KETERANGAN"
    }
  }

  return (
    <div className="print-wrapper">
      {/* ACTION */}
      <div className="no-print action">
        <button onClick={() => navigate(-1)}>⬅ Kembali</button>
        <button onClick={printSurat}>🖨 Cetak</button>
        <a
          href={`${import.meta.env.VITE_API_URL}/surat-pengantar/${id}/download`}
          target="_blank"
          rel="noopener noreferrer"
        >
          ⬇ Unduh PDF
        </a>
      </div>

      {/* SURAT */}
      <div className="surat">
        {/* KOP */}
        <div className="kop">
          <h2>PEMERINTAH KABUPATEN BEKASI</h2>
          <h3>KECAMATAN TAMBUN SELATAN</h3>
          <h3>KELURAHAN MANGUNJAYA</h3>
          <p>RT 016 / RW 012</p>
        </div>

        <hr />

        <h3 className="judul">{getJudulSurat()}</h3>

        <p className="isi">
          Yang bertanda tangan di bawah ini Ketua RT 016 / RW 012 Kelurahan
          Mangunjaya, Kecamatan Tambun Selatan, Kabupaten Bekasi, dengan ini
          menerangkan bahwa:
        </p>

        <table className="data">
          <tbody>
            <tr>
              <td>Nama</td>
              <td>: {surat.nama}</td>
            </tr>
            <tr>
              <td>NIK</td>
              <td>: {surat.nik}</td>
            </tr>
            <tr>
              <td>Alamat</td>
              <td>: {surat.alamat}</td>
            </tr>
          </tbody>
        </table>

        {renderIsiSurat()}

        <p className="isi">
          Demikian surat keterangan ini dibuat dengan sebenar-benarnya agar dapat
          dipergunakan sebagaimana mestinya.
        </p>

        <div className="ttd">
          <p>
            Mangunjaya,{" "}
            {new Date(
              surat.tanggal_verifikasi || Date.now()
            ).toLocaleDateString("id-ID")}
          </p>
          <p>Ketua RT 016</p>
          <br /><br /><br />
          <b>( Nama Ketua RT )</b>
        </div>
      </div>

      {/* STYLE */}
      <style>{`
        @page {
          size: A4;
          margin: 3cm;
        }

        body {
          font-family: "Times New Roman", serif;
        }

        .print-wrapper {
          background: #f3f4f6;
          min-height: 100vh;
          padding: 20px;
        }

        .action button, .action a {
          margin-right: 10px;
          padding: 8px 14px;
          background: #1f2937;
          color: white;
          text-decoration: none;
          border: none;
          cursor: pointer;
        }

        .surat {
          background: white;
          padding: 40px;
          max-width: 800px;
          margin: auto;
        }

        .kop {
          text-align: center;
          line-height: 1.4;
        }

        hr {
          border: 2px solid black;
          margin: 20px 0;
        }

        .judul {
          text-align: center;
          text-decoration: underline;
          margin-bottom: 30px;
        }

        .isi {
          text-align: justify;
          line-height: 1.7;
          margin-bottom: 16px;
        }

        .data td {
          padding: 6px;
        }

        .ttd {
          margin-top: 60px;
          text-align: right;
        }

        @media print {
          .no-print {
            display: none;
          }
          .print-wrapper {
            background: white;
            padding: 0;
          }
        }
      `}</style>
    </div>
  )
}
