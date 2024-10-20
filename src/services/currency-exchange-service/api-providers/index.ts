import axios from "axios";
import CurrencyProvider, { CurrencyProviderResponse } from "./provider.interface";

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

export {
    AmdorenProvider
}