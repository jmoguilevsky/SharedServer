#!/bin/bash

JSON_USERS=`curl "https://enigmatic-depths-58073.herokuapp.com/users"`

python -c "from deserializeJsons import _response, main, deserializeRequest;_response = $JSON_USERS;from deserializeJsons import TestUsersGet; main()"
