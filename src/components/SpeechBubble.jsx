import React from 'react';

export default function SpeechBubble({
  position,
  userName = 'Aakash',
  onYes,
  onRemindLater,
}) {
  const handleMouseEnter = () => {
    if (window.electronAPI?.setIgnoreMouseEvents) {
      window.electronAPI.setIgnoreMouseEvents(false);
    }
  };

  const handleMouseLeave = () => {
    if (window.electronAPI?.setIgnoreMouseEvents) {
      window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
    }
  };

  if (!position) return null;

  return (
    <div
      className="exact-overlay-dialogue-wrapper"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Yellow Text with Red Shadow matching exact reference image */}
      <div className="exact-dialogue-text">
        <div className="text-line-1">Hey, {userName}</div>
        <div className="text-line-2">Did you drink water?</div>
      </div>

      {/* Pill Buttons: YES & Remind me later */}
      <div className="exact-buttons-row">
        <button
          className="pill-btn pill-btn-yes"
          onClick={onYes}
          title="I drank water! (Runs away happily)"
        >
          YES
        </button>

        <button
          className="pill-btn pill-btn-later"
          onClick={onRemindLater}
          title="Remind me later (Walks away sadly)"
        >
          Remind me later
        </button>
      </div>
    </div>
  );
}
