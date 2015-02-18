# Create Timelapse of last day and dump the video file
yesterday=$(date --date="1 days ago" +"%d-%m-%Y")
now=$(date +"%d-%m-%Y")

# Build Daily Timelapse
/usr/bin/avconv -y -r 30 -i ./data/$yesterday/timelapse_%05d.jpg -r 30 -vcodec libx264 -crf 20 -g 15 -vf "movie=overlay.png [watermark];[in] scale=1920:1080 [cropped],[cropped][watermark] overlay=0:0 [out]" ./latestDaytl.mp4

# Upload to YouTube
/usr/local/bin/youtube-upload --title="Timelapse Taken $yesterday" --description="A timelpase from a location on $now" --tags="timelapse, london" --client-secrets=/path/to/.youtube-client_secrets.json --location="latitude=55.1, longitude=0, altitude=10" ./latestDaytl.mp4

# Archive to NAS Drive
folder=/path/to/archive/timelapse
# cp -R ./data/$yesterday $folder/.
# rm ./data/$yesterday/*.jpg
