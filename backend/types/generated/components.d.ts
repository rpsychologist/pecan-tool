import type { Schema, Attribute } from '@strapi/strapi';

export interface ElementsCustomNode extends Schema.Component {
  collectionName: 'components_elements_custom_nodes';
  info: {
    displayName: 'customNode';
    icon: 'quote';
    description: '';
  };
  attributes: {
    enabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    questionPrompt: Attribute.String;
    causePrompt: Attribute.String;
    buttonLabel: Attribute.String;
    inputPlaceholder: Attribute.String;
    inputLabel: Attribute.String;
    submitButtonLabel: Attribute.String;
  };
}

export interface ElementsErrorMessages extends Schema.Component {
  collectionName: 'components_elements_error_messages';
  info: {
    displayName: 'errorMessages';
    icon: 'rocket';
  };
  attributes: {
    mustChooseTwoProblems: Attribute.String;
    allQuestionsRequired: Attribute.String;
  };
}

export interface ElementsFeatureColumn extends Schema.Component {
  collectionName: 'components_slices_feature_columns';
  info: {
    name: 'FeatureColumn';
    displayName: 'Feature column';
    icon: 'align-center';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    icon: Attribute.Media & Attribute.Required;
  };
}

export interface ElementsFeatureRow extends Schema.Component {
  collectionName: 'components_slices_feature_rows';
  info: {
    name: 'FeatureRow';
    displayName: 'Feature row';
    icon: 'arrows-alt-h';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    media: Attribute.Media & Attribute.Required;
    link: Attribute.Component<'links.link'>;
  };
}

export interface ElementsFeature extends Schema.Component {
  collectionName: 'components_elements_features';
  info: {
    displayName: 'Feature';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    media: Attribute.Media;
    showLink: Attribute.Boolean & Attribute.DefaultTo<false>;
    newTab: Attribute.Boolean & Attribute.DefaultTo<false>;
    url: Attribute.String;
    text: Attribute.String;
  };
}

export interface ElementsFooterSection extends Schema.Component {
  collectionName: 'components_links_footer_sections';
  info: {
    name: 'FooterSection';
    displayName: 'Footer section';
    icon: 'chevron-circle-down';
  };
  attributes: {
    title: Attribute.String;
    links: Attribute.Component<'links.link', true>;
  };
}

export interface ElementsLinkRankingItemSliderLabels extends Schema.Component {
  collectionName: 'components_elements_link_ranking_item_slider_labels';
  info: {
    displayName: 'linkRankingItemSliderLabels';
    icon: 'bulletList';
  };
  attributes: {
    minLabel: Attribute.String;
    midLabel: Attribute.String;
    maxLabel: Attribute.String;
  };
}

export interface ElementsLogos extends Schema.Component {
  collectionName: 'components_elements_logos';
  info: {
    name: 'logos';
    displayName: 'Logos';
    icon: 'apple-alt';
  };
  attributes: {
    title: Attribute.String;
    logo: Attribute.Media;
  };
}

export interface ElementsNotificationBanner extends Schema.Component {
  collectionName: 'components_elements_notification_banners';
  info: {
    name: 'NotificationBanner';
    displayName: 'Notification banner';
    icon: 'exclamation';
    description: '';
  };
  attributes: {
    type: Attribute.Enumeration<['alert', 'info', 'warning']> &
      Attribute.Required;
    heading: Attribute.String & Attribute.Required;
    text: Attribute.Text & Attribute.Required;
    show: Attribute.Boolean & Attribute.DefaultTo<false>;
    link: Attribute.Component<'links.link'>;
  };
}

export interface ElementsOnboardingNode extends Schema.Component {
  collectionName: 'components_elements_onboarding_nodes';
  info: {
    displayName: 'OnboardingNode';
  };
  attributes: {
    questionPrompt: Attribute.String;
    causePrompt: Attribute.String;
    label: Attribute.String;
    nodeId: Attribute.String;
  };
}

export interface ElementsOnboardingStep extends Schema.Component {
  collectionName: 'components_elements_onboarding_steps';
  info: {
    displayName: 'onboardingStep';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    content: Attribute.RichText;
    offset: Attribute.Integer;
    placement: Attribute.Enumeration<['bottom', 'center', 'left']>;
    target: Attribute.Enumeration<
      [
        'body',
        '.nodeSelectStep',
        '.nodeRankingStep',
        '.linkRatingStep',
        'g#nodes'
      ]
    >;
  };
}

