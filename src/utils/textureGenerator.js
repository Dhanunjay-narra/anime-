import * as THREE from 'three';

/**
 * Creates high-res textures matching the character sheet:
 * - Natural South-Asian warm skin tone
 * - Black tailored blazer fabric with lapel seams
 * - Crisp white cotton shirt with button placket
 * - Medium blue denim jeans
 * - Navy sneakers with white sole trim
 */
export function createCharacterSheetTextures() {
  // 1. Skin Texture
  const skinCanvas = document.createElement('canvas');
  skinCanvas.width = 1024;
  skinCanvas.height = 1024;
  const sCtx = skinCanvas.getContext('2d');

  const skinGrad = sCtx.createRadialGradient(512, 450, 60, 512, 512, 600);
  skinGrad.addColorStop(0, '#e5b08c');
  skinGrad.addColorStop(0.45, '#d49b73');
  skinGrad.addColorStop(0.85, '#bf8259');
  skinGrad.addColorStop(1, '#a66a42');
  sCtx.fillStyle = skinGrad;
  sCtx.fillRect(0, 0, 1024, 1024);

  const skinTexture = new THREE.CanvasTexture(skinCanvas);

  // 2. Black Blazer Jacket Texture
  const blazerCanvas = document.createElement('canvas');
  blazerCanvas.width = 1024;
  blazerCanvas.height = 1024;
  const bCtx = blazerCanvas.getContext('2d');

  bCtx.fillStyle = '#222326'; // Deep charcoal/black blazer
  bCtx.fillRect(0, 0, 1024, 1024);

  // Subtle suit fabric weave
  bCtx.fillStyle = 'rgba(255, 255, 255, 0.025)';
  for (let x = 0; x < 1024; x += 3) {
    bCtx.fillRect(x, 0, 1, 1024);
  }
  bCtx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  for (let y = 0; y < 1024; y += 3) {
    bCtx.fillRect(0, y, 1024, 1);
  }

  // Tailored lapel edge stitching
  bCtx.strokeStyle = '#141416';
  bCtx.lineWidth = 2.5;
  bCtx.strokeRect(16, 16, 992, 992);

  const blazerTexture = new THREE.CanvasTexture(blazerCanvas);
  blazerTexture.wrapS = THREE.RepeatWrapping;
  blazerTexture.wrapT = THREE.RepeatWrapping;

  // 3. Medium Blue Jeans Texture
  const jeansCanvas = document.createElement('canvas');
  jeansCanvas.width = 1024;
  jeansCanvas.height = 1024;
  const jCtx = jeansCanvas.getContext('2d');

  // Medium classic blue denim
  jCtx.fillStyle = '#4c78a4';
  jCtx.fillRect(0, 0, 1024, 1024);

  // Vertical twill denim grain
  jCtx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  for (let x = 0; x < 1024; x += 3) {
    jCtx.fillRect(x, 0, 1.5, 1024);
  }

  // Center thigh wash highlight
  const jWash = jCtx.createLinearGradient(0, 0, 1024, 0);
  jWash.addColorStop(0, 'rgba(0, 0, 0, 0.15)');
  jWash.addColorStop(0.5, 'rgba(255, 255, 255, 0.18)');
  jWash.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
  jCtx.fillStyle = jWash;
  jCtx.fillRect(0, 0, 1024, 1024);

  // Denim side stitching
  jCtx.strokeStyle = '#c68b35';
  jCtx.lineWidth = 3;
  jCtx.setLineDash([8, 6]);
  jCtx.strokeRect(10, 10, 1004, 1004);

  const jeansTexture = new THREE.CanvasTexture(jeansCanvas);
  jeansTexture.wrapS = THREE.RepeatWrapping;
  jeansTexture.wrapT = THREE.RepeatWrapping;

  // 4. Navy Sneakers with White Sole Texture
  const shoeCanvas = document.createElement('canvas');
  shoeCanvas.width = 512;
  shoeCanvas.height = 512;
  const shCtx = shoeCanvas.getContext('2d');

  // Navy blue shoe body
  shCtx.fillStyle = '#232d3d';
  shCtx.fillRect(0, 0, 512, 512);

  // Dark laces
  shCtx.strokeStyle = '#181f2b';
  shCtx.lineWidth = 5;
  for (let y = 100; y < 400; y += 40) {
    shCtx.beginPath();
    shCtx.moveTo(140, y);
    shCtx.lineTo(372, y + 20);
    shCtx.stroke();
    shCtx.beginPath();
    shCtx.moveTo(372, y);
    shCtx.lineTo(140, y + 20);
    shCtx.stroke();
  }

  const shoeTexture = new THREE.CanvasTexture(shoeCanvas);

  // 5. Hair Texture
  const hairCanvas = document.createElement('canvas');
  hairCanvas.width = 512;
  hairCanvas.height = 512;
  const hCtx = hairCanvas.getContext('2d');

  hCtx.fillStyle = '#17171a';
  hCtx.fillRect(0, 0, 512, 512);

  hCtx.strokeStyle = 'rgba(65, 65, 75, 0.7)';
  hCtx.lineWidth = 1.2;
  for (let i = 0; i < 2500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    hCtx.beginPath();
    hCtx.moveTo(x, y);
    hCtx.lineTo(x + (Math.random() - 0.5) * 6, y + 15 + Math.random() * 20);
    hCtx.stroke();
  }

  const hairTexture = new THREE.CanvasTexture(hairCanvas);
  hairTexture.wrapS = THREE.RepeatWrapping;
  hairTexture.wrapT = THREE.RepeatWrapping;

  return {
    skinTexture,
    blazerTexture,
    jeansTexture,
    shoeTexture,
    hairTexture,
  };
}
