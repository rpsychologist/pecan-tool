'use strict';
const crypto = require("crypto");

/**
 * network controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const createHash = async (message) => {
    if (!message) return message;
    const data = new TextEncoder().encode(message)
    const hash = await crypto.subtle.digest("SHA-256", data)
    return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(32).padStart(2, "0"))
        .join("")
        .toString()
}
const randomString = (size) => {
    const i2hex = (i) => ("0" + i.toString(16)).slice(-2)
    const r = (a, i) => a + i2hex(i)
    const bytes = crypto.getRandomValues(new Uint8Array(size))
    return Array.from(bytes).reduce(r, "")
}
module.exports = createCoreController(
    'api::network.network',
    ({ strapi }) => ({
        // Make sure we only return networks based on the unique uid tokens
        async findOne(ctx) {
            const { id } = ctx.params;
            const { query } = ctx;
            query.filters = { uid: { '$eq': id } }
            const entity = await strapi.service('api::network.network').find(query);
            const { results } = await this.sanitizeOutput(entity, ctx);

            if (!results || results.length === 0) {
                return ctx.notFound('Network not found');
            }

            // Check if network is older than 2 months
            const twoMonthsAgo = new Date();
            twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
            const networkCreatedAt = new Date(results[0].createdAt);
            
            if (networkCreatedAt < twoMonthsAgo) {
                return ctx.notFound('Network has expired');
            }

            const { data, url } = this.transformResponse(results[0]).data.attributes
  
            const network = {
                nodes: data.nodes,
                nodeCount: data.nodeCount,
                links: data.links,
                currentProgress: data.currentProgress,
                responseDirection: data.responseDirection,
                locale: data.locale,
                role: data.role
            }
            return { data: network, url }
        },
        async find(ctx) {
            return ctx.forbidden();
        },
        async update(ctx) {
            return ctx.forbidden();
        },
        async delete(ctx) {
            return ctx.forbidden();
        },
        async create(ctx) {
            // your custom logic for modifying the input
            const { data } = ctx.request.body;

            // ctx.request.body.data = {
            //     ...data, 
            //     uid: "1500"
            // }
            //ctx.query.body.uid =  Date.now(); 
            // Call the default parent controller action
            const result = await super.create(ctx);
            const id = result.data.id
            const uid = await createHash(id + randomString(32))
            const { networkData, userAgent, referrer, screen } = result.data.attributes.data
            const { locale } = networkData
            const result2 = await strapi
                .service('api::network.network')
                .update(
                    id,
                    {
                        data:
                        {
                            data: {
                                ...networkData,
                                currentProgress: networkData.currentProgress + 1,
                                referrer,
                                userAgent,
                                screen
                            },
                            uid,
                            url: `${process.env.FRONTEND_URL}/${locale}/network?id=${encodeURIComponent(uid)}`
                        }
                    }
                );

            return { url: result2.url };
        },
    }));