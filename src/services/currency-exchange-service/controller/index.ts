import { Route, Get, Tags, Query } from "tsoa";
import CurrencyProvider, { CurrencyProviderResponse } from "../api-providers/provider.interface";
import CachingService from "../api-providers/caching.service.interface";

interface DefaultResponse<T> {
    status: number;
    message?: string;
    data?: T
}

@Route("/api/currency")
export default class CurrencyController {

    public provider: CurrencyProvider;
    public cachingService: CachingService;

    constructor(provider: CurrencyProvider, cachingService: CachingService) {
        this.provider = provider;
        this.cachingService = cachingService;
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

        const cachedData = await this.cachingService.get(`${from}-${to}-${amount || 1}`);

        if (cachedData) {
            return {
                status: 200,
                data: cachedData
            }
        }

        const response = await this.provider.getCurrency(from, to, amount);

        if (response instanceof Error) {
            return {
                status: 400,
                message: `Error solicitando datos del proveedor ${response.message}`
            }
        }

        await this.cachingService.set(`${from}-${to}-${amount || 1}`, response);

        return {
            status: 200,
            data: response
        }

    }
}