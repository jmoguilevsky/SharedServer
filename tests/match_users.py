class MatchUser(object):
		
	def __init__(self, json_dict):

		self.id = json_dict["id"]
		self.name = json_dict["name"]
		self.alias = json_dict["alias"]
		self.email = json_dict["email"]
		self.photo_profile = json_dict["photo_profile"]
		self.latitude = json_dict["latitude"]
		self.interests = [Interest(x) for x in json_dict["interests"]]

	def __str__(self):
		return  str(self.id) + "\n"+ \
			self.name + "\n" + \
			self.alias + "\n" + \
			self.email + "\n" + \
			str(self.interests)

class Interest(object):
	
	def __init__(self, json_dict):
		self.value = json_dict["value"]
		self.category = json_dict["category"]

	def __repr__(self):
		return "\\" + self.category + "\\" + self.value
