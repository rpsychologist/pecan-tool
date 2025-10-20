'use strict';

/**
 * network router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::network.network', {
    config: {
      find: {
        middlewares: ["api::network.network-filter-middleware"]
      },
      findOne: {
        middlewares: ["api::network.network-filter-middleware"]
      },
    }
  });