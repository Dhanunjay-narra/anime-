import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createCharacterSheetTextures } from './textureGenerator';

/**
 * Creates the exact 3D character matching the uploaded turnaround sheet:
 * - South-Asian features, stylish black hair with top quiff, neat beard & mustache
 * - Double-bridge wireframe Aviator/rectangular glasses with transparent lenses
 * - Tailored black blazer jacket with notched lapels, pockets, buttons & white wrist cuffs
 * - White button-down collared dress shirt (open collar)
 * - Medium blue denim jeans with belt and metallic buckle
 * - Navy sneakers with clean white rubber soles
 * - Right hand holding the transparent glass water bottle
 */
export function createExactTurnaroundCharacter() {
  const root = new THREE.Group();
  root.name = 'TurnaroundDigitalHuman';

  // --- Load High-Resolution Textures ---
  const tex = createCharacterSheetTextures();

  // --- Materials ---
  const skinMat = new THREE.MeshStandardMaterial({
    map: tex.skinTexture,
    roughness: 0.55,
    metalness: 0.02,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    map: tex.hairTexture,
    roughness: 0.85,
    metalness: 0.05,
  });

  const beardMat = new THREE.MeshStandardMaterial({
    map: tex.hairTexture,
    roughness: 0.9,
  });

  const blazerMat = new THREE.MeshStandardMaterial({
    map: tex.blazerTexture,
    roughness: 0.65,
    metalness: 0.05,
  });

  const blazerLapelMat = new THREE.MeshStandardMaterial({
    color: 0x18191c,
    roughness: 0.6,
  });

  const shirtWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.8,
  });

  const shirtButtonMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.3,
  });

  const beltMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.5,
  });

  const beltBuckleMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8,
    metalness: 0.9,
    roughness: 0.15,
  });

  const jeansMat = new THREE.MeshStandardMaterial({
    map: tex.jeansTexture,
    roughness: 0.72,
  });

  const sneakerBodyMat = new THREE.MeshStandardMaterial({
    map: tex.shoeTexture,
    roughness: 0.5,
  });

  const sneakerSoleMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
  });

  // Wireframe glasses material (Silver metallic + clear glass lenses)
  const glassesFrameMat = new THREE.MeshStandardMaterial({
    color: 0xc8cdd6,
    metalness: 0.95,
    roughness: 0.15,
  });

  const glassesLensMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25,
    roughness: 0.05,
    transmission: 0.95,
    ior: 1.5,
    reflectivity: 0.9,
  });

  // Eyes
  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const eyeIrisMat = new THREE.MeshBasicMaterial({ color: 0x24140d });
  const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // Glass water bottle
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45,
    roughness: 0.05,
    transmission: 0.96,
    ior: 1.52,
    reflectivity: 0.95,
  });

  const waterMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.82,
    roughness: 0.08,
    transmission: 0.9,
    ior: 1.33,
  });

  const bottleCapMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.2,
  });

  // --- Skeleton & Body Hierarchy ---
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  // 1. Torso: White Dress Shirt Base with Open Collar
  const shirtTorsoGeo = new THREE.CylinderGeometry(0.26, 0.22, 0.85, 24);
  const shirtTorso = new THREE.Mesh(shirtTorsoGeo, shirtWhiteMat);
  shirtTorso.position.y = 1.35;
  shirtTorso.castShadow = true;
  bodyGroup.add(shirtTorso);

  // Shirt Placket with visible white buttons
  for (let i = 0; i < 4; i++) {
    const btnGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.01, 8);
    const btn = new THREE.Mesh(btnGeo, shirtButtonMat);
    btn.rotation.x = Math.PI / 2;
    btn.position.set(0, 1.15 + i * 0.14, 0.265);
    bodyGroup.add(btn);
  }

  // Shirt Open V-Collar
  const collarLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.02), shirtWhiteMat);
  collarLeft.position.set(-0.1, 1.76, 0.22);
  collarLeft.rotation.set(-0.3, 0.2, -0.4);
  bodyGroup.add(collarLeft);

  const collarRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.02), shirtWhiteMat);
  collarRight.position.set(0.1, 1.76, 0.22);
  collarRight.rotation.set(-0.3, -0.2, 0.4);
  bodyGroup.add(collarRight);

  // 2. Black Tailored Suit Blazer (Open single-breasted jacket)
  const blazerGeo = new THREE.CylinderGeometry(0.295, 0.265, 0.86, 24, 1, false, 0.35, Math.PI * 1.65);
  const blazer = new THREE.Mesh(blazerGeo, blazerMat);
  blazer.position.set(0, 1.35, 0);
  blazer.rotation.y = Math.PI * 0.7;
  blazer.castShadow = true;
  bodyGroup.add(blazer);

  // Notched Lapels
  const lapelLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.68, 0.035), blazerLapelMat);
  lapelLeft.position.set(-0.15, 1.38, 0.26);
  lapelLeft.rotation.z = -0.06;
  bodyGroup.add(lapelLeft);

  const lapelRight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.68, 0.035), blazerLapelMat);
  lapelRight.position.set(0.15, 1.38, 0.26);
  lapelRight.rotation.z = 0.06;
  bodyGroup.add(lapelRight);

  // Left Chest Welt Pocket
  const chestPocket = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 0.02), blazerLapelMat);
  chestPocket.position.set(-0.16, 1.55, 0.25);
  chestPocket.rotation.y = -0.2;
  bodyGroup.add(chestPocket);

  // Lower Flap Pockets
  const flapPocketLeft = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.02), blazerLapelMat);
  flapPocketLeft.position.set(-0.18, 1.18, 0.24);
  flapPocketLeft.rotation.y = -0.25;
  bodyGroup.add(flapPocketLeft);

  const flapPocketRight = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.02), blazerLapelMat);
  flapPocketRight.position.set(0.18, 1.18, 0.24);
  flapPocketRight.rotation.y = 0.25;
  bodyGroup.add(flapPocketRight);

  // Blazer Front Buttons
  const blazerBtn1 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.01, 8), blazerLapelMat);
  blazerBtn1.rotation.x = Math.PI / 2;
  blazerBtn1.position.set(-0.12, 1.28, 0.275);
  bodyGroup.add(blazerBtn1);

  const blazerBtn2 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.01, 8), blazerLapelMat);
  blazerBtn2.rotation.x = Math.PI / 2;
  blazerBtn2.position.set(-0.12, 1.14, 0.275);
  bodyGroup.add(blazerBtn2);

  // 3. Belt & Buckle
  const beltGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.06, 24);
  const belt = new THREE.Mesh(beltGeo, beltMat);
  belt.position.set(0, 0.94, 0);
  bodyGroup.add(belt);

  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.065, 0.02), beltBuckleMat);
  buckle.position.set(0, 0.94, 0.23);
  bodyGroup.add(buckle);

  // 4. Neck & Sculpted Head
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.105, 0.2, 20), skinMat);
  neck.position.set(0, 1.82, 0);
  bodyGroup.add(neck);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 2.12, 0);
  bodyGroup.add(headGroup);

  // Head Base
  const headGeo = new THREE.SphereGeometry(0.25, 28, 28);
  headGeo.scale(0.88, 1.05, 0.95);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.castShadow = true;
  headGroup.add(head);

  // Chin & Jawline
  const chin = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.11), skinMat);
  chin.position.set(0, -0.21, 0.11);
  headGroup.add(chin);

  // Nose
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.11, 8), skinMat);
  nose.position.set(0, -0.02, 0.25);
  nose.rotation.set(-0.35, 0, 0);
  headGroup.add(nose);

  // Ears
  const createEar = (isLeft) => {
    const earGroup = new THREE.Group();
    const x = isLeft ? -0.23 : 0.23;
    earGroup.position.set(x, 0, 0);
    const ear = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.014, 10, 16, Math.PI), skinMat);
    ear.rotation.set(0, isLeft ? -Math.PI / 2 : Math.PI / 2, isLeft ? -0.2 : 0.2);
    earGroup.add(ear);
    return earGroup;
  };
  headGroup.add(createEar(true));
  headGroup.add(createEar(false));

  // Stylish Hair (Distinctive top quiff curl as in character sheet)
  const hairGroup = new THREE.Group();
  const hairBase = new THREE.Mesh(new THREE.SphereGeometry(0.265, 24, 24), hairMat);
  hairBase.scale.set(0.92, 0.85, 1.02);
  hairBase.position.set(0, 0.12, -0.03);
  hairGroup.add(hairBase);

  // Front Curved Quiff Pompadour
  const quiffCurve = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.28, 10), hairMat);
  quiffCurve.position.set(0.04, 0.24, 0.1);
  quiffCurve.rotation.set(-0.6, 0.2, -0.3);
  hairGroup.add(quiffCurve);

  headGroup.add(hairGroup);

  // Beard & Mustache (Turnaround sheet styling)
  const jawBeard = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.042, 12, 20, Math.PI), beardMat);
  jawBeard.position.set(0, -0.11, 0.08);
  jawBeard.rotation.set(Math.PI / 2.2, 0, 0);
  headGroup.add(jawBeard);

  const chinGoatee = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 14), beardMat);
  chinGoatee.scale.set(1, 0.9, 0.7);
  chinGoatee.position.set(0, -0.21, 0.16);
  headGroup.add(chinGoatee);

  const mustache = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.02, 10, 16, Math.PI * 0.9), beardMat);
  mustache.position.set(0, -0.08, 0.23);
  mustache.rotation.set(Math.PI / 1.7, 0, 0);
  headGroup.add(mustache);

  // Eyes & Eyebrows
  const createEye = (isLeft) => {
    const eye = new THREE.Group();
    const x = isLeft ? -0.09 : 0.09;
    eye.position.set(x, 0.035, 0.21);

    const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 12), eyeWhiteMat);
    eyeWhite.scale.set(1.2, 0.8, 0.5);
    eye.add(eyeWhite);

    const iris = new THREE.Mesh(new THREE.CircleGeometry(0.022, 16), eyeIrisMat);
    iris.position.set(0, 0, 0.02);
    eye.add(iris);

    const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.012, 12), eyePupilMat);
    pupil.position.set(0, 0, 0.022);
    eye.add(pupil);

    const highlight = new THREE.Mesh(new THREE.CircleGeometry(0.006, 8), eyeHighlightMat);
    highlight.position.set(0.007, 0.007, 0.024);
    eye.add(highlight);

    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.018, 0.015), beardMat);
    brow.position.set(0, 0.045, 0.02);
    brow.rotation.z = isLeft ? 0.06 : -0.06;
    eye.add(brow);

    return eye;
  };

  const leftEye = createEye(true);
  const rightEye = createEye(false);
  headGroup.add(leftEye);
  headGroup.add(rightEye);

  // Warm Friendly Smile with Teeth
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.01, 8, 16, Math.PI * 0.75), new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.5 }));
  lip.position.set(0, -0.13, 0.21);
  lip.rotation.set(Math.PI / 1.6, 0, 0);
  headGroup.add(lip);

  const teeth = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.015, 0.01), eyeWhiteMat);
  teeth.position.set(0, -0.135, 0.22);
  headGroup.add(teeth);

  // --- Double-Bridge Wireframe Aviator Glasses matching the Character Sheet ---
  const glassesGroup = new THREE.Group();
  glassesGroup.position.set(0, 0.04, 0.235);

  const createGlassesRim = (isLeft) => {
    const rimGroup = new THREE.Group();
    rimGroup.position.set(isLeft ? -0.095 : 0.095, 0, 0);

    // Rounded rectangular wire frame
    const rimGeo = new THREE.TorusGeometry(0.052, 0.005, 8, 20);
    rimGeo.scale(1.2, 0.9, 1);
    const rim = new THREE.Mesh(rimGeo, glassesFrameMat);
    rimGroup.add(rim);

    // Transparent lens
    const lensGeo = new THREE.CircleGeometry(0.05, 16);
    lensGeo.scale(1.15, 0.85, 1);
    const lens = new THREE.Mesh(lensGeo, glassesLensMat);
    lens.position.z = 0.002;
    rimGroup.add(lens);

    return rimGroup;
  };

  glassesGroup.add(createGlassesRim(true));
  glassesGroup.add(createGlassesRim(false));

  // Double Bridge Bars (Upper Brow Bar & Lower Nose Bridge)
  const topBridge = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.006, 0.006), glassesFrameMat);
  topBridge.position.set(0, 0.035, 0.005);
  glassesGroup.add(topBridge);

  const bottomBridge = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.006, 0.006), glassesFrameMat);
  bottomBridge.position.set(0, 0.008, 0.005);
  glassesGroup.add(bottomBridge);

  // Side Temples (Arms extending to ears)
  const leftTemple = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.22, 6), glassesFrameMat);
  leftTemple.position.set(-0.16, 0.01, -0.1);
  leftTemple.rotation.set(Math.PI / 2, 0, -0.2);
  glassesGroup.add(leftTemple);

  const rightTemple = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.22, 6), glassesFrameMat);
  rightTemple.position.set(0.16, 0.01, -0.1);
  rightTemple.rotation.set(Math.PI / 2, 0, 0.2);
  glassesGroup.add(rightTemple);

  headGroup.add(glassesGroup);

  // 5. Arms & Wrist Cuffs
  // Left Arm (Relaxed by side with white shirt cuff poking out)
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.35, 1.66, 0);

  const upperArmGeo = new THREE.CylinderGeometry(0.07, 0.065, 0.42, 16);
  upperArmGeo.translate(0, -0.2, 0);
  const leftUpperArm = new THREE.Mesh(upperArmGeo, blazerMat);
  leftArmGroup.add(leftUpperArm);

  const forearmGeo = new THREE.CylinderGeometry(0.065, 0.058, 0.38, 16);
  forearmGeo.translate(0, -0.18, 0);
  const leftForearm = new THREE.Mesh(forearmGeo, blazerMat);
  leftForearm.position.set(0, -0.38, 0);
  leftArmGroup.add(leftForearm);

  // White shirt cuff at wrist
  const leftCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16), shirtWhiteMat);
  leftCuff.position.set(0, -0.37, 0);
  leftForearm.add(leftCuff);

  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), skinMat);
  leftHand.scale.set(0.9, 1.2, 0.7);
  leftHand.position.set(0, -0.41, 0);
  leftForearm.add(leftHand);

  bodyGroup.add(leftArmGroup);

  // Right Arm (Holding the Water Bottle Upward)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.35, 1.66, 0);

  const rightUpperArm = new THREE.Mesh(upperArmGeo, blazerMat);
  rightArmGroup.add(rightUpperArm);

  const rightForearmGroup = new THREE.Group();
  rightForearmGroup.position.set(0, -0.38, 0);
  const rightForearm = new THREE.Mesh(forearmGeo, blazerMat);
  rightForearmGroup.add(rightForearm);
  rightArmGroup.add(rightForearmGroup);

  // White shirt cuff on right wrist
  const rightCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16), shirtWhiteMat);
  rightCuff.position.set(0, -0.37, 0);
  rightForearmGroup.add(rightCuff);

  const rightHandGroup = new THREE.Group();
  rightHandGroup.position.set(0, -0.41, 0);
  rightForearmGroup.add(rightHandGroup);

  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.085, 0.045), skinMat);
  rightHandGroup.add(palm);

  for (let i = 0; i < 4; i++) {
    const fingerY = 0.028 - i * 0.02;
    const finger = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.011, 8, 12, Math.PI * 0.95), skinMat);
    finger.position.set(0.018, fingerY, 0.028);
    finger.rotation.set(0, Math.PI / 2, 0);
    rightHandGroup.add(finger);
  }

  const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.055, 8), skinMat);
  thumb.position.set(-0.035, 0.01, 0.02);
  thumb.rotation.set(0.4, 0.3, 0.8);
  rightHandGroup.add(thumb);

  // Glass Water Bottle
  const bottleGroup = new THREE.Group();
  bottleGroup.position.set(0.02, 0, 0.038);
  bottleGroup.rotation.x = Math.PI / 2;

  const bottleMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 0.38, 24), glassMat);
  bottleMesh.castShadow = true;
  bottleGroup.add(bottleMesh);

  const waterMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.3, 20), waterMat);
  waterMesh.position.y = -0.025;
  bottleGroup.add(waterMesh);

  const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.065, 20), bottleCapMat);
  capMesh.position.y = 0.21;
  bottleGroup.add(capMesh);

  rightHandGroup.add(bottleGroup);
  bodyGroup.add(rightArmGroup);

  // 6. Medium Blue Denim Jeans & Navy Sneakers
  const createRealLeg = (isLeft) => {
    const legGroup = new THREE.Group();
    const x = isLeft ? -0.135 : 0.135;
    legGroup.position.set(x, 0.92, 0);

    const upperLegGeo = new THREE.CylinderGeometry(0.09, 0.078, 0.48, 20);
    upperLegGeo.translate(0, -0.22, 0);
    const upperLeg = new THREE.Mesh(upperLegGeo, jeansMat);
    upperLeg.castShadow = true;
    legGroup.add(upperLeg);

    const lowerLegGroup = new THREE.Group();
    lowerLegGroup.position.set(0, -0.44, 0);
    const lowerLegGeo = new THREE.CylinderGeometry(0.075, 0.068, 0.48, 20);
    lowerLegGeo.translate(0, -0.22, 0);
    const lowerLeg = new THREE.Mesh(lowerLegGeo, jeansMat);
    lowerLeg.castShadow = true;
    lowerLegGroup.add(lowerLeg);
    legGroup.add(lowerLegGroup);

    // Navy Sneaker with White Rubber Sole
    const sneakerGroup = new THREE.Group();
    sneakerGroup.position.set(0, -0.46, 0.04);

    const shoeBody = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.085, 0.25), sneakerBodyMat);
    shoeBody.castShadow = true;
    sneakerGroup.add(shoeBody);

    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.035, 0.27), sneakerSoleMat);
    sole.position.y = -0.045;
    sneakerGroup.add(sole);

    lowerLegGroup.add(sneakerGroup);

    return { legGroup, lowerLegGroup };
  };

  const leftLeg = createRealLeg(true);
  const rightLeg = createRealLeg(false);
  bodyGroup.add(leftLeg.legGroup);
  bodyGroup.add(rightLeg.legGroup);

  // --- Locomotion & Animation Updates ---
  let blinkTimer = 0;
  let isBlinking = false;

  const update = (time, delta, animState) => {
    blinkTimer += delta;
    if (!isBlinking && blinkTimer > 3.4) {
      isBlinking = true;
      blinkTimer = 0;
    }
    if (isBlinking) {
      if (blinkTimer < 0.12) {
        leftEye.scale.y = 0.1;
        rightEye.scale.y = 0.1;
      } else {
        leftEye.scale.y = 1;
        rightEye.scale.y = 1;
        isBlinking = false;
        blinkTimer = 0;
      }
    }

    switch (animState) {
      case 'walk_in': {
        const freq = 7.5;
        leftLeg.legGroup.rotation.x = Math.sin(time * freq) * 0.52;
        rightLeg.legGroup.rotation.x = -Math.sin(time * freq) * 0.52;

        leftArmGroup.rotation.x = -Math.sin(time * freq) * 0.45;
        leftArmGroup.rotation.z = 0.1;

        rightArmGroup.rotation.x = -0.75 + Math.sin(time * freq * 0.5) * 0.08;
        rightArmGroup.rotation.z = -0.4;
        rightForearmGroup.rotation.x = -0.8;

        bodyGroup.position.y = Math.abs(Math.sin(time * freq)) * 0.04;
        headGroup.rotation.z = Math.sin(time * (freq / 2)) * 0.03;
        headGroup.rotation.x = 0;
        break;
      }

      case 'run_happy': {
        // Fast Sprint (User clicked YES!)
        const runFreq = 14;
        leftLeg.legGroup.rotation.x = Math.sin(time * runFreq) * 0.95;
        rightLeg.legGroup.rotation.x = -Math.sin(time * runFreq) * 0.95;

        rightArmGroup.rotation.x = -1.6;
        rightArmGroup.rotation.z = -0.45;
        rightForearmGroup.rotation.x = -0.4;

        leftArmGroup.rotation.x = -Math.sin(time * runFreq) * 1.1;
        leftArmGroup.rotation.z = 0.25;

        bodyGroup.position.y = Math.abs(Math.sin(time * runFreq)) * 0.16;
        headGroup.rotation.x = -0.15;
        headGroup.rotation.z = Math.sin(time * 7) * 0.08;
        break;
      }

      case 'walk_dull': {
        // Dull Sad Walk (User clicked Remind Later)
        const dullFreq = 4.2;
        leftLeg.legGroup.rotation.x = Math.sin(time * dullFreq) * 0.28;
        rightLeg.legGroup.rotation.x = -Math.sin(time * dullFreq) * 0.28;

        leftArmGroup.rotation.x = -Math.sin(time * dullFreq) * 0.2;
        leftArmGroup.rotation.z = 0.05;

        rightArmGroup.rotation.x = 0.15;
        rightArmGroup.rotation.z = -0.1;
        rightForearmGroup.rotation.x = -0.2;

        bodyGroup.position.y = Math.abs(Math.sin(time * dullFreq)) * 0.02;
        headGroup.rotation.x = 0.35;
        headGroup.rotation.z = 0;
        break;
      }

      case 'idle_present':
      default: {
        // Natural human breathing & presenting bottle
        leftLeg.legGroup.rotation.x = 0;
        rightLeg.legGroup.rotation.x = 0;

        rightArmGroup.rotation.x = -0.85 + Math.sin(time * 2) * 0.03;
        rightArmGroup.rotation.z = -0.42;
        rightForearmGroup.rotation.x = -0.75;

        leftArmGroup.rotation.x = 0;
        leftArmGroup.rotation.z = 0.12 + Math.sin(time * 2) * 0.02;

        bodyGroup.position.y = Math.sin(time * 2) * 0.02;
        headGroup.rotation.x = Math.sin(time * 1.8) * 0.025;
        headGroup.rotation.z = Math.sin(time * 1.5) * 0.02;
        break;
      }
    }
  };

  return {
    root,
    headGroup,
    bodyGroup,
    leftArmGroup,
    rightArmGroup,
    update,
  };
}

export async function loadGLBModel(url) {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetHeight = 2.4;
        const scale = targetHeight / (maxDim || 1);
        model.scale.setScalar(scale);

        box.setFromObject(model);
        model.position.y -= box.min.y;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const mixer = new THREE.AnimationMixer(model);
        const animations = gltf.animations || [];
        const actions = {};

        animations.forEach((clip) => {
          const name = clip.name.toLowerCase();
          const action = mixer.clipAction(clip);
          actions[clip.name] = action;

          if (/run|sprint|fast/i.test(name)) actions['run_happy'] = action;
          else if (/walk|move/i.test(name)) actions['walk_in'] = action;
          else if (/idle|stand|wait/i.test(name)) actions['idle_present'] = action;
          else if (/sad|dull|slow/i.test(name)) actions['walk_dull'] = action;
        });

        resolve({
          root: model,
          mixer,
          actions,
          isCustomGLTF: true,
        });
      },
      undefined,
      (error) => reject(error)
    );
  });
}

export const createRealisticHumanAvatar = createExactTurnaroundCharacter;

