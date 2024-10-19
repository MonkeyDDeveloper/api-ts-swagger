import { Request, Response } from "express";
import { Route, Get, Tags, Query } from "tsoa";

interface DefaultResponse<T> {
    status: number;
    message?: string;
    data?: T
}

@Route("/api/currency")
export default class CurrencyController {
    @Tags('CurrencyExchange')
    @Get("/")
    static async Get(): Promise<DefaultResponse<string>> {
        return {
            status: 200,
            data: "Hello World from controller"
        };
    }

    @Tags('CurrencyExchange')
    @Get("/getCurrency")
    static async GetCurrency(@Query() from: string, @Query() to: string, @Query() amount?: string): Promise<DefaultResponse<string>> {

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
        return {
            status: 200,
            data: JSON.stringify({ from, to, amount })
        }
    }
}