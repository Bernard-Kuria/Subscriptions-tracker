import { Router } from "express";

const authRouter = Router();

authRouter.post("/sign-up", (req, res) => res.send({ tittle: "Sign up" }));
authRouter.post("/sign-in", (req, res) => res.send({ tittle: "Sign in" }));
authRouter.post("/sign-out", (req, res) => res.send({ tittle: "Sign out" }));

export default authRouter;
