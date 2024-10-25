import { query, Router } from "express";
import CurrencyController from "./controller";
import { RedisCachingService } from "./controller-services";
import { AmdorenProvider } from "./controller-services";
import dotEnv from "dotenv"

dotEnv.config();

const AMDOREN_BASE_URI = process.env.AMDOREN_BASE_URI || "";
const AMDOREN_API_TOKEN = process.env.AMDOREN_API_TOKEN || "";

const currencyController =
    new CurrencyController(
        new AmdorenProvider(AMDOREN_API_TOKEN, AMDOREN_BASE_URI),
        new RedisCachingService()
    );

const currencyRouter = Router();

currencyRouter.get("/", (req, res) => {
    try {
        const response = currencyController.Get()
        res.status(200).json(response)
    }
    catch(err) {
        res.status(500).json({
            message: (err as Error).message
        })
    }
});


currencyRouter.get("/get_currency", async (req, res) => {
    const from = typeof req.query.from === "string" ? req.query.from : "";
    const to = typeof req.query.to === "string" ? req.query.to : "";
    const amount = typeof req.query.amount === "string" ? req.query.amount : "";
    const result = await currencyController.GetCurrency(from, to, amount);
    res.status(result.status).send(result)
})

export default currencyRouter;