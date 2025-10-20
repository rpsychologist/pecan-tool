"use strict";

/**
 * `page-populate-middleware` middleware
 */


const networkBuilderPopulate = {
  introStep: true,
  onboarding: {
    populate: [
      'first',
      'nodeSelectStep',
      'nodeRankingtep',
      'linkRatingStepOne',
      'linkRatingStepTwo',
      'last',
      'nodeSelectPositive',
      'linkRankingPositive',
      'demoNodeOne',
      'demoNodeTwo'
    ]
  },
  nodeSelectStep: true,
  nodeClarificationStep: true,
  nodeRankingStep: {
    populate: {
      sliderLabels: true
    }
  },
  linkRankingIntroStep: true,
  linkRankingStep: {
    populate: {
      sliderLabels: true
    }
  },
  submitStep: true,
  problemRankerSliderLabels: true,
  linkRatingItemSliderLabels: true,
  errorMessages: true,
  customNode: true,
  scrollIndicator: true
}

const feedbackPopulate = {
  targetNode: true,
  introduction: true,
  dyadInvite: true,
  targetNodeIncoming: true,
  targetNodeOutgoing: true,
  centrality: true,
  fullNetwork: true,
  participantThanks: true,
  evaluationSurvey: true,
  shareUrl: true,
  downloadData: true,
  selectTarget: true
}

const populate = {
  "networkBuilder": {
    populate: networkBuilderPopulate
  },
  "feedback": {
    populate: feedbackPopulate
  },
  "roleCustomization": {
    populate: {
      customRole: true,
      networkBuilder: {
        populate: networkBuilderPopulate
      },
      feedback: {
        populate: feedbackPopulate
      }
    }
  }
}
module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    ctx.query = {
      populate,
      locale: ctx.query.locale,
    };
    await next();
  };
};
