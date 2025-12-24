import bcrypt from "bcryptjs"

bcrypt.hash("uhuy1", 10).then(hash => {
  console.log(hash)
})
