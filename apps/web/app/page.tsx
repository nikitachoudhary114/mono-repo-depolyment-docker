"use client";

import { prismaClient } from "db/client";
import { useEffect, useState } from "react";
import hommme from "./nn"
// --- Types ---
type User = {
  id: string;
  username: string;
};

type Todo = {
  id: string;
  task: string;
  done: boolean;
  userId: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [task, setTask] = useState("");
  const [userId, setUserId] = useState("");

  // --- Load all users & todos ---
  useEffect(() => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);

    fetch("http://localhost:8080/todo", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }), // ⚠️ your backend expects userId in body, not ideal
    })
      .then((res) => res.json())
      .then(setTodos)
      .catch(console.error);
  }, []);

  // --- Create user ---
  const handleCreateUser = async () => {
    await fetch("http://localhost:8080/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const res = await fetch("http://localhost:8080/users");
    setUsers(await res.json());
  };

  // --- Create todo ---
  const handleCreateTodo = async () => {
    if (!task || !userId) {
      alert("Need both task and userId");
      return;
    }
    await fetch("http://localhost:8080/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, userId }),
    });

    const res = await fetch("http://localhost:8080/todo", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify("49f8624f-9f98-4a62-9f35-beda279657fb"),
    });
    setTodos(await res.json());
  };

  // --- Toggle todo done ---
  const handleToggleTodo = async (id: string) => {
    await fetch(`http://localhost:8080/todo/${id}`, { method: "PUT" });

    const res = await fetch("http://localhost:8080/todo", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setTodos(await res.json());
  };



  return (
    <div style={{ padding: "20px" }}>
      <h1>Users</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username} (id: {u.id})
          </li>
        ))}
      </ul>

      <h2>Create User</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleCreateUser}>Add User</button>

      <hr />

      <h1>Todos</h1>
      
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <span
              style={{
                textDecoration: t.done ? "line-through" : "none",
                cursor: "pointer",
              }}
              onClick={() => handleToggleTodo(t.id)}
            >
              {t.task}
            </span>{" "}
            (userId: {t.userId})
          </li>
        ))}
      </ul>

      <h2>Create Todo</h2>
      <input
        type="text"
        placeholder="Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleCreateTodo}>Add Todo</button>
    </div>
  );
}
