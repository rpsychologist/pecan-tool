'use strict';

/**
 * node service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::node.node');
