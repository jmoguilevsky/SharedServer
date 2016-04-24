#!/bin/bash

JSON_USERS=`curl "https://enigmatic-depths-58073.herokuapp.com/users"`

python deserializeJsons.py $JSON_USERS
