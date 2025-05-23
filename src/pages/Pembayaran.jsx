import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createPembayaranChat,
  cekStatusPembayaran,
} from "../redux/actions/pembayaranAction";
import { toast } from "react-toastify";

const Pembayaran = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Gunakan useRef untuk menandai apakah API call sudah dilakukan untuk id_chat ini
  const hasProcessed = useRef({});

  const queryParams = new URLSearchParams(location.search);
  const id_chat = queryParams.get("id");
  console.log("ID Chat dari URL:", id_chat);

  useEffect(() => {
    if (!id_chat) {
      toast.warn("ID Chat tidak ditemukan.");
      navigate("/jadwal-konsultasi");
      return;
    }

    // Cek apakah proses untuk id_chat ini sudah pernah dijalankan
    if (hasProcessed.current[id_chat]) {
      console.log(
        `Process for id_chat ${id_chat} already initiated. Skipping.`
      );
      return;
    }

    // Tandai bahwa proses untuk id_chat ini akan dimulai
    hasProcessed.current[id_chat] = true;

    const processPayment = async () => {
      try {
        // unwrap() akan mengembalikan payload, yang dalam kasus ini adalah objek respons dari backend
        const responseData = await dispatch(
          createPembayaranChat({ id_chat })
        ).unwrap();

        console.log("Received data from createPembayaranChat:", responseData);

        // Akses properti 'data' di dalam objek respons
        const data = responseData?.data;

        if (data && data.paymentUrl) {
          toast.success(
            "Transaksi berhasil diproses. Mengarahkan ke Midtrans..."
          );
          window.location.href = data.paymentUrl; // Redirect browser ke Midtrans
        } else if (data && data.pembayaran) {
          const existingPayment = data.pembayaran;
          if (
            existingPayment.status === "paid" ||
            existingPayment.status === "sukses"
          ) {
            toast.success("Pembayaran untuk jadwal ini sudah lunas!");
            navigate(`/konsultasi?id=${id_chat}`);
          } else {
            toast.info(
              "Pembayaran untuk jadwal ini sudah ada dalam status pending/gagal. Mengecek status terbaru..."
            );
            const statusData = await dispatch(
              cekStatusPembayaran({ id_konsultasi: id_chat })
            ).unwrap();

            if (statusData && statusData.paymentUrl) {
              toast.info("Mengarahkan ke halaman pembayaran yang sudah ada...");
              window.location.href = statusData.paymentUrl;
            } else if (
              statusData &&
              (statusData.status === "paid" ||
                statusData.status === "sukses" ||
                statusData.status === "settlement")
            ) {
              toast.success("Pembayaran sudah lunas!");
              navigate(`/konsultasi?id=${id_chat}`);
            } else {
              toast.error(
                "Tidak dapat memproses pembayaran atau pembayaran belum lunas."
              );
              navigate("/jadwal-konsultasi");
            }
          }
        } else {
          console.error("Unexpected successful response structure:", data);
          toast.error("Gagal memproses respons pembayaran.");
          navigate("/jadwal-konsultasi");
        }
      } catch (err) {
        console.error("Error processing payment or checking status:", err);

        // Jika error spesifik mengatakan pembayaran sudah ada,
        // berdasarkan logika backend terbaru, ini seharusnya hanya terjadi jika statusnya 'sukses'.
        if (
          err &&
          typeof err === "string" &&
          err.includes("Pembayaran untuk jadwal ini sudah ada.")
        ) {
          toast.success("Pembayaran untuk jadwal ini sudah lunas!");
          navigate(`/konsultasi?id=${id_chat}`);
        } else {
          const errorMessage =
            err && typeof err === "string"
              ? err
              : "Terjadi kesalahan saat memproses pembayaran.";
          toast.error(errorMessage);
          navigate("/jadwal-konsultasi");
        }
      }
    };

    processPayment();
  }, [id_chat, dispatch, navigate]); // Dependencies

  // Komponen ini menampilkan pesan loading saat sedang memproses.
  return <div className="text-center py-20">Memuat data pembayaran...</div>;
};

export default Pembayaran;
