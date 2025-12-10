#!/usr/bin/env python3
import sys
import json
import re

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    print(json.dumps({"error": "youtube-transcript-api not installed. Run: py -m pip install youtube-transcript-api"}))
    sys.exit(1)

def extract_video_id(url):
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)',
        r'^([a-zA-Z0-9_-]{11})$'
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

if len(sys.argv) < 2:
    print(json.dumps({"error": "No video ID provided"}))
    sys.exit(1)

video_id = extract_video_id(sys.argv[1])
if not video_id:
    print(json.dumps({"error": "Invalid YouTube URL or video ID"}))
    sys.exit(1)

try:
    api = YouTubeTranscriptApi()
    transcript = api.fetch(video_id)
    text = ' '.join([item.text for item in transcript])
    print(json.dumps({"transcript": text}))
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
