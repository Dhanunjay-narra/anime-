import React, { useState } from 'react';
import { Settings, Play, X, Volume2, VolumeX, Sparkles, Clock, Droplet } from 'lucide-react';

export default function QuickControls({
  intervalMinutes,
  onChangeInterval,
  onSummonNow,
  timeRemaining,
  soundEnabled,
  onToggleSound,
  useCustomModel,
  onToggleCustomModel,
  reminderType,
  onChangeReminderType,
  onCloseApp,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    if (window.electronAPI?.setIgnoreMouseEvents) {
      window.electronAPI.setIgnoreMouseEvents(false);
    }
  };

  const handleMouseLeave = () => {
    if (!isOpen) {
      if (window.electronAPI?.setIgnoreMouseEvents) {
        window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
      }
    }
  };

  const formatSeconds = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className="quick-controls-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="status-pill"
        onClick={() => setIsOpen(!isOpen)}
        title="Click to toggle companion settings"
      >
        <div className="pulsing-dot" />
        <span>Next in: {formatSeconds(timeRemaining)}</span>
        <Settings size={14} />
      </div>

      {isOpen && (
        <div className="controls-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#0ea5e9" />
              Desktop Companion
            </span>
            <X
              size={16}
              style={{ cursor: 'pointer', color: '#94a3b8' }}
              onClick={() => {
                setIsOpen(false);
                if (window.electronAPI?.setIgnoreMouseEvents) {
                  window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
                }
              }}
            />
          </div>

          <button className="btn-summon" onClick={onSummonNow}>
            <Play size={14} />
            Summon Avatar Now
          </button>

          <div className="control-item">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} />
              Interval
            </span>
            <select
              className="control-select"
              value={intervalMinutes}
              onChange={(e) => onChangeInterval(Number(e.target.value))}
            >
              <option value={1}>1 min (Demo / Test)</option>
              <option value={5}>5 mins</option>
              <option value={15}>15 mins</option>
              <option value={30}>30 mins (Default)</option>
              <option value={60}>60 mins</option>
            </select>
          </div>

          <div className="control-item">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Droplet size={14} />
              Reminder
            </span>
            <select
              className="control-select"
              value={reminderType}
              onChange={(e) => onChangeReminderType(e.target.value)}
            >
              <option value="water">Drink Water 💧</option>
              <option value="posture">Posture Check 🧘</option>
              <option value="eye">Eye Rest (20-20-20) 👀</option>
              <option value="stretch">Stand & Stretch 🤸</option>
            </select>
          </div>

          <div className="control-item">
            <span>3D Model</span>
            <select
              className="control-select"
              value={useCustomModel ? 'custom' : 'procedural'}
              onChange={(e) => onToggleCustomModel(e.target.value === 'custom')}
            >
              <option value="procedural">Chibi Mascot (Built-in)</option>
              <option value="custom">avatar.glb (Custom)</option>
            </select>
          </div>

          <div className="control-item">
            <span>Sound Chime</span>
            <button
              style={{
                background: soundEnabled ? '#e0f2fe' : '#f1f5f9',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: soundEnabled ? '#0284c7' : '#64748b',
                fontWeight: 700,
                fontSize: '12px',
              }}
              onClick={onToggleSound}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              {soundEnabled ? 'On' : 'Off'}
            </button>
          </div>

          <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-close-app" onClick={onCloseApp}>
              Quit App
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

