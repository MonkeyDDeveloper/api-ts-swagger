import { Route, Get, Tags, Query } from "tsoa";
import CurrencyProvider, { CurrencyProviderResponse } from "../api-providers/provider.interface";

interface DefaultResponse<T> {
    status: number;
    message?: string;
    data?: T
}

@Route("/api/currency")
export default class CurrencyController {

    public provider: CurrencyProvider;

    constructor(provider: CurrencyProvider) {
        this.provider = provider;
    }

    @Tags('CurrencyExchange')
    @Get("/")
    public async Get(): Promise<DefaultResponse<string>> {
        return {
            status: 200,
            data: "Hello World from controller"
        };
    }

    @Tags('CurrencyExchange')
    @Get("/getCurrency")
    public async GetCurrency(@Query() from: string, @Query() to: string, @Query() amount?: string): Promise<DefaultResponse<CurrencyProviderResponse>> {

        if (!from) {
            return {
                status: 400,
                message: "Missing from query parameter",
            }
        }
        if (!to) {
            return {
                status: 400,
                message: "Missing to query parameter",
            }
        }

        const response = await this.provider.getCurrency(from, to, amount);

        if (response instanceof Error) {
            return {
                status: 400,
                message: `Error solicitando datos del proveedor ${response.message}`
            }
        }

        return {
            status: 200,
            data: response
        }
    }
}