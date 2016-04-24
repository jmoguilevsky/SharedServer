#!/bin/bash

JSON_USERS=`curl "https://enigmatic-depths-58073.herokuapp.com/users"`

python -c "from tests import *;setattr(TestUsersGet,\"_response\",$JSON_USERS);main()"
