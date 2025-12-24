import mysql from "mysql2"

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sistem_rt"
})

db.connect(err => {
  if (err) {
    console.log("❌ DB ERROR:", err)
  } else {
    console.log("✅ Database connected")
  }
})

export default db
