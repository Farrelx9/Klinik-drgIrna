import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MidtransStatusHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order_id");
    const transactionStatus = queryParams.get("transaction_status");
    const statusCode = queryParams.get("status_code");
    // Midtrans juga bisa mengirim parameter lain seperti gross_amount, payment_type, signature_key, etc.

    console.log("Midtrans Redirect Params:", {
      orderId,
      transactionStatus,
      statusCode,
    });

    if (!orderId) {
      toast.error("ID Pesanan tidak ditemukan dari Midtrans.");
      console.error("No order_id found in URL params.");
      navigate("/jadwal-konsultasi"); // Arahkan ke halaman jadwal jika tidak ada order_id
      return;
    }

    console.log(
      `Processing status for orderId: ${orderId}, status: ${transactionStatus}`
    );

    // Logika berdasarkan transaction_status dari Midtrans
    // Lihat dokumentasi Midtrans untuk daftar lengkap transaction_status
    // 'capture' untuk pembayaran kartu kredit yang berhasil dengan 3DS
    // 'settlement' untuk pembayaran non-kartu kredit yang berhasil
    // 'pending' untuk transaksi pending
    // 'deny' untuk transaksi ditolak (kartu kredit)
    // 'cancel' untuk transaksi dibatalkan oleh pengguna atau sistem
    // 'expire' untuk transaksi kadaluarsa
    // 'failure' untuk transaksi gagal (non-kartu kredit)

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      // Pembayaran berhasil
      toast.success("Pembayaran berhasil!");
      console.log(
        `Payment successful, navigating to /konsultasi?id=${orderId}`
      );
      navigate(`/konsultasi?id=${orderId}`); // Arahkan ke halaman chat dengan ID pesanan
    } else if (transactionStatus === "pending") {
      // Pembayaran pending
      toast.info(
        "Pembayaran Anda sedang diproses. Mohon tunggu beberapa saat."
      );
      console.log(`Payment pending, navigating to /konsultasi?id=${orderId}`);
      navigate(`/konsultasi?id=${orderId}`); // Mungkin tetap arahkan ke chat, atau halaman status khusus
    } else if (
      transactionStatus === "deny" ||
      transactionStatus === "cancel" ||
      transactionStatus === "expire" ||
      transactionStatus === "failure"
    ) {
      // Pembayaran gagal atau dibatalkan
      toast.error("Pembayaran Anda gagal atau dibatalkan. Silakan coba lagi.");
      console.log(
        "Payment failed/cancelled, navigating to /jadwal-konsultasi."
      );
      navigate("/jadwal-konsultasi"); // Arahkan kembali ke halaman jadwal
    } else {
      // Status tidak dikenal atau lainnya
      toast.warn("Status pembayaran tidak dikenal.");
      console.log("Unknown payment status, navigating to /jadwal-konsultasi.");
      navigate("/jadwal-konsultasi"); // Arahkan kembali ke halaman jadwal
    }

    // Anda mungkin juga ingin memanggil API backend di sini untuk
    // memberitahukan status pembayaran yang diterima dari Midtrans,
    // meskipun webhook seharusnya sudah menangani pembaruan status utama.
    // Namun, untuk sekadar redirect di frontend, membaca param URL sudah cukup.
  }, [location, navigate]); // Dependencies agar useEffect berjalan saat URL berubah

  // Tampilkan sesuatu selagi memproses redirect
  return (
    <div className="text-center py-20">Memproses status pembayaran...</div>
  );
};

export default MidtransStatusHandler;
