# Attempt to import requests, handle if missing
try:
    import requests
except ModuleNotFoundError:
    print("------------------------------------------------------------")
    print("ERROR: The 'requests' library is not available here.")
    print("Please run this script on your local machine.")
    print("Install requests using: pip install requests")
    print("------------------------------------------------------------")
    import sys
    sys.exit(1)

import os
import time

# Define image directory relative to the script's location (assuming script is in project root)
script_dir = os.path.dirname(os.path.abspath(__file__))
image_dir = os.path.join(script_dir, "public", "images")

os.makedirs(image_dir, exist_ok=True)
print(f"Ensuring directory exists: {image_dir}")

# --- List of images to retry with new URLs ---
# --- List of images to retry with new URLs ---
images_to_download = [
    {
        "filename": "tile-calacatta-gold.jpg",
        # NEW URL Attempt 4 - Pexels
        "url": "https://images.pexels.com/photos/8089168/pexels-photo-8089168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "description": "Materials Grid: Calacatta Tile (Replaced Again 3 - Pexels)"
    },
]

# --- Download Logic ---
successful_downloads = 0
failed_downloads = []
download_delay = 0.05

session = requests.Session()
session.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'})

print(f"Attempting to download/verify {len(images_to_download)} specific images...")

for image_info in images_to_download:
    filename = image_info["filename"]
    url = image_info["url"]
    description = image_info["description"]
    save_path = os.path.join(image_dir, filename)

    if os.path.exists(save_path):
        print(f"Skipping '{filename}' (already exists).")
        successful_downloads += 1
        failed_downloads = [f for f in failed_downloads if not f.startswith(filename)]
        continue

    try:
        print(f"Downloading '{description}' ({filename})...")
        response = session.get(url, stream=True, timeout=60)
        response.raise_for_status()

        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f" -> Saved to {save_path}")
        successful_downloads += 1
        time.sleep(download_delay)

    except requests.exceptions.RequestException as e:
        print(f" !! Error downloading {filename}: {e}")
        fail_msg = f"{filename} ({description}) - Error: {e}"
        if fail_msg not in failed_downloads:
             failed_downloads.append(fail_msg)

    except Exception as e:
        print(f" !! An unexpected error occurred for {filename}: {e}")
        fail_msg = f"{filename} ({description}) - Unexpected Error: {e}"
        if fail_msg not in failed_downloads:
            failed_downloads.append(fail_msg)

print(f"\n--- Retry Download Summary ---")
files_actually_attempted = len([f for f in images_to_download if not os.path.exists(os.path.join(image_dir, f['filename']))])

print(f"Attempted to download/verify: {len(images_to_download)} specific images.")
print(f"Successful this run (including previously existing): {successful_downloads}")
if failed_downloads:
    print(f"Failed downloads this run: {len(failed_downloads)}")
    print("Failed items:")
    for failed in failed_downloads:
        print(f" - {failed}")
else:
     if successful_downloads == len(images_to_download):
        print("All specified images downloaded successfully or already existed.")
     else:
         # This case shouldn't happen if none failed, but included for completeness
         print("Some images may not have been attempted if they already existed.")

print("------------------------")