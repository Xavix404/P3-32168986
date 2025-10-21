export async function getAbout(req, res) {
  try {
    res.status(200).json({
      status: "success",
      data: {
        nombreCompleto: "Victor Xavier Misel Marquez",
        cedula: "32.168.986",
        seccion: "2",
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
}
