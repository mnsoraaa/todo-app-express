import { log } from "console";
import express from "express"

const app = express();

const APP_PORT = process.env.APP_PORT || 3000;

let users = [
    { id: 1, name: "John" },
    { id: 2, name: "Wock" }
];

app.listen(APP_PORT, () => {
    console.log(`Running on port ${APP_PORT}`);
});

app.get("/", (request, response) => {
    response.send("Hello world!")
});

app.get("/api/users", (request, response) => {
    const { query: { filter, value } } = request;
    
    if (filter && value) {
        let filteredusers = users.filter((user) => user[filter].includes(value));
        return response.send(filteredusers);
    }
    
    return response.send(users);
});

app.patch("/api/users/:id", (request, response) => {
    let user = users.find((user) => user.id == request.params.id);
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
        return response.status(422).send({"message": "Invalid id"});
    }
    if (! user) {
        return response.status(404).send({"message": "Not found"});
    }
    return response.send(user);
})