#!/usr/bin/python

from match_users import *
import unittest
import sys
import json

def deserializeRequest(response):
	
	response = json.loads(response)
	return [MatchUser(x["user"]) for x in response["users"]]
 

class TestUsersGet(unittest.TestCase):
	
	def setUp(self):
		self.match_users = deserializeRequest(sys.argv[1])

	def test_show_names(self):
		for user in self.match_users:
			self.assertNotEqual(user.name, "")
			self.assertNotEqual(user.name, None)



if __name__ == '__main__':

	unittest.main()
