import requests
import json

res = requests.get("https://enigmatic-depths-58073.herokuapp.com/users")
print res.headers
print
print res.text
print

str="""{
  "user": { 
    "name": "usuario",
    "alias": "not a user",
    "email": "usuario@usuario.com",
    "interests": [{
    	"category": "music/band",
    	"value": "radiohead"
      }, {
    	"category": "music/band",
    	"value": "pearl jam"
      },{
    	"category": "outdoors",
    	"value": "running"
    }],
    "location": { 
         "latitude": -121.45356,
         "longitude": 46.51119
    }
  },
  "metadata": {
        "version": "0.1"
  }
}"""

r = requests.post('https://enigmatic-depths-58073.herokuapp.com/users', data=json.dumps(str), headers={'content-type': 'application/json'});
