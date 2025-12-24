import {
  TEMPLATE_DOMISILI,
  TEMPLATE_USAHA,
  TEMPLATE_SKTm
} from "../utils/templateSurat.js"

export const verifikasiSurat = async (req, res) => {
  const { status, catatan_rt } = req.body
  const surat = await Surat.findByPk(req.params.id, {
    include: Warga
  })

  if (!surat) return res.status(404).json({ message: "Surat tidak ditemukan" })

  let isiSurat = null

  if (status === "disetujui") {
    const data = {
      nomor_surat: `016/RT-SURAT/${new Date().getFullYear()}`,
      nama: surat.Warga.nama,
      nik: surat.Warga.nik,
      alamat: surat.Warga.alamat,
      keperluan: surat.keperluan,
      tanggal: new Date().toLocaleDateString("id-ID")
    }

    if (surat.jenis_surat === "Domisili") {
      isiSurat = TEMPLATE_DOMISILI(data)
    } else if (surat.jenis_surat === "Usaha") {
      isiSurat = TEMPLATE_USAHA(data)
    } else {
      isiSurat = TEMPLATE_SKTm(data)
    }
  }

  await surat.update({
    status,
    catatan_rt,
    isi_surat: isiSurat,
    tanggal_verifikasi: new Date()
  })

  res.json({ message: "Surat berhasil diverifikasi" })
}
