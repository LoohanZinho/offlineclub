import requests
import os

short_links = [
    {
        "short_url": "https://vt.tiktok.com/ZS52xyBJk/",
        "output": "public/horizontal1_hq.mp4"
    },
    {
        "short_url": "https://vt.tiktok.com/ZS5293fsH/",
        "output": "public/horizontal2_hq.mp4"
    },
    {
        "short_url": "https://vt.tiktok.com/ZS529yb5A/",
        "output": "public/horizontal3_hq.mp4"
    }
]

api_base = "https://www.tikwm.com/api/"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

for item in short_links:
    print(f"Resolving {item['short_url']}...")
    try:
        # Resolve the Redirect
        # We use a session to handle cookies/redirects better
        session = requests.Session()
        resp = session.get(item['short_url'], headers=headers, allow_redirects=True)
        full_url = resp.url
        
        # Sometimes it lands on a 'clean' URL, sometimes with params.
        # TikWM needs the video ID or clean URL.
        print(f"Resolved to: {full_url}")
        
        # Now fetch from API
        print(f"Fetching data for {item['output']} from TikWM...")
        api_resp = requests.post(api_base, data={"url": full_url}, headers=headers)
        data = api_resp.json()
        
        if data.get("code") == 0:
            # Prefer 'hdplay' if available, else 'play'
            download_url = data["data"].get("hdplay") or data["data"].get("play")
            
            if download_url:
                print(f"Downloading video from {download_url}...")
                video_content = requests.get(download_url, headers=headers).content
                with open(item['output'], 'wb') as f:
                    f.write(video_content)
                print(f"Saved to {item['output']}")
            else:
                print("No download URL found in API response.")
                print(data)
        else:
            print(f"TikWM Error: {data}")
            
    except Exception as e:
        print(f"Exception for {item['short_url']}: {e}")

print("Download process complete.")
