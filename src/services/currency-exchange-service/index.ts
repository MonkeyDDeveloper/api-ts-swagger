import { query, Router } from "express";
import CurrencyController from "./controller";

const currencyRouter = Router();

currencyRouter.get("/", async (_req, res) => {
    const message = await CurrencyController.Get();
    res.send(message);
});

currencyRouter.get("/getCurrency", async (req, res) => {
    const from = typeof req.query.from === "string" ? req.query.from : "";
    const to = typeof req.query.to === "string" ? req.query.to : "";
    const amount = typeof req.query.amount === "string" ? req.query.amount : "";
    const result = await CurrencyController.GetCurrency(from, to, amount);
    res.status(result.status).send(result)
})

export default currencyRouter;