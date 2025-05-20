const rekamMedisList = await prisma.rekam_Medis.findMany({
  include: {
    pasien: true,
    jenisTindakan: true,
  },
  where: {
    AND: [
      {},
      {
        pasien: {
          isNot: null,
        },
      },
    ],
  },
  skip: (page - 1) * limit,
  take: limit,
  orderBy: {
    createdAt: "desc",
  },
});
