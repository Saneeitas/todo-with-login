const db = require("../db");
const jwt = require("jsonwebtoken");
const { prisma } = require("@prisma/client");

const forgotPassword = (req, res) => {
    const { username } = req.body;
const user = await prisma.users.findFirst({
  where: {
    username: {
      contains: username,
    },
  }, 
});
 if (!user) {
   res.json({ message: "Username not exist" });
}
const tokenn = jwt.sign({ id: user.id }, process.env.RESET_PASSWORD_KEY, { expiresIn: "15m" });
}

module.exports = forgotPassword;