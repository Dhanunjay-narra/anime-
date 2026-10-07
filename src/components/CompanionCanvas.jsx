import React, { useEffect, useRef } from 'react';
import { PhotorealPlayer } from '../utils/photorealPlayer';

export const COMPANION_STATES = {
  OFFSCREEN: 'OFFSCREEN',
  WALKING_IN: 'WALKING_IN',
  IDLE_WAITING: 'IDLE_WAITING',
  RESPONDING_HAPPY: 'RESPONDING_HAPPY',
  RESPONDING_DULL: 'RESPONDING_DULL',
};

export default function CompanionCanvas({
  companionState,
  onArrived,
  onExited,
  onBubblePositionUpdate,
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef(companionState);
  stateRef.current = companionState;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const player = new PhotorealPlayer(canvas);
    let lastTime = performance.now();

    const animate = (currentTime) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const currentState = stateRef.current;

      // Update motion & state progression
      player.update(delta, currentState, onArrived, onExited);

      // Render 60 FPS Photorealistic Human
      player.render(currentState);

      // Project floating 3D dialogue text
      if (
        onBubblePositionUpdate &&
        (currentState === COMPANION_STATES.IDLE_WAITING ||
          currentState === COMPANION_STATES.WALKING_IN)
      ) {
        const headPos = player.getHeadScreenPosition();
        onBubblePositionUpdate(headPos);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      player.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
      }}
    />
  );
}
