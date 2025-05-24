This server is more like an API for an API. When doing a request on this server, it does some other requests to the school's servers in order to get my grades and then it returns that response in a more human-readable way. I made it in order to get a notification whenever a grade or an absence is added. Basically I run this app on my raspberry pi alongside an amazing opensource project called ChangeDetection.io and I make ChangeDetection.io monitor the content of this server. Whenever something changes here, it means it changed on the school's servers as well and I can get an email regarding that change.

# Routes
## '/grades'
This displays the my grades in ascending order of IDs and in the following format (may change in the future):
[id <grade id>] [for <date>] [processed on <lastUpdateTime>]    <score> <processed subject id>
An example of such line would be:
[id 26589108] [for 12 SEP 2024]  [processed on 17 SEP 2024 10:04]    10 LIMBA ENGLEZĂ

## '/absences'
This displays my absences in ascending order of IDs.
This is the format (may change in the future):
[id <absence id>] [for <date>] [processed on <lastUpdateTime>]    <motivated == 1 ? ✅ : ❌> <processed subject id> 
[id 12323864] [for 12 SEP 2024]  [processed on 17 SEP 2024 10:04]    ❌ LIMBA ENGLEZĂ
