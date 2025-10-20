import { useNodeSizeUpdates } from './useNodeSizeUpdates';
import { useLinkSizeUpdates } from './useLinkSizeUpdates';
import { useHighlightUpdates } from './useHighlightUpdates';
import { useLinkFilterUpdates } from './useLinkFilterUpdates';
import { useDistanceUpdates } from './useDistanceUpdates';
import { NetworkProps } from '../types/network-props';

interface UseNetworkUpdatesProps extends NetworkProps {}

export const useNetworkUpdates = (props: UseNetworkUpdatesProps) => {
  // Use specialized hooks for different update types
  useNodeSizeUpdates({ networkProps: props });
  useLinkSizeUpdates({ networkProps: props });
  useHighlightUpdates({ networkProps: props });
  useLinkFilterUpdates({ networkProps: props });
  useDistanceUpdates({ networkProps: props });
};
