export const generateIsiSurat = (surat) => {
  switch (surat.jenis_surat) {
    case "domisili":
      return `
Adalah benar bahwa yang bersangkutan berdomisili dan menetap di wilayah
RT 016 / RW 012 Kelurahan Mangunjaya, Kecamatan Tambun Selatan, Kabupaten Bekasi.

Surat keterangan domisili ini dibuat untuk keperluan ${surat.keperluan}.
`

    case "usaha":
      return `
Adalah benar bahwa yang bersangkutan memiliki dan menjalankan usaha kecil
di lingkungan RT 016 / RW 012 Kelurahan Mangunjaya.

Surat keterangan usaha ini dibuat untuk keperluan ${surat.keperluan}.
`

    case "tidak_mampu":
      return `
Adalah benar bahwa yang bersangkutan merupakan warga kurang mampu
secara ekonomi dan berdomisili di lingkungan RT 016 / RW 012.

Surat keterangan tidak mampu ini dibuat untuk keperluan ${surat.keperluan}.
`

    default:
      return "Isi surat tidak tersedia."
  }
}
