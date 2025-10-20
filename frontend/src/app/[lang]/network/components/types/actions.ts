import { Node, Link } from './state';

export type NetworkAction =
  | ShowBuilderAction
  | ShowOnboardingAction
  | HideOnboardingAction
  | LoadDataAction
  | AddCustomNodeAction
  | SelectNodeAction
  | ChangeNodeClarificationAction
  | ChangeNodeSizeAction
  | ChangeLinkSizeAction
  | HighlightNodeAction
  | ProgressIncreaseAction
  | ProgressSetAction
  | ProgressDecreaseAction
  | TrackDisplayTimeAction
  | SubmitSuccessAction;

interface ShowBuilderAction {
  type: 'show_builder';
}

interface ShowOnboardingAction {
  type: 'show_onboarding';
}

interface HideOnboardingAction {
  type: 'hide_onboarding';
}

interface LoadDataAction {
  type: 'load_data';
  data: any;
}

interface AddCustomNodeAction {
  type: 'add_custom_node';
  name: string;
  nodeType?: string;
  questionPrompt?: string;
  causePrompt?: string;
  maxNodes: number;
}

interface SelectNodeAction {
  type: 'select_node';
  id: string;
}

interface ChangeNodeClarificationAction {
  type: 'change_node_clarification';
  name: string;
  value: string;
}

interface ChangeNodeSizeAction {
  type: 'change_node_size';
  id: string;
  size: number;
}

interface ChangeLinkSizeAction {
  type: 'change_link_size';
  target: string;
  source: string;
  size: number;
}

interface HighlightNodeAction {
  type: 'highlight_node';
  value: string[];
}

interface ProgressIncreaseAction {
  type: 'progress_increase';
  errorMessages?: string[];
}

interface ProgressSetAction {
  type: 'progress_set';
  value: number;
}

interface ProgressDecreaseAction {
  type: 'progress_decrease';
}

interface TrackDisplayTimeAction {
  type: 'track_display_time';
  payload: {
    componentName: string;
    time: number;
  };
}

interface SubmitSuccessAction {
  type: 'submit_success';
  url: string;
} 