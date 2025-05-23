import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PembayaranSuksesHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderIdFromQuery = queryParams.get("order_id");
    const transactionStatus = queryParams.get("transaction_status");
    // Anda bisa mengambil parameter lain jika perlu

    console.log("Redirected from Midtrans. Order ID:", orderIdFromQuery);
    console.log("Transaction Status:", transactionStatus);

    // --- Logika Penanganan Redirect --- //
    // Perlu diingat, status dari redirect ini hanya indikasi awal dari Midtrans.
    // Status final dan update database harus tetap mengandalkan Webhook Notification.
    // Namun, ini berguna untuk mengarahkan pengguna ke halaman yang tepat.

    if (!orderIdFromQuery) {
      toast.error("ID Transaksi tidak ditemukan.");
      console.error("No order_id found in redirect URL.");
      navigate("/jadwal-konsultasi"); // Arahkan jika tidak ada ID
      return;
    }

    // Arahkan ke halaman konsultasi (chat) menggunakan order_id sebagai path parameter
    // Rute /konsultasi/:id akan menangani ini
    toast.success(
      "Pembayaran terdeteksi. Mengarahkan ke halaman konsultasi..."
    );
    navigate(`/konsultasi/${orderIdFromQuery}`);

    // Catatan: Logika yang lebih kompleks berdasarkan transactionStatus dari redirect
    // bisa ditambahkan di sini jika diperlukan untuk feedback ke user, tapi
    // untuk update database, WAJIB pakai Webhook.
  }, [location, navigate]); // Dependency array

  return (
    <div className="text-center py-20">
      Memproses status pembayaran dan mengarahkan Anda ke konsultasi...
    </div>
  );
};

export default PembayaranSuksesHandler;
