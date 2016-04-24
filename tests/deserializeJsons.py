#!/usr/bin/python

from match_users import *
import unittest
import sys
import json

_response = None

def deserializeRequest(response):
	
	return [MatchUser(x["user"]) for x in response["users"]]
 

class TestUsersGet(unittest.TestCase):
	
	def setUp(self):
		self.match_users = deserializeRequest(_response)
		print self.match_users

	def test_show_names(self):
		self.assertTrue(self.match_users != None)
		for user in self.match_users:
			self.assertNotEqual(user.name, "")
			self.assertNotEqual(user.name, None)


def main():
	
	unittest.main()


if __name__ == '__main__':

	main()
