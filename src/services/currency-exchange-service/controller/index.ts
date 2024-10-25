import { Route, Get, Tags, Query, Example, Response,  } from "tsoa";
import CurrencyProvider, { CurrencyProviderResponse } from "../controller-services/provider.interface";
import CachingService from "../controller-services/caching.service.interface";

interface DefaultResponse<T> {
    status: number;
    message?: string;
    data?: T
}

@Route("api_currency")
export default class CurrencyController {

    public provider: CurrencyProvider;
    public cachingService: CachingService;

    constructor(provider: CurrencyProvider, cachingService: CachingService) {
        this.provider = provider;
        this.cachingService = cachingService;
    }

    @Tags('CurrencyExchange')
    @Get("/")
    @Example<Omit<DefaultResponse<string>, 'status'>>({
        data: "string"
    })
    public Get(): DefaultResponse<string> {
        return {
            status: 200,
            data: "Hello World from controller"
        };
    }

    @Tags('CurrencyExchange')
    @Get("/get_currency")
    @Example<Omit<DefaultResponse<CurrencyProviderResponse>, 'status'>>({
        data: {
            amount: 10,
            error: 0,
            error_message: "string"
        }
    })
    @Response<Omit<DefaultResponse<string>, 'status'>>("400", "Bad Request", {
        message: "string"
    })
    @Response<Omit<DefaultResponse<string>, 'status'>>("500", "Internal Server Error", {
        message: "string"
    })
    public async GetCurrency(
        @Query() from: string, 
        @Query() to: string, 
        @Query() amount?: string): Promise<DefaultResponse<CurrencyProviderResponse>> {

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

        try {
            const cachedData = await this.cachingService.get(`${from}-${to}-${amount || 1}`);
            if (cachedData) {
                return {
                    status: 200,
                    data: cachedData
                }
            }
        }
        catch(err) {
            console.error(`Error obtaining data from caching service ${(err as Error).message}`)
        }

        const response = await this.provider.getCurrency(from, to, amount);

        if (response instanceof Error) {
            return {
                status: 500,
                message: `Error solicitando datos del proveedor ${response.message}`
            }
        }

        try {
            await this.cachingService.set(`${from}-${to}-${amount || 1}`, response);
        }
        catch(err) {
            console.error(`Error saving data on caching service ${(err as Error).message}`)
        }

        return {
            status: 200,
            data: response
        }

    }
}