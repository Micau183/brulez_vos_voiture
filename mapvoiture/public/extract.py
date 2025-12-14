import os
import csv
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

# ===== CONFIG =====
IMAGE_FOLDER = "photos"
OUTPUT_CSV = "data.csv"
DEFAULT_COLOR = "#999999"
DEFAULT_DESCRIPTION = "no description"
# ==================


def get_exif_data(image_path):
    try:
        image = Image.open(image_path)
        exif_data = image._getexif()
        if not exif_data:
            return {}

        exif = {}
        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            exif[tag] = value
        return exif
    except Exception:
        return {}


def get_gps_info(exif):
    gps_info = exif.get("GPSInfo")
    if not gps_info:
        return None, None

    gps_data = {}
    for key in gps_info:
        decoded = GPSTAGS.get(key, key)
        gps_data[decoded] = gps_info[key]

    def convert_to_degrees(value):
        d, m, s = value
        return d + (m / 60.0) + (s / 3600.0)

    try:
        lat = convert_to_degrees(gps_data["GPSLatitude"])
        if gps_data["GPSLatitudeRef"] != "N":
            lat = -lat

        lon = convert_to_degrees(gps_data["GPSLongitude"])
        if gps_data["GPSLongitudeRef"] != "E":
            lon = -lon

        return lat, lon
    except Exception:
        return None, None


def load_existing_rows():
    if not os.path.exists(OUTPUT_CSV):
        return [], set()

    rows = []
    existing_images = set()

    with open(OUTPUT_CSV, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # rétrocompatibilité si les colonnes n'existent pas encore
            row.setdefault("color", DEFAULT_COLOR)
            row.setdefault("description", DEFAULT_DESCRIPTION)

            rows.append(row)
            existing_images.add(row["image_name"])

    return rows, existing_images


def extract_images_to_csv():
    rows, existing_images = load_existing_rows()
    new_count = 0

    for file in os.listdir(IMAGE_FOLDER):
        if not file.lower().endswith((".jpg", ".jpeg", ".png")):
            continue

        if file in existing_images:
            continue

        path = os.path.join(IMAGE_FOLDER, file)
        exif = get_exif_data(path)

        date_taken = exif.get("DateTimeOriginal", "Unknown")
        lat, lon = get_gps_info(exif)
        location = f"{lat}, {lon}" if lat is not None and lon is not None else "Unknown"

        rows.append({
            "image_name": file,
            "date_taken": date_taken,
            "location": location,
            "color": DEFAULT_COLOR,
            "description": DEFAULT_DESCRIPTION
        })

        new_count += 1

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as csvfile:
        fieldnames = [
            "image_name",
            "date_taken",
            "location",
            "color",
            "description"
        ]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        writer.writerows(rows)

    print(f"✅ CSV mis à jour : {new_count} nouvelle(s) photo(s) ajoutée(s)")


if __name__ == "__main__":
    extract_images_to_csv()
