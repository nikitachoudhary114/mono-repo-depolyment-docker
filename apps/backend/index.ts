import { prismaClient } from "db/client";
import express from "express";

const app = express()
app.use(express.json())

app.get("/users", (req, res) => {
    prismaClient.user.findMany()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
        res.status(500).json({error: err.message})
    })
})


app.post("/user", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return
    }


    prismaClient.user.create({
        data: {
            username,
            password
        }
    })
        .then(user => {
            res.status(200).json({ message: "created user successfully", user });
        })
        .catch(err => {
        res.status(500).json({error: err.message})
    })
})


app.post("/todo", (req, res) => {
    const { task, userId } = req.body
    if (!task || !userId) {
        res.status(400).json({error: "both fields needed"})
    }
    prismaClient.todo.create({
        data: {
            task,
            userId
        }
    }).then(todo => {
        res.status(200).json(todo)
    }).catch(err => {
         res.status(500).json({ error: err.message });
    })
})


app.get("/todo", (req, res) => {
    const { userId } = req.body;
    prismaClient.todo.findMany({
        where: {
          userId: userId,
        },
      })
      .then((todo) => {
        res.status(200).json(todo);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });

})

app.put("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prismaClient.todo.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const updatedTask = await prismaClient.todo.update({
      where: { id },
      data: {
        done: !task.done,
      },
    });

    res.status(200).json(updatedTask);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(8080);
