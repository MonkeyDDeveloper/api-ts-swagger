import { createClient } from "redis"

const getRedisClient = async () => {
    try {
        const client = await createClient({
            socket: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT)
            }
        })
            .on("error", (err) => {
                console.error(err)
                console.log(`Hubo un error conectandose a redis ${err.message}`)
            })
            .connect();

        const clientReady = client.isReady

        return clientReady ? client : null
    }
    catch (err) {
        console.error(err)
        console.log(`TRYCATCH Hubo un error conectandose a redis ${err}`)
        return null
    }
}

export default getRedisClient