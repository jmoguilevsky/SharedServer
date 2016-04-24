#!/bin/bash

JSON_USERS=`curl "https://enigmatic-depths-58073.herokuapp.com/users"`

python -c "import deserializeJsons; deserializeJsons.deserializeRequest($JSON_USERS)"
