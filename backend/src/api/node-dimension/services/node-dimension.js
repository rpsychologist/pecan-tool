'use strict';

/**
 * node-dimension service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::node-dimension.node-dimension');
