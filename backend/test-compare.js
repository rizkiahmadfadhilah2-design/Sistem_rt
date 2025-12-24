import bcrypt from "bcryptjs"

const password = "rt123"
const hash = "$2b$10$jt9LvmzP.NSA8xVl1B00yuWej5gQDD/s714gZfd/nIu1ZEwpBO88C"

bcrypt.compare(password, hash).then(result => {
  console.log("MATCH:", result)
})
