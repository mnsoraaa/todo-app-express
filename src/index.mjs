import { log } from "console";
import express from "express"

const app = express();
app.use(express.json());

const APP_PORT = process.env.APP_PORT;

let users = [
    { id: 1, name: "John" },
    { id: 2, name: "Wock" }
];

const loggingMiddleware = (request, response, next) => {
    console.log(request.method + "-" + request.path);

    next();
}

const validateUserId = (request, response, next) => {
    const { params: { id } } = request;

    if (isNaN(id)) return response.status(422).send({"message": "Invalid id"});
    
    next();
}

app.listen(APP_PORT, () => {
    console.log(`Running on port ${APP_PORT}`);
});

app.use(loggingMiddleware);

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

app.patch("/api/users/:id", validateUserId, (request, response) => {
    let user = users.find((user) => user.id == request.params.id);

    const id = parseInt(request.params.id);

    return response.send(user);
});

