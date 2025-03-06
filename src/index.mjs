import express from "express";
import routes from "./routes/base.mjs";
import loggingMiddleware from "./middlewares/loggingMiddleware.mjs";

const app = express();
app.use(express.json());
app.use(loggingMiddleware);
app.use(routes);

const APP_PORT = process.env.APP_PORT || 3000;

// Start app server
app.listen(APP_PORT, () => {
    console.log(`Running on port ${APP_PORT}`);
});