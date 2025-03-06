import { Router } from "express";

import authRouter from "./auth.mjs";
import userRouter from "./users.mjs";
import productRouter from "./products.mjs";

import verifyJwtToken from "../middlewares/authMiddleware.mjs";

const router = Router();

router.get('/', (request, response) => {
    response.send("Hello world!")
});

router.use(authRouter);

router.use(verifyJwtToken);

router.use(userRouter);
router.use(productRouter);

export default router;