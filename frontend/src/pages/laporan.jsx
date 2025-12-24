import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../component/Sidebar1";
import api from "../services/Api";
import { useReactToPrint } from "react-to-print";

export default function Laporan() {
  const printRef = useRef(null);

  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [data, setData] = useState({
    pemasukan: 0,
    pengeluaran: 0,
    saldo: 0
  });

  const token = localStorage.getItem("token");

  const fetchLaporan = async () => {
    try {
      const res = await api.get(
        `/laporan/bulanan?bulan=${bulan}&tahun=${tahun}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData({
        pemasukan: Number(res.data?.pemasukan) || 0,
        pengeluaran: Number(res.data?.pengeluaran) || 0,
        saldo: Number(res.data?.saldo) || 0
      });
    } catch {
      setData({ pemasukan: 0, pengeluaran: 0, saldo: 0 });
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, [bulan, tahun]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Laporan_Kas_RT_016_${bulan}_${tahun}`
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-6 overflow-x-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-6">
          Laporan Kas Bulanan
        </h1>

        {/* FILTER */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <select
            value={bulan}
            onChange={e => setBulan(Number(e.target.value))}
            className="border p-2 rounded w-full sm:w-auto"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Bulan {i + 1}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={tahun}
            onChange={e => setTahun(Number(e.target.value))}
            className="border p-2 rounded w-full sm:w-28"
          />

          <button
            onClick={handlePrint}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded w-full sm:w-auto"
          >
            🖨 Cetak Laporan
          </button>
        </div>

        {/* ================= AREA CETAK ================= */}
        <div
          ref={printRef}
          className="bg-white mx-auto p-6 md:p-10 shadow rounded-lg print:shadow-none"
        >
          {/* KOP */}
          <div className="text-center border-b-4 border-black pb-4 mb-8">
            <h2 className="text-lg md:text-xl font-bold uppercase">
              RUKUN TETANGGA (RT) 016 / RW 012
            </h2>
            <p className="text-sm font-medium">Kelurahan Mangunjaya</p>
            <p className="text-sm">
              Kecamatan Tambun Selatan, Kabupaten Bekasi
            </p>
          </div>

          {/* JUDUL */}
          <h3 className="text-base md:text-lg font-bold text-center underline mb-6">
            LAPORAN PERTANGGUNGJAWABAN KAS RT
          </h3>

          {/* IDENTITAS */}
          <table className="mb-6 text-sm">
            <tbody>
              <tr>
                <td className="pr-4">Bulan</td>
                <td>: {bulan}</td>
              </tr>
              <tr>
                <td className="pr-4">Tahun</td>
                <td>: {tahun}</td>
              </tr>
            </tbody>
          </table>

          {/* PARAGRAF */}
          <p className="text-sm mb-4 text-justify">
            Dengan ini kami sampaikan laporan pertanggungjawaban
            keuangan kas RT 016 / RW 012 Kelurahan Mangunjaya
            untuk periode bulan {bulan} tahun {tahun},
            dengan rincian sebagai berikut:
          </p>

          {/* TABEL */}
          <div className="overflow-x-auto">
            <table className="w-full border border-collapse text-sm mb-6">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2 text-left">Uraian</th>
                  <th className="border p-2 text-right">Jumlah (Rp)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Total Pemasukan</td>
                  <td className="border p-2 text-right">
                    {data.pemasukan.toLocaleString("id-ID")}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">Total Pengeluaran</td>
                  <td className="border p-2 text-right">
                    {data.pengeluaran.toLocaleString("id-ID")}
                  </td>
                </tr>
                <tr className="font-bold">
                  <td className="border p-2">Saldo Akhir</td>
                  <td className="border p-2 text-right">
                    {data.saldo.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PENUTUP */}
          <p className="text-sm text-justify mb-10">
            Demikian laporan kas RT ini kami sampaikan dengan
            sebenar-benarnya. Atas perhatian dan kepercayaan
            seluruh warga, kami ucapkan terima kasih.
          </p>

          {/* TTD */}
          <div className="flex justify-end text-sm">
            <div className="text-center">
              <p>
                Mangunjaya, {new Date().toLocaleDateString("id-ID")}
              </p>
              <p className="mt-16 font-semibold">Ketua RT 016</p>
              <p className="mt-1">( __________________ )</p>
            </div>
          </div>
        </div>
      </main>

      {/* STYLE PRINT */}
      <style>{`
        @page {
          size: A4;
          margin: 25mm;
        }

        @media print {
          aside, button, select, input, h1 {
            display: none !important;
          }

          body {
            background: white;
          }

          div[ref] {
            width: 210mm !important;
            min-height: 297mm !important;
          }
        }
      `}</style>
    </div>
  );
}
