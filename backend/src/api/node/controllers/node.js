'use strict';

/**
 * node controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::node.node');
