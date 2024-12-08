import { useState, useEffect, useRef, useCallback } from 'react';

interface Node {
  id: string;
  label: string;
}

interface NodeHighlightingOptions {
  delay?: number;
  onAnimationComplete?: () => void;
}

interface AnimationState {
  currentHighlight: string | null;
  visitedNodes: Set<string>;
  currentIndex: number;
  sequence: string[];
}

interface UseNodeHighlightingReturn {
  currentHighlight: string | null;
  visitedNodes: Set<string>;
  isAnimating: boolean;
  highlightNodes: (nodeIds: string[]) => void;
  stopHighlighting: () => void;
}

export const useNodeHighlighting = ({
  delay = 500,
  onAnimationComplete
}: NodeHighlightingOptions = {}): UseNodeHighlightingReturn => {
  const [currentHighlight, setCurrentHighlight] = useState<string | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  
  const animationRef = useRef<{
    timeoutId: NodeJS.Timeout | null;
    sequence: string[];
    currentIndex: number;
  }>({
    timeoutId: null,
    sequence: [],
    currentIndex: 0
  });

  const cleanupAnimation = useCallback(() => {
    console.log('Cleaning up animation');
    if (animationRef.current.timeoutId) {
      clearTimeout(animationRef.current.timeoutId);
      animationRef.current.timeoutId = null;
    }
    animationRef.current.sequence = [];
    animationRef.current.currentIndex = 0;
    setIsAnimating(false);
    setCurrentHighlight(null);
    setVisitedNodes(new Set());
  }, []);

  const highlightNodes = useCallback((sequence: string[]) => {
    console.log('Starting highlight sequence:', sequence);
    cleanupAnimation();
    
    if (!sequence.length) {
      console.log('Empty sequence provided');
      return;
    }

    animationRef.current.sequence = sequence;
    setIsAnimating(true);

    const highlightNext = () => {
      const { currentIndex, sequence } = animationRef.current;
      
      if (currentIndex >= sequence.length) {
        console.log('Sequence complete');
        cleanupAnimation();
        onAnimationComplete?.();
        return;
      }

      const nodeId = sequence[currentIndex];
      console.log(`Highlighting node ${nodeId} (${currentIndex + 1}/${sequence.length})`);
      
      setCurrentHighlight(nodeId);
      setVisitedNodes(prev => new Set([...prev, nodeId]));
      
      animationRef.current.currentIndex++;
      animationRef.current.timeoutId = setTimeout(highlightNext, delay);
    };

    highlightNext();
  }, [delay, cleanupAnimation, onAnimationComplete]);

  const stopHighlighting = useCallback(() => {
    console.log('Stopping highlight animation');
    cleanupAnimation();
  }, [cleanupAnimation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('useNodeHighlighting unmounting');
      cleanupAnimation();
    };
  }, [cleanupAnimation]);

  return {
    currentHighlight,
    visitedNodes,
    isAnimating,
    highlightNodes,
    stopHighlighting
  };
};
