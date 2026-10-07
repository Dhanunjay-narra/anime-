from rembg import remove
from PIL import Image
import os

artifact_dir = r"C:\Users\DHANUNJAY\.gemini\antigravity\brain\d1f6853d-ba46-436d-a25e-069d7416f225"
public_dir = r"c:\Users\DHANUNJAY\OneDrive\Desktop\desktop anime\public"

# Files to process
tasks = [
    ("character_idle_1791354388815.jpg", "character_idle.png"),
    ("character_walk_1791354445737.jpg", "character_walk.png"),
    ("character_run_1791354485148.jpg", "character_run.png"),
]

for src_name, dest_name in tasks:
    src_path = os.path.join(artifact_dir, src_name)
    dest_path = os.path.join(public_dir, dest_name)
    
    if os.path.exists(src_path):
        print(f"Processing AI background removal for {src_name} -> {dest_name}...")
        input_image = Image.open(src_path)
        output_image = remove(input_image)
        output_image.save(dest_path, "PNG")
        print(f"Saved flawless transparent PNG: {dest_path}")
    else:
        print(f"Source not found: {src_path}")

print("All background removals completed successfully!")

