import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../../db.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0) {
        return res.status(401).json({ message: "User tidak ditemukan" });
      }

      const user = result[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ message: "Password salah" });
      }

      // ✅ TOKEN DITANDATANGANI DENGAN ENV
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          warga_id: user.warga_id
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        success: true,
        token,
        role: user.role
      });
    }
  );
});

export default router;
