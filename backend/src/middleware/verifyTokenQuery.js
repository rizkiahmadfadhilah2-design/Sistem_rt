import jwt from "jsonwebtoken"
const SECRET = "rt-secret-key"

export const verifyTokenQuery = (req, res, next) => {
  const token = req.query.token

  if (!token) {
    return res.status(401).json({ message: "Token tidak ada" })
  }

  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: "Token tidak valid" })
  }
}
