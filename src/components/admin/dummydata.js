// Dummy data untuk contoh
export const dummyUsers = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@example.com",
    phone: "081234567890",
    Kelamin: "Laki-Laki",
  },
  {
    id: 2,
    name: "Siti Rahayu",
    email: "siti@example.com",
    phone: "081234567891",
    Kelamin: "Perempuan",
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    email: "ahmad@example.com",
    phone: "081234567892",
    Kelamin: "Laki-Laki",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi@example.com",
    phone: "081234567893",
    Kelamin: "Perempuan",
  },
];

export const dummyAppointments = [
  {
    id: 1,
    patient: "Budi Santoso",
    service: "Pemeriksaan Gigi",
    date: "20 Mei 2024",
    time: "09:00",
    status: "Confirmed",
  },
  {
    id: 2,
    patient: "Siti Rahayu",
    service: "Pembersihan Karang Gigi",
    date: "21 Mei 2024",
    time: "10:30",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Ahmad Fauzi",
    service: "Tambal Gigi",
    date: "22 Mei 2024",
    time: "13:00",
    status: "Confirmed",
  },
  {
    id: 4,
    patient: "Dewi Lestari",
    service: "Konsultasi Ortodonti",
    date: "23 Mei 2024",
    time: "15:30",
    status: "Cancelled",
  },
];

export const dummyMedicalRecords = [
  {
    id: 1,
    patient: "Budi Santoso",
    diagnosis: "Karies gigi",
    treatment: "Tambal gigi",
    date: "15 Mei 2024",
    doctor: "drg. Irna",
  },
  {
    id: 2,
    patient: "Siti Rahayu",
    diagnosis: "Gingivitis",
    treatment: "Scaling",
    date: "10 Mei 2024",
    doctor: "drg. Andi",
  },
  {
    id: 3,
    patient: "Ahmad Fauzi",
    diagnosis: "Pulpitis",
    treatment: "Perawatan saluran akar",
    date: "5 Mei 2024",
    doctor: "drg. Irna",
  },
  {
    id: 4,
    patient: "Dewi Lestari",
    diagnosis: "Maloklusi",
    treatment: "Konsultasi ortodonti",
    date: "1 Mei 2024",
    doctor: "drg. Andi",
  },
];

export const dummyChats = [
  {
    id: 1,
    patient: "Budi Santoso",
    lastMessage: "Dok, gigi saya masih terasa nyeri setelah perawatan",
    time: "10:15",
    unread: true,
  },
  {
    id: 2,
    patient: "Siti Rahayu",
    lastMessage: "Terima kasih dokter atas sarannya",
    time: "Kemarin",
    unread: false,
  },
  {
    id: 3,
    patient: "Ahmad Fauzi",
    lastMessage: "Apakah saya perlu kontrol minggu depan?",
    time: "Kemarin",
    unread: true,
  },
  {
    id: 4,
    patient: "Dewi Lestari",
    lastMessage: "Baik dok, saya akan datang sesuai jadwal",
    time: "3 hari lalu",
    unread: false,
  },
];
