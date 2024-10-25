import axios from "axios";
import CurrencyProvider, { CurrencyProviderResponse } from "./provider.interface";
import CachingService from "./caching.service.interface";
import { createClient } from "redis";

const client = axios.create();

class AmdorenProvider implements CurrencyProvider {

    private uri: string;
    public apiKey: string;
    public baseUri: string;

    constructor(apiKey: string, baseUri: string) {
        this.apiKey = apiKey;
        this.baseUri = baseUri;
        this.uri = this.baseUri + "?" + `api_key=${this.apiKey}`;
    }

    async getCurrency(from: string, to: string, amount?: string): Promise<CurrencyProviderResponse | Error> {
        try {
            console.log(`${this.uri}&from=${from}&to=${to}&amount=${amount || 1}`)
            const response = await client.get<CurrencyProviderResponse>(`${this.uri}&from=${from}&to=${to}&amount=${amount || 1}`);
            if (response.status !== 200) throw new Error(response.statusText);
            return response.data;
        }
        catch (err) {
            return err as Error;
        }
    }
}

class RedisCachingService implements CachingService {

    private redisClient?: ReturnType<typeof createClient>;

    constructor() {
        this.connect()
    }

    async connect(): Promise<void> {
        try {
            this.redisClient = await createClient({
                socket: {
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT || "6379"),
                },
                password: process.env.REDIS_PASSWORD,
                username: process.env.REDIS_USER,
            })
                .on("error", (err) => {
                    console.log("Error connecting to redis");
                    console.log({err})
                })
                .connect();
        }
        catch (err) {
            console.log(`Error initializing redis caching service ${err}`);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await this.redisClient?.get(key);
            if (data) {
                return JSON.parse(data) as T;
            }
            return null;
        }
        catch (err) {
            console.log(`Error getting data from redis ${err}`);
            return null
        }
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        try {
            await this.redisClient?.set(key, JSON.stringify(value), { EX: ttl || 60 * 60 });
        }
        catch (err) {
            console.log(`Error setting data to redis ${err}`);
        }
    }

}

export {
    AmdorenProvider,
    RedisCachingService
}