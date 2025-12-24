export const isRT = (req, res, next) => {
  if (req.user.role !== "rt") {
    return res.status(403).json({
      message: "Akses khusus Ketua RT"
    })
  }
  next()
}
