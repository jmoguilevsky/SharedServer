#!/usr/bin/python

from match_users import *
import unittest
import sys
import json


def deserializeRequest(response):
	"""Receives a response dict. Returns a list of MatchUsers"""
	return [MatchUser(x["user"]) for x in response["users"]]
 

class TestUsersGet(unittest.TestCase):
	
	def setUp(self):
		self.match_users = deserializeRequest(self._response)	

	def test_show_names(self):
		"""This test is going to proof that the API is working."""
		print "Received Data"
		
		print self.match_users

		self.assertTrue(self.match_users != None)
		for user in self.match_users:
			self.assertNotEqual(user.name, "")
			self.assertNotEqual(user.name, None)

	def test_false(self):
		self.assertTrue(False)
	
	# Insert Your Tests Here

def main():
	
	unittest.main()


if __name__ == '__main__':

	main()
