# Attempt to import requests, handle if missing
try:
    import requests
except ModuleNotFoundError:
    print("------------------------------------------------------------")
    print("ERROR: The 'requests' library is not available here.")
    print("Please run this script on your local machine.")
    print("Install requests using: pip install requests")
    print("------------------------------------------------------------")
    # Exit gracefully if requests is not found
    import sys
    sys.exit(1)

import os
import time # Import time for potential delays

# Define image directory relative to current execution
# IMPORTANT: Make sure this path is correct for your system
image_dir = "D:\\Projects\\neelkanth-interio\\neelkanth-interio\\public\\images"

# Create the directory if it doesn't exist
os.makedirs(image_dir, exist_ok=True)
print(f"Ensuring directory exists: {image_dir}")

# --- List of previously failed/relevant images with NEW/VALIDATED URLs ---
images_to_download = [
    {
        "filename": "portfolio-scandi-living-img2.jpg",
        # URL confirmed working previously (assuming it downloaded)
        "url": "https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        "description": "Detail Gallery: Scandi Living 2 (Replaced)"
    },
    {
        "filename": "quiz-living-boho.jpg",
        # NEW VALID URL attempt 4 (Pexels) for a Boho living room/interior
        "url": "https://images.pexels.com/photos/4210850/pexels-photo-4210850.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "description": "Quiz Option: Living Boho (Replaced - Attempt 4 - Pexels)"
    },
    {
        "filename": "insp-texture-2.jpg",
        # URL confirmed working previously (assuming it downloaded)
        "url": "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "description": "Insp Board: Texture 2 (Replaced)"
    },
]

# --- Download Logic ---
successful_downloads = 0
failed_downloads = []
download_delay = 0.05 # Small delay between downloads

# Create a Session object
session = requests.Session()
# Add a default User-Agent header
session.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'})

print(f"Attempting to download {len(images_to_download)} remaining images...")

for image_info in images_to_download:
    filename = image_info["filename"]
    url = image_info["url"]
    description = image_info["description"]
    save_path = os.path.join(image_dir, filename)

    # Skip if file already exists
    if os.path.exists(save_path):
        print(f"Skipping '{filename}' (already exists).")
        # Treat existing files as successes for the summary
        successful_downloads += 1
        # Remove from potential failed list if it existed before
        failed_downloads = [f for f in failed_downloads if not f.startswith(filename)]
        continue

    try:
        print(f"Downloading '{description}' ({filename})...")
        # Use the session to make the request
        response = session.get(url, stream=True, timeout=45) # Increased timeout
        response.raise_for_status()  # Raise an exception for bad status codes (like 404)

        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f" -> Saved to {save_path}")
        successful_downloads += 1
        time.sleep(download_delay) # Be polite to the server

    except requests.exceptions.RequestException as e:
        print(f" !! Error downloading {filename}: {e}")
        # Avoid duplicates in failed list
        fail_msg = f"{filename} ({description}) - Error: {e}"
        if fail_msg not in failed_downloads:
             failed_downloads.append(fail_msg)

    except Exception as e:
        print(f" !! An unexpected error occurred for {filename}: {e}")
        fail_msg = f"{filename} ({description}) - Unexpected Error: {e}"
        if fail_msg not in failed_downloads:
            failed_downloads.append(fail_msg)


print(f"\n--- Download Summary ---")
# Calculate how many files listed actually needed downloading (weren't skipped)
files_actually_attempted = len([f for f in images_to_download if not os.path.exists(os.path.join(image_dir, f['filename']))])
# Successful downloads in *this* run = total successful count MINUS those that already existed
successful_this_run = successful_downloads - (len(images_to_download) - files_actually_attempted)


print(f"Attempted to download/verify: {len(images_to_download)} images.")
print(f"Successful (including previously existing): {successful_downloads}")
if failed_downloads:
    print(f"Failed downloads this run: {len(failed_downloads)}")
    print("Failed items:")
    for failed in failed_downloads:
        print(f" - {failed}")
else:
    # Adjust message if some were skipped but none failed
    if successful_downloads < len(images_to_download):
         print("All remaining images downloaded successfully or already existed.")
    elif len(images_to_download) > 0: # Check if there was anything to download
        print("All images downloaded successfully.")
    else:
        print("No images needed downloading.") # If the list was empty or all existed
print("------------------------")