// Simpan ke database
const pembayaranBaru = await prisma.pembayaran.create({
  data: {
    // Removed manual ID generation to use Prisma's default (CUID/UUID)
    // id_pembayaran: `PAY-${Date.now()}`,
    id_konsultasi: id_chat,
    metode_pembayaran: "midtrans",
    jumlah: 150000,
    status: "pending",
    id_pasien: konsultasi.id_pasien,
  },
});
