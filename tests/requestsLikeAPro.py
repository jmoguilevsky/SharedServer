import requests
import json
headers = {'content-type': 'application/json'}

res = requests.get("https://enigmatic-depths-58073.herokuapp.com/users")
print res.headers
print
print res.text
print

url = "http://enigmatic-depths-58073.herokuapp.com/users"

payload = "{\n  \"user\": { \n    \"name\": \"usuario\",\n    \"alias\": \"not a user\",\n    \"email\": \"usuario@usuario.com\",\n    \"interests\": [{\n    \t\"category\": \"music/band\",\n    \t\"value\": \"radiohead\"\n      }, {\n    \t\"category\": \"music/band\",\n    \t\"value\": \"pearl jam\"\n      },{\n    \t\"category\": \"outdoors\",\n    \t\"value\": \"running\"\n    }],\n    \"location\": { \n         \"latitude\": -121.45356,\n         \"longitude\": 46.51119\n    }\n  },\n  \"metadata\": {\n        \"version\": \"0.1\"\n  }\n}"
headers = {
    'content-type': "application/json",
    'cache-control': "no-cache",
    'postman-token': "b73759ee-9de9-6044-ca71-76cd5bed89b0"
    }

response = requests.request("POST", url, data=payload, headers=headers)

print(response.text)
