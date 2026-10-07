from PIL import Image
import numpy as np
from collections import deque
import os

artifact_dir = r"C:\Users\DHANUNJAY\.gemini\antigravity\brain\d1f6853d-ba46-436d-a25e-069d7416f225"
public_dir = r"c:\Users\DHANUNJAY\OneDrive\Desktop\desktop anime\public"

tasks = [
    ("character_idle_1791354388815.jpg", "character_idle.png"),
    ("character_walk_1791354445737.jpg", "character_walk.png"),
    ("character_run_1791354485148.jpg", "character_run.png"),
]

def clean_cutout(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    arr = np.array(img, dtype=np.float32)
    h, w, _ = arr.shape

    # 1. Sample perimeter background color
    top_samples = arr[0:15, :, :3]
    left_samples = arr[:, 0:15, :3]
    right_samples = arr[:, -15:, :3]
    bg_color = np.mean(np.concatenate([top_samples.reshape(-1, 3), left_samples.reshape(-1, 3), right_samples.reshape(-1, 3)]), axis=0)
    print(f"Sampled Background Color: {bg_color}")

    # 2. Color difference map
    diff = np.sqrt(np.sum((arr[:, :, :3] - bg_color) ** 2, axis=2))
    
    # 3. Outer border seeded Flood Fill (BFS)
    # Starts ONLY on the image edges and spreads through background
    mask = np.zeros((h, w), dtype=bool)
    q = deque()

    # Seed top, left, right, and bottom borders
    for x in range(w):
        if diff[0, x] < 60:
            mask[0, x] = True
            q.append((0, x))
        if diff[h - 1, x] < 60:
            mask[h - 1, x] = True
            q.append((h - 1, x))
            
    for y in range(h):
        if diff[y, 0] < 60 and not mask[y, 0]:
            mask[y, 0] = True
            q.append((y, 0))
        if diff[y, w - 1] < 60 and not mask[y, w - 1]:
            mask[y, w - 1] = True
            q.append((y, w - 1))

    # Threshold for background connectivity
    threshold = 52.0

    while q:
        cy, cx = q.popleft()
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w:
                if not mask[ny, nx]:
                    # If neighbor is close to background, flood it
                    if diff[ny, nx] < threshold:
                        mask[ny, nx] = True
                        q.append((ny, nx))

    # 4. Set Alpha channel: Background = 0, Person = 255 (100% Solid)
    arr[:, :, 3] = np.where(mask, 0, 255)

    # 5. Clean feathering on the 1-pixel boundary
    from scipy.ndimage import binary_dilation
    border_pixels = binary_dilation(mask) & ~mask
    for y, x in zip(*np.where(border_pixels)):
        factor = np.clip((diff[y, x] - 35) / 25.0, 0.0, 1.0)
        arr[y, x, 3] = int(255 * factor)

    result = Image.fromarray(arr.astype(np.uint8))
    result.save(out_path, "PNG")
    print(f"Flawless cutout saved: {out_path}")

for src, dest in tasks:
    src_p = os.path.join(artifact_dir, src)
    dest_p = os.path.join(public_dir, dest)
    if os.path.exists(src_p):
        clean_cutout(src_p, dest_p)

# Also copy character_idle to character_sad as fallback
Image.open(os.path.join(public_dir, "character_idle.png")).save(os.path.join(public_dir, "character_sad.png"))

print("All transparent PNG cutouts created with 100% solid opacity on person!")

