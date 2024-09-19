#!/bin/bash

# Function to process images
process_image() {
    local file="$1"
    local dir=$(dirname "$file")
    local filename=$(basename "$file")
    magick convert "$file" -resize 600x "${dir}/600px_${filename}"
    echo "Processed: $file"
}

# Find and process all jpg files in the current directory and subdirectories
find . -type f \( -iname \*.jpg -o -iname \*.jpeg \) | while read file; do
    process_image "$file"
done

echo "All images have been processed."