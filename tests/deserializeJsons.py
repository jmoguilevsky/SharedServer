#!/usr/bin/python

from match_users import *

def deserializeRequest(request):
	
	for json_dict in request["users"]:
		print MatchUser(json_dict["user"])


