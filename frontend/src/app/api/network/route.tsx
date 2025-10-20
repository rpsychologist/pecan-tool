import { userAgent } from 'next/server'
const token = process.env.NEXT_INTERNAL_STRAPI_NETWORK_SUBMISSION_TOKEN;

const CF_ACCESS_CLIENT_ID = process.env.CF_ACCESS_CLIENT_ID
const CF_ACCESS_CLIENT_SECRET = process.env.CF_ACCESS_CLIENT_SECRET
export async function POST(req: Request) {

    const { networkData, referrer, screen } = await req.json()
    const response = await fetch(
        `${process.env.NEXT_INTERNAL_STRAPI_API_URL}/api/networks`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "CF-Access-Client-Id": CF_ACCESS_CLIENT_ID,
                "CF-Access-Client-Secret": CF_ACCESS_CLIENT_SECRET
            },
            body: JSON.stringify({
                data: {
                    data: {
                        networkData,
                        referrer,
                        userAgent: userAgent(req),
                        screen
                    }
                }
            })
        }
    )
    if (response?.status === 200) {
        const { url } = await response.json()
        return Response.json({ url })
    }
    else {
        return new Response(response?.statusText, { status: 500 })
    }
}