const express = require("express");
const router = express.Router();
const prisma = require("../db");
const loginAuth = require("../middleware/loginAuth");
const auth = require("../middleware/auth");

//CREATE TODO
router.post("/create", async (req, res) => {
  try {
    //get user input
    const { todo, create_time } = req.body;
    //validate user input
    if (!todo) {
      return res.status(400).send("todo input are required");
    }
    //check if todo exist already
    //validate if todo is existed in database
    const oldTodo = await prisma.todos.findFirst({
      where: {
        todo: {
          contains: todo,
        },
      },
    });
    if (oldTodo) {
      return res.send("Todo Already exist");
    }
    //create todo in database
    const date = new Date();
    await prisma.todos.create({
      data: {
        todo: todo,
        create_time: date,
      },
    });
    res.json({ message: "Todo created" });
  } catch (error) {
    return res.json(error.message);
  }
});

//UPDATE TODO
router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { todo } = req.body;
  await prisma.todos.update({
    where: {
      id: Number(id),
    },
    data: {
      todo,
    },
  });
  return res.json({
    message: "Todo Updated",
  });
});

//GET ALL TODO
router.get("/all", async (req, res) => {
  const allTodo = await prisma.todos.findMany();
  return res.json(allTodo);
});

//VIEW TODO FOR A DAY
router.get("/view/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await prisma.todos.findUnique({
    where: {
      id: Number(id),
    },
  });
  return res.json(todo);
});

//DELETE TODO
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.todos.delete({
      where: {
        id: Number(id),
      },
    });
    return res.json({
      message: "product deleted",
    });
  } catch (error) {
    return res.json(error.message);
  }
});

//COMPLETE TODO
router.put("/complete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_completed } = req.body;
    const completedTime = new Date();
    await prisma.todos.update({
      where: {
        id: Number(id),
      },
      data: {
        is_completed: is_completed,
        completed_time: completedTime,
      },
    });
    return res.json({
      message: "Todo Completed",
    });
  } catch (error) {
    return res.json(error.message);
  }
});

module.exports = router;
