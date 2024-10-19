import express, { json } from "express";
import responseTime from "response-time";
import dotEnv from "dotenv";
import services from "./services";
import swaggerUi from "swagger-ui-express";

dotEnv.config();

const PORT = process.env.EXPRESS_PORT || 3000;

const app = express();

app.use(json());
app.use(responseTime());
app.use('/api/currency', services.currencyRouter)
app.use('/public', express.static("public"));

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "/public/swagger.json",
        },
    })
);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => console.log(`Express server running on port: ${PORT}`))