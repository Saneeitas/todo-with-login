const express = require("express");
const router = express.Router();
const prisma = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const loginAuth = require("../middleware/loginAuth");
const sendEmail = require("../util/email");

//REGISTER USER
router.post("/create", async (req, res) => {
  try {
    //get user input
    const {
      full_name,
      phone_number,
      username,
      email,
      userpassword,
      create_time,
    } = req.body;

    //validate user input
    if (!(full_name && phone_number && username && email && userpassword)) {
      return res.status(400).send("Signing input are required");
    }

    //check if user exist already
    //validate if user is existed in database
    const oldUser = await prisma.users.findFirst({
      where: {
        email: {
          contains: email,
        },
      },
    });
    if (oldUser) {
      return res.status(401).send("User Already exist");
    } else {
      //encryptPassword
      encryptPassword = await bcrypt.hash(userpassword, 10);
      //create user in database
      const create_time = new Date();
      const user = await prisma.users.create({
        data: {
          full_name: full_name,
          phone_number: phone_number,
          email: email,
          username: username,
          userpassword: encryptPassword,
          create_time: create_time,
        },
      });

      //create token
      const token = jwt.sign(
        { user_id: user.id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "90d",
        }
      );
      //save user token
      user.token = token;

      //return new user
       console.log(req.user);
      return res.status(200).json(user);
    }
  } catch (error) {
    //  next(error);
    return res.json(error.message);
  }
});

//USER LOG IN
router.post("/login", async (req, res) => {
  try {
    //get user input
    const { username, userpassword } = req.body;

    //validate user input
    if (!(username && userpassword)) {
      return res.status(400).send("Login input required");
    }

    //validate if user exist in database
    const user = await prisma.users.findFirst({
      where: {
        username: {
          contains: username,
        },
      },
    });
    //compare database username/password with the input
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    } else if (user.username === username && user &&
      (await bcrypt.compare(userpassword, user.userpassword))) {
      const token = jwt.sign(
        { user_id: user.id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "90d",
        }
      );
      //create token
      user.token = token;
      //return user
      console.log(req.user)
      return res.status(200).json(user);
    } else {
      return res.status(401).json({ message: "Incorrect login details" });
    }
  } catch (error) {
    return res.json(error.message);
  }
});

//SEND EMAIL TO ACTIVATE ACCOUNT
router.post("/sendEmail", async (req, res) => {
  try {
    const message = `Activate your account via this link
     "http://localhost:3000/account/activation"`;
    await sendEmail({
      subject: "Your account activation link",
      message,
    });
    return res.status(200).json({
      status: "success",
      message: "Activation email sent successfully",
    });
  } catch (error) {
    // return res.json(error.message);
    return res.json({ message: "Email not send! Try again" });
  }
});

//ACTIVATE USER
router.put("/activate", async (req, res) => {
  try {
    const { username, is_confirmed } = req.body;
    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }
    const find = await prisma.users.findFirst({
      where: {
        username: {
          contains: username,
        },
      },
    });

    if (find) {
      await prisma.users.update({
        where: {
          id: find.id,
        },
        data: {
          is_confirmed: 1,
        },
      });
      return res.status(200).json({
        message: "User activated",
      });
    }
    return res.status(404).json({
      message: "User not found",
    });
  } catch (error) {
    return res.json(error.message);
  }
});

//RESET PASSWORD
router.post("/reset", async (req, res, next) => {
  try {

  } catch (error) {
    return res.json(error.message);
  }
  return next();
});

//CHANGE PASSWORD
router.put("/change", async (req, res) => {
  try {
    const { userpassword, username } = req.body;
    if (!userpassword) {
      return res.status(400).json({ message: "Invalid input" });
    }
    encryptPassword = await bcrypt.hash(userpassword, 10);
    const find = await prisma.users.findFirst({
      where: {
        username: {
          contains: username,
        },
      },
    });
    if (find) {
      await prisma.users.update({
        where: {
          id: find.id,
        },
        data: {
          userpassword: encryptPassword,
        },
      });
      return res.status(200).json({
        message: "Password changed sucessfully",
      });
    }
    return res.status(404).json({
      message: "User not found",
    });
  } catch (error) {
    return res.json(error.message);
  }
});

//SIGN OUT
router.get("/signout", async (req, res, next) => {
  try {
    const authHeader =
    req.body.token || req.query.token || req.headers["x-access-token"];
    jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
      if (logout) {
        return res.send({ message: "You have been logout" });
      } else {
        return res.send({ message: "error" });
      }
    });
  } catch (error) {
    return res.json(error.message);
  }
  return next();
});

router.get("/users", async (req, res) => {
  const users = await prisma.users.findMany();
  return res.json(users);
});

module.exports = router;
