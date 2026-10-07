import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import CompanionCanvas, { COMPANION_STATES } from './components/CompanionCanvas';
import SpeechBubble from './components/SpeechBubble';
import { playArrivalChime, playHappyChime, playBlip } from './utils/audio';

const REMINDER_INTERVAL_MINUTES = 30; // 30 minutes cycle

export default function App() {
  // Start by walking in immediately for live Demo!
  const [companionState, setCompanionState] = useState(COMPANION_STATES.WALKING_IN);
  const [intervalMinutes, setIntervalMinutes] = useState(REMINDER_INTERVAL_MINUTES);
  const [timeRemaining, setTimeRemaining] = useState(REMINDER_INTERVAL_MINUTES * 60);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userName, setUserName] = useState('Dhanunjay'); // Changed from Aakash to Dhanunjay

  const [bubblePosition, setBubblePosition] = useState(null);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);

  const snoozeTimerRef = useRef(false);
  const autoDismissTimerRef = useRef(null);

  // Automatic 30-minute interval countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (companionState === COMPANION_STATES.OFFSCREEN) {
          if (prev <= 1) {
            triggerSummon();
            return intervalMinutes * 60;
          }
          return prev - 1;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [companionState, intervalMinutes]);

  // IPC Event Listeners from Windows System Tray
  useEffect(() => {
    const cleanupSummon = window.electronAPI?.onTriggerSummon?.(() => {
      triggerSummon();
    });

    const cleanupInterval = window.electronAPI?.onChangeInterval?.((newMinutes) => {
      setIntervalMinutes(newMinutes);
      setTimeRemaining(newMinutes * 60);
    });

    return () => {
      if (cleanupSummon) cleanupSummon();
      if (cleanupInterval) cleanupInterval();
    };
  }, []);

  // Action: Summon Character onto desktop
  const triggerSummon = () => {
    if (companionState !== COMPANION_STATES.OFFSCREEN) return;
    setIsBubbleVisible(false);
    setCompanionState(COMPANION_STATES.WALKING_IN);
  };

  // Callback: Arrived at desktop position
  const handleArrived = () => {
    setCompanionState(COMPANION_STATES.IDLE_WAITING);
    setIsBubbleVisible(true);

    if (soundEnabled) {
      playArrivalChime();
    }

    // Auto-dismiss if no response within 30 seconds
    if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    autoDismissTimerRef.current = setTimeout(() => {
      if (companionState === COMPANION_STATES.IDLE_WAITING) {
        setIsBubbleVisible(false);
        setCompanionState(COMPANION_STATES.RESPONDING_DULL);
      }
    }, 30000);
  };

  // Callback: Exited screen
  const handleExited = () => {
    setCompanionState(COMPANION_STATES.OFFSCREEN);
    setIsBubbleVisible(false);

    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
    }

    if (snoozeTimerRef.current) {
      setTimeRemaining(5 * 60); // Snooze for 5 minutes
      snoozeTimerRef.current = false;
    } else {
      setTimeRemaining(intervalMinutes * 60); // Next 30-minute interval
    }

    // Reset mouse pass-through
    if (window.electronAPI?.setIgnoreMouseEvents) {
      window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
    }
  };

  // USER CLICKED "YES" -> Drank water! Run away happily ("parigettu kuntu vellipovali")
  const handleYes = () => {
    if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    setIsBubbleVisible(false);
    setCompanionState(COMPANION_STATES.RESPONDING_HAPPY);

    if (soundEnabled) {
      playHappyChime();
    }

    try {
      if (bubblePosition) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: {
            x: bubblePosition.x / window.innerWidth,
            y: bubblePosition.y / window.innerHeight,
          },
          colors: ['#fed824', '#38bdf8', '#f472b6', '#34d399'],
        });
      }
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  // USER CLICKED "REMIND ME LATER" -> Walk away sadly/dull ("dull ga vellipovali")
  const handleRemindLater = () => {
    if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    setIsBubbleVisible(false);
    snoozeTimerRef.current = true;
    setCompanionState(COMPANION_STATES.RESPONDING_DULL);

    if (soundEnabled) {
      playBlip();
    }
  };

  return (
    <div className="overlay-container">
      {/* 3D Realistic Human Companion Viewport */}
      <CompanionCanvas
        companionState={companionState}
        onArrived={handleArrived}
        onExited={handleExited}
        onBubblePositionUpdate={setBubblePosition}
      />

      {/* 3D Yellow Text & Pill Buttons matching exact reference image */}
      {isBubbleVisible && (
        <SpeechBubble
          position={bubblePosition}
          userName={userName}
          onYes={handleYes}
          onRemindLater={handleRemindLater}
        />
      )}
    </div>
  );
}
