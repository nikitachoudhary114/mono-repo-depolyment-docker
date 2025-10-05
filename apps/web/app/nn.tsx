import { prismaClient } from "db/client";

export default function hommme() {
    const todos = prismaClient.todo.findMany()
    return (
        <div>{JSON.stringify(todos)}</div>
    )
}