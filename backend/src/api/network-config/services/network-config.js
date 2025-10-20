'use strict';

/**
 * network-config service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::network-config.network-config');