export interface ElementsPlan extends Schema.Component {
  collectionName: 'components_elements_plans';
  info: {
    name: 'plan';
    displayName: 'Pricing plan';
    icon: 'search-dollar';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.Text;
    isRecommended: Attribute.Boolean;
    price: Attribute.Decimal;
    pricePeriod: Attribute.String;
    product_features: Attribute.Relation<
      'elements.plan',
      'oneToMany',
      'api::product-feature.product-feature'
    >;
  };
}

export interface ElementsProblemRankerSliderLabels extends Schema.Component {
  collectionName: 'components_elements_problem_ranker_slider_labels';
  info: {
    displayName: 'problemRankerSliderLabels';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    minLabel: Attribute.String;
    midLabel: Attribute.String;
    maxLabel: Attribute.String;
  };
}

export interface ElementsTeamMember extends Schema.Component {
  collectionName: 'components_elements_team_members';
  info: {
    displayName: 'Team member';
    icon: 'angry';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    title: Attribute.String & Attribute.Required;
    picture: Attribute.Media & Attribute.Required;
    links: Attribute.Component<'links.icon-link', true>;
  };
}

export interface ElementsTestimonial extends Schema.Component {
  collectionName: 'components_slices_testimonials';
  info: {
    name: 'Testimonial';
    displayName: 'Testimonial';
    icon: 'user-check';
    description: '';
  };
  attributes: {
    picture: Attribute.Media & Attribute.Required;
    text: Attribute.Text & Attribute.Required;
    authorName: Attribute.String & Attribute.Required;
  };
}

export interface LayoutFooter extends Schema.Component {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
    description: '';
  };
  attributes: {
    footerLogo: Attribute.Component<'layout.logo'>;
    menuLinks: Attribute.Component<'links.link', true>;
    legalLinks: Attribute.Component<'links.link', true>;
    socialLinks: Attribute.Component<'links.social-link', true>;
  };
}

export interface LayoutLogo extends Schema.Component {
  collectionName: 'components_layout_logos';
  info: {
    displayName: 'Logo';
    description: '';
  };
  attributes: {
    logoImg: Attribute.Media & Attribute.Required;
    logoText: Attribute.String;
  };
}

