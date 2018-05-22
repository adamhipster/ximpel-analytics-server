# open ximpelanalytics via the postgress app on your mac


# TO CREATE DATABASE
Sudo -u your_username sql
create database ximpelanalytics;
#create database ximpelanalytics_test; #for testing purposes


# TESTING
# be in the root directory
npm install -g mocha

# fill_db_with_data will do process.exit after 5 seconds
node test/fill_db_with_data.js && mocha test/test.js

# or use 
npm_test

# TESTING SESSIONS
brew install httpie
http --session=/tmp/session.json POST http://localhost:3333/beginximpelsession
