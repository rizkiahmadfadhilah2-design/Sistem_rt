import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  // 🔍 DEBUG (boleh dihapus kalau sudah normal)
  console.log("AUTH HEADER:", authHeader)
  console.log("JWT SECRET:", process.env.JWT_SECRET)

  // ❌ Tidak ada header Authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token tidak ada"
    })
  }

  const token = authHeader.split(" ")[1]
  console.log("TOKEN DITERIMA:", token)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // ❌ Token rusak / payload tidak sesuai
    if (!decoded || !decoded.role) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid"
      })
    }

    // ✅ Token valid
    req.user = decoded
    next()
  } catch (err) {
    console.error("JWT ERROR:", err.message)
    return res.status(401).json({
      success: false,
      message: "Token tidak valid"
    })
  }
}
