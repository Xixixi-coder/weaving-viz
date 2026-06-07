import { useState, useCallback } from 'react';
import { WeavingCanvas } from './components/Canvas/WeavingCanvas';
import { LoadingScreen } from './components/UI/LoadingScreen';
import { OnboardingOverlay } from './components/UI/OnboardingOverlay';
import { StoryCard } from './components/UI/StoryCard';
import { DataTooltip } from './components/UI/DataTooltip';
import { Legend } from './components/UI/Legend';
import type { ActiveDataNode } from './engine/WeftShuttle';
import type { StuckNodeState } from './engine/StuckNode';
import type { CorrelationResult } from './engine/CorrelationEngine';
import { STORIES } from './data/stories';

type AppPhase = 'loading' | 'onboarding' | 'main';

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('loading');
  const [tooltipState, setTooltipState] = useState({ warpIndex: -1, x: 0, y: 0, visible: false });
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const [correlationHint, setCorrelationHint] = useState<string>('');

  const handleLoadingComplete = useCallback(() => {
    setPhase('onboarding');
  }, []);

  const handleOnboardingDismiss = useCallback(() => {
    setPhase('main');
  }, []);

  const handleWarpHover = useCallback((index: number, x: number, y: number) => {
    setTooltipState({ warpIndex: index, x, y, visible: true });
  }, []);

  const handleWarpUnhover = useCallback(() => {
    setTooltipState(prev => ({ ...prev, visible: false }));
  }, []);

  const handleNodeClick = useCallback((_node: ActiveDataNode) => {
  }, []);

  const handleStuckClick = useCallback((stuck: StuckNodeState) => {
    setActiveStory(stuck.storyId);
  }, []);

  const handleCorrelationChange = useCallback((results: CorrelationResult[]) => {
    if (results.length > 0) {
      const strongest = results.reduce((a, b) => a.strength > b.strength ? a : b);
      setCorrelationHint(strongest.effect.theme);
    } else {
      setCorrelationHint('');
    }
  }, []);

  const handleStoryClose = useCallback(() => {
    setActiveStory(null);
  }, []);

  const story = activeStory ? STORIES.find(s => s.id === activeStory) : null;
  const isPaused = !!activeStory;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {phase === 'loading' && <LoadingScreen onComplete={handleLoadingComplete} />}
      {phase === 'onboarding' && <OnboardingOverlay onDismiss={handleOnboardingDismiss} />}

      {phase !== 'loading' && (
        <>
          <WeavingCanvas
            onWarpHover={handleWarpHover}
            onWarpUnhover={handleWarpUnhover}
            onNodeClick={handleNodeClick}
            onStuckClick={handleStuckClick}
            onCorrelationChange={handleCorrelationChange}
            isPaused={isPaused}
          />
          <Legend />
          <DataTooltip
            warpIndex={tooltipState.warpIndex}
            x={tooltipState.x}
            y={tooltipState.y}
            visible={tooltipState.visible}
          />
        </>
      )}

      {story && <StoryCard story={story} onClose={handleStoryClose} />}

      {correlationHint && !activeStory && phase === 'main' && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'rgba(22,33,62,0.9)',
          border: '1px solid rgba(255,215,0,0.3)',
          borderRadius: 8,
          padding: '10px 16px',
          zIndex: 600,
          maxWidth: 260,
        }}>
          <p style={{ color: 'rgba(255,215,0,0.9)', fontSize: 12, margin: 0 }}>
            {correlationHint}
          </p>
        </div>
      )}

      {phase === 'main' && (
        <div style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 600,
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <h1 style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 18,
            fontWeight: 300,
            letterSpacing: 6,
            margin: 0,
          }}>
            编织
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: 11,
            marginTop: 4,
            letterSpacing: 2,
          }}>
            女性劳动的可见化
          </p>
        </div>
      )}
    </div>
  );
}
