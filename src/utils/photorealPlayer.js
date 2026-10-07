/**
 * Photorealistic Digital Human Player
 * Loads bundled high-definition transparent PNGs (100% solid opacity on shirt/face/glasses, zero background)
 * with natural human locomotion physics.
 */

import idleSrc from '../assets/character_idle.png';
import walkSrc from '../assets/character_walk.png';
import runSrc from '../assets/character_run.png';
import sadSrc from '../assets/character_sad.png';

export class PhotorealPlayer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.time = 0;
    this.breath = 0;

    // Load pre-cutout alpha transparent PNGs with guaranteed bundled relative paths
    this.images = {
      idle: new Image(),
      walk: new Image(),
      run: new Image(),
      sad: new Image(),
    };

    this.images.idle.src = idleSrc;
    this.images.walk.src = walkSrc;
    this.images.run.src = runSrc;
    this.images.sad.src = sadSrc;

    this.x = window.innerWidth + 180;
    this.targetX = window.innerWidth * 0.78;
    this.y = window.innerHeight - 20;
    this.scale = Math.min(window.innerHeight / 900, 0.82);

    this.facing = -1; // -1: Left, 1: Right
  }

  resize() {
    this.scale = Math.min(window.innerHeight / 900, 0.82);
    this.y = window.innerHeight - 20;
  }

  update(delta, state, onArrived, onExited) {
    this.time += delta;
    this.breath += delta * 2.0;

    switch (state) {
      case 'WALKING_IN': {
        this.facing = -1;
        const speed = 150 * delta;
        this.x -= speed;
        if (this.x <= this.targetX) {
          this.x = this.targetX;
          if (onArrived) onArrived();
        }
        break;
      }
      case 'IDLE_WAITING': {
        this.facing = -1;
        this.x = this.targetX;
        break;
      }
      case 'RESPONDING_HAPPY': {
        // Natural athletic jog/run off-screen
        this.facing = -1;
        const jogSpeed = 230 * delta;
        this.x -= jogSpeed;
        if (this.x < -240) {
          this.x = window.innerWidth + 180;
          if (onExited) onExited();
        }
        break;
      }
      case 'RESPONDING_DULL': {
        // Gentle small-step slow walk back
        this.facing = 1;
        const gentleWalkSpeed = 80 * delta;
        this.x += gentleWalkSpeed;
        if (this.x > window.innerWidth + 200) {
          this.x = window.innerWidth + 180;
          if (onExited) onExited();
        }
        break;
      }
    }
  }

  render(state) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const isWalking = state === 'WALKING_IN';
    const isRunning = state === 'RESPONDING_HAPPY';
    const isSad = state === 'RESPONDING_DULL';

    let currentImg = this.images.idle;
    if (isRunning && this.images.run.complete && this.images.run.naturalWidth > 0) {
      currentImg = this.images.run;
    } else if (isSad && this.images.sad.complete && this.images.sad.naturalWidth > 0) {
      currentImg = this.images.sad;
    } else if (isWalking && this.images.walk.complete && this.images.walk.naturalWidth > 0) {
      currentImg = this.images.walk;
    }

    // Natural human gait oscillation (smooth, subtle, realistic)
    const strideBob = isRunning
      ? Math.sin(this.time * 9.0) * 3.5
      : isWalking
      ? Math.sin(this.time * 5.0) * 2.0
      : isSad
      ? Math.sin(this.time * 3.5) * 1.0
      : Math.sin(this.breath) * 1.5;

    const bodyLean = isRunning
      ? -0.065
      : isWalking
      ? -0.02
      : isSad
      ? 0.035
      : 0;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale * (this.facing === 1 ? -1 : 1), this.scale);

    // 1. Soft Floor Contact Shadow
    ctx.save();
    ctx.scale(1, 0.22);
    const shadowGrad = ctx.createRadialGradient(0, 20, 5, 0, 20, 80);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
    shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(0, 20, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Draw 100% Solid Photorealistic Real Human (Compact Sizing: 310px)
    if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
      ctx.save();
      ctx.translate(0, -strideBob);
      ctx.rotate(bodyLean);

      const targetHeight = 310;
      const aspect = currentImg.naturalWidth / currentImg.naturalHeight;
      const targetWidth = targetHeight * aspect;

      ctx.drawImage(
        currentImg,
        -targetWidth / 2,
        -targetHeight,
        targetWidth,
        targetHeight
      );

      ctx.restore();
    }

    ctx.restore();
  }

  getHeadScreenPosition() {
    return {
      x: this.x,
      y: this.y - 325 * this.scale,
    };
  }
}
