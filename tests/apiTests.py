from jsonschema import validate
import unittest
import requests
import json


class TestUserGet(unittest.TestCase):
	
	def setUp(self):
		self.userSchema = { 
			"type" : "object",
			"properties": { 
				"id" : {"type" : "number"},
				"name" : {"type" : "string"},
				"alias" : {"type" : "string"},
				"email" : {"type" : "string"},
				"photo_profile" : {"type" : "string"},
				"interests" : {
					"type" : "array",
					"items" : {"type" : "object"}
				},
				"location" : {"type" : "object"}
			}
		}
				
				

	def test_validate_user_schema(self):
		"""This test is going to proof that the API is working."""
		
		response = requests.get("https://enigmatic-depths-58073.herokuapp.com/users/1")
		
		json_body = json.loads(response.text)
		user_data = json_body["user"]
		validate(user_data, self.userSchema)

		self.assertTrue(True)

def main():
	unittest.main()


if __name__ == '__main__':
	main()

'''headers = {'content-type': 'application/json'}

res = requests.get("https://enigmatic-depths-58073.herokuapp.com/interests")
print res.headers
print
print res.text
print

dict = json.loads(res.text)

print dict["interests"][0]["category"]

url = "http://enigmatic-depths-58073.herokuapp.com/users"

payload = "{\n  \"user\": { \n    \"name\": \"usuario\",\n    \"alias\": \"not a user\",\n    \"email\": \"usuario@usuario.com\",\n    \"interests\": [{\n    \t\"category\": \"music/band\",\n    \t\"value\": \"radiohead\"\n      }, {\n    \t\"category\": \"music/band\",\n    \t\"value\": \"pearl jam\"\n      },{\n    \t\"category\": \"outdoors\",\n    \t\"value\": \"running\"\n    }],\n    \"location\": { \n         \"latitude\": -121.45356,\n         \"longitude\": 46.51119\n    }\n  },\n  \"metadata\": {\n        \"version\": \"0.1\"\n  }\n}"
headers = {
    'content-type': "application/json",
    'cache-control': "no-cache",
    'postman-token': "b73759ee-9de9-6044-ca71-76cd5bed89b0"
    }

response = requests.request("POST", url, data=payload, headers=headers)

print(response.text)'''