export interface LayoutNavbar extends Schema.Component {
  collectionName: 'components_layout_navbars';
  info: {
    name: 'Navbar';
    displayName: 'Navbar';
    icon: 'map-signs';
    description: '';
  };
  attributes: {
    links: Attribute.Component<'links.link', true>;
    button: Attribute.Component<'links.button-link'>;
    navbarLogo: Attribute.Component<'layout.logo'>;
    show: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface LinksButtonLink extends Schema.Component {
  collectionName: 'components_links_buttons';
  info: {
    name: 'Button-link';
    displayName: 'Button link';
    icon: 'fingerprint';
    description: '';
  };
  attributes: {
    url: Attribute.String;
    newTab: Attribute.Boolean & Attribute.DefaultTo<false>;
    text: Attribute.String;
    type: Attribute.Enumeration<['primary', 'secondary']>;
  };
}

export interface LinksButton extends Schema.Component {
  collectionName: 'components_links_simple_buttons';
  info: {
    name: 'Button';
    displayName: 'Button';
    icon: 'fingerprint';
    description: '';
  };
  attributes: {
    text: Attribute.String;
    type: Attribute.Enumeration<['primary', 'secondary']>;
  };
}

export interface LinksIconLink extends Schema.Component {
  collectionName: 'components_links_icon_links';
  info: {
    displayName: 'Icon link';
    icon: 'link';
  };
  attributes: {
    url: Attribute.String & Attribute.Required;
    icon: Attribute.Enumeration<['github', 'twitter', 'mastodon', 'website']>;
  };
}

export interface LinksLink extends Schema.Component {
  collectionName: 'components_links_links';
  info: {
    name: 'Link';
    displayName: 'Link';
    icon: 'link';
    description: '';
  };
  attributes: {
    url: Attribute.String & Attribute.Required;
    newTab: Attribute.Boolean & Attribute.DefaultTo<false>;
    text: Attribute.String & Attribute.Required;
  };
}

export interface LinksSocialLink extends Schema.Component {
  collectionName: 'components_links_social_links';
  info: {
    displayName: 'Social Link';
    description: '';
  };
  attributes: {
    url: Attribute.String & Attribute.Required;
    newTab: Attribute.Boolean & Attribute.DefaultTo<false>;
    text: Attribute.String & Attribute.Required;
    social: Attribute.Enumeration<['YOUTUBE', 'TWITTER', 'DISCORD', 'WEBSITE']>;
  };
}

export interface MetaMetadata extends Schema.Component {
  collectionName: 'components_meta_metadata';
  info: {
    name: 'Metadata';
    displayName: 'Metadata';
    icon: 'robot';
    description: '';
  };
  attributes: {
    metaTitle: Attribute.String & Attribute.Required;
    metaDescription: Attribute.Text & Attribute.Required;
  };
}

export interface NetworkBuilderIntroduction extends Schema.Component {
  collectionName: 'components_network_builder_introductions';
  info: {
    displayName: 'Introduction';
    icon: '';
    description: '';
  };
  attributes: {
    header: Attribute.String;
    intro: Attribute.RichText;
    buttonStartLabel: Attribute.String;
    buttonLoadNetworkLabel: Attribute.String;
    showButtonLoadNetwork: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface NetworkBuilderLinkRankingIntroStep extends Schema.Component {
  collectionName: 'components_network_builder_link_ranking_intro_steps';
  info: {
    displayName: 'Link Ranking Intro Step';
  };
  attributes: {
    header: Attribute.String;
    introduction: Attribute.RichText;
  };
}

export interface NetworkBuilderLinkRankingStep extends Schema.Component {
  collectionName: 'components_network_builder_link_ranking_steps';
  info: {
    displayName: 'Link Ranking Step';
    description: '';
  };
  attributes: {
    itemHeader: Attribute.String;
    sliderLabels: Attribute.Component<'elements.link-ranking-item-slider-labels'>;
    sliderHideValue: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface NetworkBuilderNodeClarificationStep extends Schema.Component {
  collectionName: 'components_network_builder_node_clarification_steps';
  info: {
    displayName: 'Node Clarification Step';
    description: '';
  };
  attributes: {
    show: Attribute.Boolean & Attribute.DefaultTo<false>;
    introduction: Attribute.RichText;
    title: Attribute.String;
  };
}

export interface NetworkBuilderNodeRankingStep extends Schema.Component {
  collectionName: 'components_network_builder_node_ranking_steps';
  info: {
    displayName: 'Node Ranking Step';
    description: '';
  };
  attributes: {
    header: Attribute.String;
    introduction: Attribute.RichText;
    sliderLabels: Attribute.Component<'elements.problem-ranker-slider-labels'>;
    sliderColor: Attribute.Enumeration<['red', 'green']> &
      Attribute.DefaultTo<'red'>;
    sliderHideValue: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface NetworkBuilderNodeSelectStep extends Schema.Component {
  collectionName: 'components_network_builder_node_select_steps';
  info: {
    displayName: 'Node Select Step';
    description: '';
  };
  attributes: {
    header: Attribute.String;
    introduction: Attribute.RichText;
    maxNodes: Attribute.Integer;
  };
}

export interface NetworkBuilderOnboarding extends Schema.Component {
  collectionName: 'components_network_builder_onboardings';
  info: {
    displayName: 'onboarding';
    icon: 'question';
    description: '';
  };
  attributes: {
    show: Attribute.Boolean;
    first: Attribute.Component<'elements.onboarding-step'>;
    nodeSelectStep: Attribute.Component<'elements.onboarding-step'>;
    nodeRankingtep: Attribute.Component<'elements.onboarding-step'>;
    linkRatingStepOne: Attribute.Component<'elements.onboarding-step'>;
    linkRatingStepTwo: Attribute.Component<'elements.onboarding-step'>;
    last: Attribute.Component<'elements.onboarding-step'>;
    demoNodeOne: Attribute.Component<'elements.onboarding-node'>;
    demoNodeTwo: Attribute.Component<'elements.onboarding-node'>;
    buttonLabelNext: Attribute.String;
    buttonLabelBack: Attribute.String;
    buttonLabelLast: Attribute.String;
    buttonLabelSkip: Attribute.String;
    showSkipButton: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface NetworkBuilderScrollIndicator extends Schema.Component {
  collectionName: 'components_network_builder_scroll_indicators';
  info: {
    displayName: 'Scroll Indicator';
    icon: 'arrowDown';
  };
  attributes: {
    show: Attribute.Boolean;
    showIcon: Attribute.Boolean;
    label: Attribute.String;
  };
}

export interface NetworkBuilderSubmitStep extends Schema.Component {
  collectionName: 'components_network_builder_submit_steps';
  info: {
    displayName: 'Submit Step';
  };
  attributes: {
    header: Attribute.String;
    introduction: Attribute.RichText;
  };
}

export interface NetworkFeedbackCentrality extends Schema.Component {
  collectionName: 'components_network_feedback_centralities';
  info: {
    displayName: 'Centrality';
  };
  attributes: {
    show: Attribute.Boolean & Attribute.DefaultTo<false>;
    header: Attribute.String;
    body: Attribute.RichText;
    figureHeader: Attribute.String;
  };
}

export interface NetworkFeedbackDownloadData extends Schema.Component {
  collectionName: 'components_network_feedback_download_data';
  info: {
    displayName: 'Download Data';
    icon: 'file';
    description: '';
  };
  attributes: {
    show: Attribute.Boolean & Attribute.DefaultTo<false>;
    header: Attribute.String;
    body: Attribute.RichText;
    buttonLabel: Attribute.String;
    inputLabel: Attribute.String;
    inputDefaultValue: Attribute.String;
  };
}

export interface NetworkFeedbackDyadInvite extends Schema.Component {
  collectionName: 'components_network_feedback_dyad_invites';
  info: {
    displayName: 'Dyad Invite';
  };
  attributes: {
    header: Attribute.String;
    description: Attribute.RichText;
    footer: Attribute.RichText;
    enabled: Attribute.Boolean;
  };
}

export interface NetworkFeedbackEvaluationSurvey extends Schema.Component {
  collectionName: 'components_network_feedback_evaluation_surveys';
  info: {
    displayName: 'Evaluation Survey';
    icon: 'feather';
    description: '';
  };
  attributes: {
    show: Attribute.Boolean;
    header: Attribute.String;
    body: Attribute.RichText;
    url: Attribute.String;
    buttonLabel: Attribute.String;
    footer: Attribute.Text;
  };
}

export interface NetworkFeedbackFullNetwork extends Schema.Component {
  collectionName: 'components_network_feedback_full_networks';
  info: {
    displayName: 'Full Network';
  };
  attributes: {
    show: Attribute.Boolean & Attribute.DefaultTo<true>;
    header: Attribute.String;
    body: Attribute.RichText;
  };
}

export interface NetworkFeedbackIntroduction extends Schema.Component {
  collectionName: 'components_network_feedback_introductions';
  info: {
    displayName: 'Introduction';
  };
  attributes: {
    header: Attribute.String;
    body: Attribute.RichText;
  };
}

export interface NetworkFeedbackParticipantThanks extends Schema.Component {
  collectionName: 'components_network_feedback_participant_thanks';
  info: {
    displayName: 'Participant Thanks';
    icon: 'handHeart';
  };
  attributes: {
    show: Attribute.Boolean;
    header: Attribute.String;
    body: Attribute.RichText;
  };
}

export interface NetworkFeedbackSelectTarget extends Schema.Component {
  collectionName: 'components_network_feedback_select_targets';
  info: {
    displayName: 'SelectTarget';
    icon: 'bulletList';
  };
  attributes: {
    show: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface NetworkFeedbackShareUrl extends Schema.Component {
  collectionName: 'components_network_feedback_share_urls';
  info: {
    displayName: 'Share URL';
  };
  attributes: {
    show: Attribute.Boolean & Attribute.DefaultTo<true>;
    header: Attribute.String;
    body: Attribute.RichText;
  };
}

export interface NetworkFeedbackTargetNodeIncoming extends Schema.Component {
  collectionName: 'components_network_feedback_target_node_incomings';
  info: {
    displayName: 'Target Node Incoming';
    description: '';
  };
  attributes: {
    show: Attribute.Boolean & Attribute.DefaultTo<false>;
    header: Attribute.String;
    body: Attribute.RichText;
    zeroLinks: Attribute.RichText;
  };
}

export interface NetworkFeedbackTargetNodeOutgoing extends Schema.Component {
  collectionName: 'components_network_feedback_target_node_outgoings';
  info: {
    displayName: 'Target Node Outgoing';
    description: '';
  };
  attributes: {
    show: Attribute.Boolean & Attribute.DefaultTo<false>;
    header: Attribute.String;
    body: Attribute.RichText;
    zeroLinks: Attribute.RichText;
  };
}

export interface NetworkBuilder extends Schema.Component {
  collectionName: 'components_network_builders';
  info: {
    displayName: 'Builder';
    icon: 'file';
    description: '';
  };
  attributes: {
    introStep: Attribute.Component<'network-builder.introduction'>;
    onboarding: Attribute.Component<'network-builder.onboarding'>;
    nodeSelectStep: Attribute.Component<'network-builder.node-select-step'>;
    nodeClarificationStep: Attribute.Component<'network-builder.node-clarification-step'>;
    nodeRankingStep: Attribute.Component<'network-builder.node-ranking-step'>;
    linkRankingIntroStep: Attribute.Component<'network-builder.link-ranking-intro-step'>;
    linkRankingStep: Attribute.Component<'network-builder.link-ranking-step'>;
    submitStep: Attribute.Component<'network-builder.submit-step'>;
    errorMessages: Attribute.Component<'elements.error-messages'>;
    customNode: Attribute.Component<'elements.custom-node'>;
    buttonBackLabel: Attribute.String;
    buttonNextLabel: Attribute.String;
    responseDirection: Attribute.Enumeration<['incoming', 'outgoing']>;
    responsesRequired: Attribute.Boolean;
    scrollIndicator: Attribute.Component<'network-builder.scroll-indicator'>;
  };
}

export interface NetworkFeedback extends Schema.Component {
  collectionName: 'components_network_feedbacks';
  info: {
    displayName: 'Feedback';
    icon: 'rotate';
    description: '';
  };
  attributes: {
    targetNode: Attribute.Relation<
      'network.feedback',
      'oneToOne',
      'api::node.node'
    >;
    introduction: Attribute.Component<'network-feedback.introduction'>;
    dyadInvite: Attribute.Component<'network-feedback.dyad-invite'>;
    targetNodeIncoming: Attribute.Component<'network-feedback.target-node-incoming'>;
    targetNodeOutgoing: Attribute.Component<'network-feedback.target-node-outgoing'>;
    centrality: Attribute.Component<'network-feedback.centrality'>;
    fullNetwork: Attribute.Component<'network-feedback.full-network'>;
    participantThanks: Attribute.Component<'network-feedback.participant-thanks'>;
    evaluationSurvey: Attribute.Component<'network-feedback.evaluation-survey'>;
    shareUrl: Attribute.Component<'network-feedback.share-url'>;
    downloadData: Attribute.Component<'network-feedback.download-data'>;
    selectTarget: Attribute.Component<'network-feedback.select-target'>;
  };
}

export interface NetworkNodeClarification extends Schema.Component {
  collectionName: 'components_network_node_clarifications';
  info: {
    displayName: 'nodeClarification';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    item: Attribute.String;
    itemId: Attribute.String;
  };
}

export interface NetworkNodeOverrides extends Schema.Component {
  collectionName: 'components_network_node_overrides';
  info: {
    displayName: 'nodeOverrides';
    description: '';
  };
  attributes: {
    customRole: Attribute.Relation<
      'network.node-overrides',
      'oneToOne',
      'api::custom-role.custom-role'
    >;
    questionPrompt: Attribute.String;
    causePrompt: Attribute.String;
    title: Attribute.String;
  };
}

export interface NetworkRoleCustomization extends Schema.Component {
  collectionName: 'components_network_role_customizations';
  info: {
    displayName: 'Role Customization';
    icon: 'user';
    description: '';
  };
  attributes: {
    customRole: Attribute.Relation<
      'network.role-customization',
      'oneToOne',
      'api::custom-role.custom-role'
    >;
    title: Attribute.String;
    feedback: Attribute.Component<'network.feedback'>;
    networkBuilder: Attribute.Component<'network.builder'>;
  };
}

export interface SectionsBottomActions extends Schema.Component {
  collectionName: 'components_slices_bottom_actions';
  info: {
    name: 'BottomActions';
    displayName: 'Bottom actions';
    icon: 'angle-double-right';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    buttons: Attribute.Component<'links.button-link', true>;
    description: Attribute.Text;
  };
}

export interface SectionsFeatureColumnsGroup extends Schema.Component {
  collectionName: 'components_slices_feature_columns_groups';
  info: {
    name: 'FeatureColumnsGroup';
    displayName: 'Feature columns group';
    icon: 'star-of-life';
  };
  attributes: {
    features: Attribute.Component<'elements.feature-column', true>;
  };
}

export interface SectionsFeatureRowsGroup extends Schema.Component {
  collectionName: 'components_slices_feature_rows_groups';
  info: {
    name: 'FeatureRowsGroup';
    displayName: 'Feaures row group';
    icon: 'bars';
  };
  attributes: {
    features: Attribute.Component<'elements.feature-row', true>;
  };
}

export interface SectionsFeatures extends Schema.Component {
  collectionName: 'components_layout_features';
  info: {
    displayName: 'Features';
    description: '';
  };
  attributes: {
    heading: Attribute.String;
    description: Attribute.Text;
    feature: Attribute.Component<'elements.feature', true>;
  };
}

export interface SectionsHeading extends Schema.Component {
  collectionName: 'components_sections_headings';
  info: {
    displayName: 'Heading';
  };
  attributes: {
    heading: Attribute.String & Attribute.Required;
    description: Attribute.String;
  };
}

export interface SectionsHero extends Schema.Component {
  collectionName: 'components_slices_heroes';
  info: {
    name: 'Hero';
    displayName: 'Hero';
    icon: 'heading';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.String & Attribute.Required;
    picture: Attribute.Media & Attribute.Required;
    buttons: Attribute.Component<'links.button-link', true>;
  };
}

export interface SectionsLargeVideo extends Schema.Component {
  collectionName: 'components_slices_large_videos';
  info: {
    name: 'LargeVideo';
    displayName: 'Large video';
    icon: 'play-circle';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.String;
    video: Attribute.Media & Attribute.Required;
    poster: Attribute.Media;
  };
}

export interface SectionsLeadForm extends Schema.Component {
  collectionName: 'components_sections_lead_forms';
  info: {
    name: 'Lead form';
    displayName: 'Lead form';
    icon: 'at';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    emailPlaceholder: Attribute.String;
    submitButton: Attribute.Component<'links.button'>;
    location: Attribute.String;
    description: Attribute.Text;
  };
}

export interface SectionsPricing extends Schema.Component {
  collectionName: 'components_sections_pricings';
  info: {
    name: 'Pricing';
    displayName: 'Pricing';
    icon: 'dollar-sign';
  };
  attributes: {
    title: Attribute.String;
    plans: Attribute.Component<'elements.plan', true>;
  };
}

export interface SectionsRichText extends Schema.Component {
  collectionName: 'components_sections_rich_texts';
  info: {
    name: 'RichText';
    displayName: 'Rich text';
    icon: 'text-height';
  };
  attributes: {
    content: Attribute.RichText;
  };
}

export interface SectionsTeam extends Schema.Component {
  collectionName: 'components_sections_teams';
  info: {
    displayName: 'Team';
    icon: 'address-card';
    description: '';
  };
  attributes: {
    teamMember: Attribute.Component<'elements.team-member', true>;
    title: Attribute.String;
    description: Attribute.Text;
  };
}

export interface SectionsTestimonialsGroup extends Schema.Component {
  collectionName: 'components_slices_testimonials_groups';
  info: {
    name: 'TestimonialsGroup';
    displayName: 'Testimonials group';
    icon: 'user-friends';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    testimonials: Attribute.Component<'elements.testimonial', true>;
  };
}

export interface SharedMedia extends Schema.Component {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
    description: '';
  };
  attributes: {
    file: Attribute.Media;
  };
}

export interface SharedQuote extends Schema.Component {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    body: Attribute.Text & Attribute.Required;
    author: Attribute.String;
  };
}

export interface SharedRichText extends Schema.Component {
  collectionName: 'components_shared_rich_texts';
  info: {
    displayName: 'Rich text';
    icon: 'align-justify';
    description: '';
  };
  attributes: {
    body: Attribute.RichText;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    name: 'Seo';
    icon: 'allergies';
    displayName: 'Seo';
    description: '';
  };
  attributes: {
    metaTitle: Attribute.String & Attribute.Required;
    metaDescription: Attribute.Text & Attribute.Required;
    shareImage: Attribute.Media;
  };
}

export interface SharedSlider extends Schema.Component {
  collectionName: 'components_shared_sliders';
  info: {
    displayName: 'Slider';
    icon: 'address-book';
    description: '';
  };
  attributes: {
    files: Attribute.Media;
  };
}

export interface SharedVideoEmbed extends Schema.Component {
  collectionName: 'components_sections_video_embeds';
  info: {
    displayName: 'Video Embed';
    description: '';
  };
  attributes: {
    url: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'elements.custom-node': ElementsCustomNode;
      'elements.error-messages': ElementsErrorMessages;
      'elements.feature-column': ElementsFeatureColumn;
      'elements.feature-row': ElementsFeatureRow;
      'elements.feature': ElementsFeature;
      'elements.footer-section': ElementsFooterSection;
      'elements.link-ranking-item-slider-labels': ElementsLinkRankingItemSliderLabels;
      'elements.logos': ElementsLogos;
      'elements.notification-banner': ElementsNotificationBanner;
      'elements.onboarding-node': ElementsOnboardingNode;
      'elements.onboarding-step': ElementsOnboardingStep;
      'elements.plan': ElementsPlan;
      'elements.problem-ranker-slider-labels': ElementsProblemRankerSliderLabels;
      'elements.team-member': ElementsTeamMember;
      'elements.testimonial': ElementsTestimonial;
      'layout.footer': LayoutFooter;
      'layout.logo': LayoutLogo;
      'layout.navbar': LayoutNavbar;
      'links.button-link': LinksButtonLink;
      'links.button': LinksButton;
      'links.icon-link': LinksIconLink;
      'links.link': LinksLink;
      'links.social-link': LinksSocialLink;
      'meta.metadata': MetaMetadata;
      'network-builder.introduction': NetworkBuilderIntroduction;
      'network-builder.link-ranking-intro-step': NetworkBuilderLinkRankingIntroStep;
      'network-builder.link-ranking-step': NetworkBuilderLinkRankingStep;
      'network-builder.node-clarification-step': NetworkBuilderNodeClarificationStep;
      'network-builder.node-ranking-step': NetworkBuilderNodeRankingStep;
      'network-builder.node-select-step': NetworkBuilderNodeSelectStep;
      'network-builder.onboarding': NetworkBuilderOnboarding;
      'network-builder.scroll-indicator': NetworkBuilderScrollIndicator;
      'network-builder.submit-step': NetworkBuilderSubmitStep;
      'network-feedback.centrality': NetworkFeedbackCentrality;
      'network-feedback.download-data': NetworkFeedbackDownloadData;
      'network-feedback.dyad-invite': NetworkFeedbackDyadInvite;
      'network-feedback.evaluation-survey': NetworkFeedbackEvaluationSurvey;
      'network-feedback.full-network': NetworkFeedbackFullNetwork;
      'network-feedback.introduction': NetworkFeedbackIntroduction;
      'network-feedback.participant-thanks': NetworkFeedbackParticipantThanks;
      'network-feedback.select-target': NetworkFeedbackSelectTarget;
      'network-feedback.share-url': NetworkFeedbackShareUrl;
      'network-feedback.target-node-incoming': NetworkFeedbackTargetNodeIncoming;
      'network-feedback.target-node-outgoing': NetworkFeedbackTargetNodeOutgoing;
      'network.builder': NetworkBuilder;
      'network.feedback': NetworkFeedback;
      'network.node-clarification': NetworkNodeClarification;
      'network.node-overrides': NetworkNodeOverrides;
      'network.role-customization': NetworkRoleCustomization;
      'sections.bottom-actions': SectionsBottomActions;
      'sections.feature-columns-group': SectionsFeatureColumnsGroup;
      'sections.feature-rows-group': SectionsFeatureRowsGroup;
      'sections.features': SectionsFeatures;
      'sections.heading': SectionsHeading;
      'sections.hero': SectionsHero;
      'sections.large-video': SectionsLargeVideo;
      'sections.lead-form': SectionsLeadForm;
      'sections.pricing': SectionsPricing;
      'sections.rich-text': SectionsRichText;
      'sections.team': SectionsTeam;
      'sections.testimonials-group': SectionsTestimonialsGroup;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.video-embed': SharedVideoEmbed;
    }
  }
}
