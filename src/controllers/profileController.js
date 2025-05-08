const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { pasien: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const transformedUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
      pasien: user.pasien
        ? {
            id_pasien: user.pasien.id_pasien,
            nama: user.pasien.nama,
            noTelp: user.pasien.noTelp,
            alamat: user.pasien.alamat,
            tanggal_lahir: user.pasien.tanggal_lahir,
            jenis_kelamin: user.pasien.jenis_kelamin,
            profilePicture: user.pasien.profilePicture
              ? `http://localhost:3000/uploads/profile/${user.pasien.profilePicture}`
              : undefined,
          }
        : null,
      createdAt: user.createdAt,
    };

    res.json({ user: transformedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const { nama, noTelp, alamat, tanggal_lahir, jenis_kelamin } = req.body;
  const profilePicture = req.file; // dari multer middleware

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { pasien: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    let updateData = {};
    if (nama) updateData.nama = nama;
    if (noTelp) updateData.noTelp = noTelp;
    if (alamat) updateData.alamat = alamat;
    if (tanggal_lahir) updateData.tanggal_lahir = new Date(tanggal_lahir);
    if (jenis_kelamin) updateData.jenis_kelamin = jenis_kelamin;
    if (profilePicture) updateData.profilePicture = profilePicture.filename;

    // Jika pasien belum ada, buat baru
    if (!user.pasien) {
      await prisma.pasien.create({
        data: {
          user_id: userId,
          ...updateData,
        },
      });
    } else {
      await prisma.pasien.update({
        where: { id_pasien: user.pasien.id_pasien },
        data: updateData,
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { pasien: true },
    });

    res.json({
      message: "Profil berhasil diperbarui",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        pasien: updatedUser.pasien
          ? {
              id_pasien: updatedUser.pasien.id_pasien,
              nama: updatedUser.pasien.nama,
              noTelp: updatedUser.pasien.noTelp,
              alamat: updatedUser.pasien.alamat,
              tanggal_lahir: updatedUser.pasien.tanggal_lahir,
              jenis_kelamin: updatedUser.pasien.jenis_kelamin,
              profilePicture: updatedUser.pasien.profilePicture
                ? `http://localhost:3000/uploads/profile/${updatedUser.pasien.profilePicture}`
                : undefined,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};
