import CurrencyController from "..";
import CachingServide from "../../api-providers/caching.service.interface";
import CurrencyProvider from "../../api-providers/provider.interface";

describe("Currency controller", () => {

    it("001: Should check the sum is correct", () => {
        const result = 1 + 1;
        expect(result).toBe(2)
    })

    it("002: Should return the default message for Get method", async () => {
        const CurrencyProviderStub = {

        } as CurrencyProvider

        const CachingServiceStub = {

        } as CachingServide

        const controller = new CurrencyController(CurrencyProviderStub, CachingServiceStub)

        const result = await controller.Get()

        expect(result.data).toBe("Hello World from controller")
    })

    it("003: Should return status 400 for missing 'from' parameter", async () => {
        const CurrencyProviderStub = {} as CurrencyProvider
        const CachingServiceStub = {} as CachingServide

        const controller = new CurrencyController(CurrencyProviderStub, CachingServiceStub)

        const result = await controller.GetCurrency("", "EUR")

        expect(result.status).toBe(400)

    })

    it("004: Should return status 400 for missing 'to' parameter", async () => {
        const CurrencyProviderStub = {} as CurrencyProvider
        const CachingServiceStub = {} as CachingServide

        const controller = new CurrencyController(CurrencyProviderStub, CachingServiceStub)

        const result = await controller.GetCurrency("USD", "")

        expect(result.status).toBe(400)

    })

    it("005: Should return third api response when no value in caching, and set it", async () => {
        const CurrencyProviderStub = {
            getCurrency: jest.fn().mockResolvedValue({
                amount: 100
            })
        } as unknown as CurrencyProvider
        const CachingServiceStub = {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(true)
        } as CachingServide

        const controller = new CurrencyController(CurrencyProviderStub, CachingServiceStub)

        const result = await controller.GetCurrency("USD", "EUR")

        expect(result.data?.amount).toBe(100)
        expect(CachingServiceStub.set).toHaveBeenCalled()
        expect(CurrencyProviderStub.getCurrency).toHaveBeenCalled()

    })

    it("006: Should return cached response if it is found", async () => {
        const CurrencyProviderStub = {
            getCurrency: jest.fn().mockResolvedValue({
                amount: 100
            })
        } as unknown as CurrencyProvider
        const CachingServiceStub = {
            get: jest.fn().mockResolvedValue({
                amount: 200
            }),
            set: jest.fn().mockResolvedValue(true)
        } as CachingServide

        const controller = new CurrencyController(CurrencyProviderStub, CachingServiceStub)

        const result = await controller.GetCurrency("USD", "EUR")

        expect(result.data?.amount).toBe(200)
        expect(CachingServiceStub.get).toHaveBeenCalledTimes(1)
        expect(CachingServiceStub.set).toHaveBeenCalledTimes(0)
        expect(CurrencyProviderStub.getCurrency).toHaveBeenCalledTimes(0)

    })

})