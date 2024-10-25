export interface CurrencyProviderResponse {
    error?: number,
    error_message?: string,
    amount?: number
}

export default interface CurrencyProvider {
    baseUri: string,
    apiKey: string,
    getCurrency: (from: string, to: string, amount?: string) => Promise<CurrencyProviderResponse | Error>
}