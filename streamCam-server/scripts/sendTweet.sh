# Send Tweet of the Last Image we have downloaded
now=$(date +"%d-%m-%Y")
latestPhoto=$(ls -t ./data/$now/* | head -1)
now=$(date +"%a %b %d %k:%M")
/usr/local/bin/twurl -X POST "/1.1/statuses/update_with_media.json" --file "$latestPhoto" --file-field "media" -d "status=A view from our LOCATION taken at $now" -b -t -a "TOKEN" -s 'SECRET'
