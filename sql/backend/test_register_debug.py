#!/usr/bin/env python
import json
import urllib.request
import urllib.error

url = 'http://127.0.0.1:8000/auth/register'
data = json.dumps({'email': 'test2@example.com', 'password': 'password123'}).encode('utf-8')
headers = {'Content-Type': 'application/json'}

print("Sending request to:", url)
print("Data:", data.decode())

try:
    request = urllib.request.Request(url, data=data, headers=headers, method='POST')
    print("Request headers:", dict(request.headers))
    response = urllib.request.urlopen(request)
    print(f'Status: {response.status}')
    body = response.read().decode()
    print(f'Response: {body}')
except urllib.error.HTTPError as e:
    print(f'HTTP Status: {e.code}')
    print(f'HTTP Reason: {e.reason}')
    body = e.read().decode()
    print(f'Response body: {body}')
    print(f'Response headers: {dict(e.headers)}')
    # Try to get more details
    if e.code == 500:
        print("\nDEBUG: 500 error detected!")
except Exception as e:
    print(f'Error: {e}')
    import traceback
    traceback.print_exc()
