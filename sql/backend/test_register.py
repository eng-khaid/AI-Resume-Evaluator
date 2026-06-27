import json
import urllib.request
import urllib.error
import traceback

url = 'http://localhost:8000/auth/register'
data = json.dumps({'email': 'test@example.com', 'password': 'password123'}).encode('utf-8')
headers = {'Content-Type': 'application/json'}

try:
    request = urllib.request.Request(url, data=data, headers=headers, method='POST')
    with urllib.request.urlopen(request) as response:
        print(f'Status: {response.status}')
        print(f'Response: {response.read().decode()}')
except urllib.error.HTTPError as e:
    print(f'Status: {e.code}')
    print(f'Reason: {e.reason}')
    print(f'Response: {e.read().decode()}')
except Exception as e:
    print(f'Error: {e}')
    traceback.print_exc()
