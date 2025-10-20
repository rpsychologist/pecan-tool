'use strict';

/**
 * network-config router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::network-config.network-config', {
    config: {
        find: {
          middlewares: ["api::network-config.network-config-populate-middleware"]
        },
        findOne: {
          middlewares: ["api::network-config.network-config-populate-middleware"]
        },
      }
});
