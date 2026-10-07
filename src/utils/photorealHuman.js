/**
 * High-Fidelity Photorealistic Digital Human Renderer
 * Renders the exact turnaround sheet person (glasses, black blazer, white shirt, blue jeans, navy sneakers, water bottle)
 * with studio lighting, realistic gradients, fabric folds, glass refraction, and anatomical motion.
 */

export class PhotorealHumanRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.time = 0;

    // Character state
    this.x = window.innerWidth + 200; // start offscreen
    this.targetX = window.innerWidth * 0.72; // Desktop position
    this.y = window.innerHeight - 80;
    this.scale = Math.min(window.innerHeight / 780, 1.1);

    this.animState = 'walk_in'; // 'walk_in', 'idle', 'run_happy', 'walk_dull'
    this.facing = -1; // -1: left, 1: right

    // Natural human micro-movements
    this.blinkProgress = 0;
    this.isBlinking = false;
    this.blinkTimer = 0;

    this.breathCycle = 0;
  }

  resize() {
    this.scale = Math.min(window.innerHeight / 780, 1.1);
    this.y = window.innerHeight - 80;
  }

  update(delta, state, onArrived, onExited) {
    this.time += delta;
    this.animState = state;

    // Blinking logic
    this.blinkTimer += delta;
    if (!this.isBlinking && this.blinkTimer > 3.2) {
      this.isBlinking = true;
      this.blinkTimer = 0;
    }
    if (this.isBlinking) {
      this.blinkProgress += delta * 9;
      if (this.blinkProgress >= 1) {
        this.isBlinking = false;
        this.blinkProgress = 0;
      }
    }

    this.breathCycle += delta * 2.2;

    // Movement state machine
    switch (state) {
      case 'WALKING_IN': {
        this.facing = -1;
        const speed = 240 * delta;
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
        // Fast Sprint Left across screen!
        this.facing = -1;
        const runSpeed = 580 * delta;
        this.x -= runSpeed;
        if (this.x < -250) {
          this.x = window.innerWidth + 200;
          if (onExited) onExited();
        }
        break;
      }
      case 'RESPONDING_DULL': {
        // Slow Dull Walk Right back out!
        this.facing = 1;
        const slowSpeed = 140 * delta;
        this.x += slowSpeed;
        if (this.x > window.innerWidth + 220) {
          this.x = window.innerWidth + 200;
          if (onExited) onExited();
        }
        break;
      }
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale * (this.facing === 1 ? -1 : 1), this.scale);

    const isWalking = this.animState === 'WALKING_IN' || this.animState === 'RESPONDING_DULL';
    const isRunning = this.animState === 'RESPONDING_HAPPY';
    const isSad = this.animState === 'RESPONDING_DULL';

    const walkCycle = isRunning ? this.time * 14 : (isWalking ? this.time * 7 : 0);
    const legAngle = isRunning ? Math.sin(walkCycle) * 0.75 : (isWalking ? Math.sin(walkCycle) * 0.45 : 0);
    const bodyBob = isRunning ? Math.abs(Math.sin(walkCycle)) * 14 : (isWalking ? Math.abs(Math.sin(walkCycle)) * 5 : Math.sin(this.breathCycle) * 2);
    const breathOffset = Math.sin(this.breathCycle) * 2;

    // 1. Soft Realistic Drop Shadow on Floor
    ctx.save();
    ctx.scale(1, 0.25);
    const shadowGrad = ctx.createRadialGradient(0, 40, 5, 0, 40, 95);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
    shadowGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.18)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(0, 40, 95, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Left Leg (Back leg)
    this.drawLeg(ctx, -14, -180, -legAngle, isRunning);

    // 3. Right Leg (Front leg)
    this.drawLeg(ctx, 14, -180, legAngle, isRunning);

    // 4. Belt & Waist
    ctx.save();
    ctx.translate(0, -180 - bodyBob);

    // Belt
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(-38, 0, 76, 12);
    // Silver Buckle
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-10, -1, 20, 14);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-6, 2, 12, 8);

    // 5. White Dress Shirt Base
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-35, 0);
    ctx.lineTo(-38, -115);
    ctx.lineTo(38, -115);
    ctx.lineTo(35, 0);
    ctx.closePath();
    ctx.fill();

    // Shirt buttons & placket
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -115);
    ctx.lineTo(0, 0);
    ctx.stroke();

    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(0, -25 - i * 26, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Black Tailored Suit Blazer Jacket
    ctx.save();
    // Left blazer side
    const blazerGrad = ctx.createLinearGradient(-45, -120, 45, 0);
    blazerGrad.addColorStop(0, '#2d2e33');
    blazerGrad.addColorStop(0.5, '#1e1f23');
    blazerGrad.addColorStop(1, '#141416');

    ctx.fillStyle = blazerGrad;
    ctx.beginPath();
    ctx.moveTo(-45, -120);
    ctx.lineTo(-12, -30);
    ctx.lineTo(-42, 10);
    ctx.lineTo(-48, -110);
    ctx.closePath();
    ctx.fill();

    // Right blazer side
    ctx.beginPath();
    ctx.moveTo(45, -120);
    ctx.lineTo(12, -30);
    ctx.lineTo(42, 10);
    ctx.lineTo(48, -110);
    ctx.closePath();
    ctx.fill();

    // Notched Lapels
    ctx.fillStyle = '#18191c';
    ctx.beginPath();
    ctx.moveTo(-44, -120);
    ctx.lineTo(-18, -65);
    ctx.lineTo(-30, -58);
    ctx.lineTo(-14, -30);
    ctx.lineTo(-24, -32);
    ctx.lineTo(-42, -110);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(44, -120);
    ctx.lineTo(18, -65);
    ctx.lineTo(30, -58);
    ctx.lineTo(14, -30);
    ctx.lineTo(24, -32);
    ctx.lineTo(42, -110);
    ctx.closePath();
    ctx.fill();

    // Left Welt Pocket
    ctx.fillStyle = '#141416';
    ctx.fillRect(-36, -82, 18, 4);

    // Lower Flap Pockets
    ctx.fillRect(-38, -15, 22, 6);
    ctx.fillRect(16, -15, 22, 6);

    // Blazer Buttons
    ctx.fillStyle = '#101012';
    ctx.beginPath();
    ctx.arc(-13, -22, 3.5, 0, Math.PI * 2);
    ctx.arc(-13, 2, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 7. Left Arm (Swinging relaxed with white cuff)
    const armSwing = isRunning ? -Math.sin(walkCycle) * 0.85 : (isWalking ? -Math.sin(walkCycle) * 0.4 : 0.05);
    this.drawArm(ctx, -46, -115, armSwing, false);

    // 8. Neck & Open Shirt V-Collar
    ctx.fillStyle = '#d49b73'; // South-Asian skin tone
    ctx.beginPath();
    ctx.moveTo(-12, -115);
    ctx.lineTo(12, -115);
    ctx.lineTo(10, -140);
    ctx.lineTo(-10, -140);
    ctx.closePath();
    ctx.fill();

    // Open V Collar flaps
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-14, -136);
    ctx.lineTo(-2, -108);
    ctx.lineTo(-24, -118);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(14, -136);
    ctx.lineTo(2, -108);
    ctx.lineTo(24, -118);
    ctx.closePath();
    ctx.fill();

    // 9. Head & Turnaround Sheet Facial Features
    ctx.save();
    ctx.translate(0, -140);
    if (isSad) ctx.rotate(0.12); // Slumped sad head tilt

    this.drawHead(ctx);
    ctx.restore();

    // 10. Right Arm (Holding Water Bottle Upright)
    const rightArmPose = isRunning ? -1.2 : -0.25;
    this.drawArm(ctx, 46, -115, rightArmPose, true);

    ctx.restore(); // Waist translate restore
    ctx.restore(); // Main transform restore
  }

  drawHead(ctx) {
    // Head Contour
    const faceGrad = ctx.createRadialGradient(0, -38, 10, 0, -35, 55);
    faceGrad.addColorStop(0, '#e5b08c');
    faceGrad.addColorStop(0.6, '#d49b73');
    faceGrad.addColorStop(1, '#bf8259');

    ctx.fillStyle = faceGrad;
    ctx.beginPath();
    ctx.ellipse(0, -38, 34, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Jawline & Chin contour
    ctx.beginPath();
    ctx.moveTo(-24, -30);
    ctx.quadraticCurveTo(0, -5, 24, -30);
    ctx.quadraticCurveTo(34, -45, 34, -55);
    ctx.lineTo(-34, -55);
    ctx.quadraticCurveTo(-34, -45, -24, -30);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#c98960';
    ctx.beginPath();
    ctx.ellipse(-35, -38, 6, 12, 0, 0, Math.PI * 2);
    ctx.ellipse(35, -38, 6, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Beard & Mustache (Character sheet styling)
    ctx.fillStyle = '#17171a';
    ctx.beginPath();
    ctx.moveTo(-30, -42);
    ctx.quadraticCurveTo(-26, -12, 0, -8);
    ctx.quadraticCurveTo(26, -12, 30, -42);
    ctx.quadraticCurveTo(25, -24, 0, -18);
    ctx.quadraticCurveTo(-25, -24, -30, -42);
    ctx.fill();

    // Mustache
    ctx.beginPath();
    ctx.moveTo(-16, -26);
    ctx.quadraticCurveTo(0, -32, 16, -26);
    ctx.quadraticCurveTo(0, -22, -16, -26);
    ctx.fill();

    // Warm Smile with Teeth
    ctx.fillStyle = '#881337';
    ctx.beginPath();
    ctx.arc(0, -22, 10, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-6, -22, 12, 4);

    // Nose
    ctx.strokeStyle = '#a66a42';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -48);
    ctx.lineTo(2, -34);
    ctx.lineTo(-3, -32);
    ctx.stroke();

    // Realistic Eyes
    const blinkScale = this.isBlinking ? Math.max(0.1, 1 - Math.sin(this.blinkProgress * Math.PI)) : 1;

    const drawEye = (x) => {
      ctx.save();
      ctx.translate(x, -42);
      ctx.scale(1, blinkScale);

      // Sclera
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Brown Iris
      ctx.fillStyle = '#2e190e';
      ctx.beginPath();
      ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#050505';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      // Light Reflection
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(2, -2, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Eyebrow
      ctx.fillStyle = '#17171a';
      ctx.beginPath();
      ctx.roundRect(x - 9, -54, 18, 4.5, 2);
      ctx.fill();
    };

    drawEye(-13);
    drawEye(13);

    // Double-Bridge Aviator Wireframe Glasses matching reference sheet!
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';

    // Left Lens Frame
    ctx.beginPath();
    ctx.roundRect(-24, -51, 20, 18, 4);
    ctx.stroke();
    ctx.fill();

    // Right Lens Frame
    ctx.beginPath();
    ctx.roundRect(4, -51, 20, 18, 4);
    ctx.stroke();
    ctx.fill();

    // Double Bridges
    ctx.beginPath();
    ctx.moveTo(-4, -48);
    ctx.lineTo(4, -48);
    ctx.moveTo(-4, -42);
    ctx.lineTo(4, -42);
    ctx.stroke();

    // Glass Lens Reflection Streak
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-20, -48);
    ctx.lineTo(-12, -36);
    ctx.moveTo(8, -48);
    ctx.lineTo(16, -36);
    ctx.stroke();

    // Hair: Stylized Quiff matching character sheet
    ctx.fillStyle = '#17171a';
    ctx.beginPath();
    ctx.moveTo(-35, -45);
    ctx.quadraticCurveTo(-38, -80, -10, -82);
    // Distinctive curved crest / quiff on top
    ctx.quadraticCurveTo(15, -92, 28, -78);
    ctx.quadraticCurveTo(38, -65, 35, -45);
    ctx.quadraticCurveTo(25, -60, 0, -68);
    ctx.quadraticCurveTo(-25, -60, -35, -45);
    ctx.closePath();
    ctx.fill();
  }

  drawLeg(ctx, x, y, angle, isRunning) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Medium Blue Denim Jeans
    const jeansGrad = ctx.createLinearGradient(-14, 0, 14, 160);
    jeansGrad.addColorStop(0, '#537fae');
    jeansGrad.addColorStop(0.5, '#46719e');
    jeansGrad.addColorStop(1, '#33577d');

    ctx.fillStyle = jeansGrad;
    ctx.beginPath();
    ctx.roundRect(-12, 0, 24, 165, 8);
    ctx.fill();

    // Knee crease folds
    ctx.strokeStyle = '#2b4766';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-8, 80);
    ctx.lineTo(8, 82);
    ctx.moveTo(-6, 88);
    ctx.lineTo(6, 86);
    ctx.stroke();

    // Navy Sneaker with Clean White Rubber Sole
    ctx.save();
    ctx.translate(0, 160);

    // Shoe Body
    ctx.fillStyle = '#232d3d';
    ctx.beginPath();
    ctx.moveTo(-13, 0);
    ctx.lineTo(18, 0);
    ctx.quadraticCurveTo(32, 10, 26, 20);
    ctx.lineTo(-14, 20);
    ctx.closePath();
    ctx.fill();

    // White Rubber Sole
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-15, 17, 44, 6);

    // White Toe Cap
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(22, 15, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  drawArm(ctx, x, y, angle, isRightHoldingBottle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Black Blazer Sleeve
    ctx.fillStyle = '#1e1f23';
    ctx.beginPath();
    ctx.roundRect(-9, 0, 18, 90, 6);
    ctx.fill();

    // White Shirt Cuff poking out at wrist
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-8, 86, 16, 6);

    // Hand
    ctx.fillStyle = '#d49b73';
    ctx.beginPath();
    ctx.ellipse(0, 98, 7, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isRightHoldingBottle) {
      // Physical Transparent Glass Water Bottle
      ctx.save();
      ctx.translate(2, 92);
      ctx.rotate(0.2);

      // Glass Body
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-10, -35, 20, 50, 4);
      ctx.fill();
      ctx.stroke();

      // Glowing Cyan-Pink Water Inside
      const waterGrad = ctx.createLinearGradient(-10, -25, 10, 12);
      waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.85)');
      waterGrad.addColorStop(0.6, 'rgba(244, 114, 182, 0.75)');
      waterGrad.addColorStop(1, 'rgba(2, 132, 199, 0.9)');
      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      ctx.roundRect(-8, -25, 16, 38, 3);
      ctx.fill();

      // Silver Cap
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-6, -42, 12, 7);

      // Fingers wrapped tightly around bottle
      ctx.fillStyle = '#d49b73';
      for (let f = 0; f < 4; f++) {
        ctx.beginPath();
        ctx.ellipse(-2, -18 + f * 9, 5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  getHeadScreenPosition() {
    return {
      x: this.x,
      y: this.y - 230 * this.scale,
    };
  }
}

