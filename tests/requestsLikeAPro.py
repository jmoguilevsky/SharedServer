import requests
res = requests.get("https://enigmatic-depths-58073.herokuapp.com/users")
print res.headers
print
print res.text
print
