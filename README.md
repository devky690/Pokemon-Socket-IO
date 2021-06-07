# Pokemon-Socket-IO

# Setup client

npm i snowpack socket.io-client

utilizing snowpack bundler - bundles files together and has them run on a single
port - localhost:8080

# Setup Server

npm i nodemon socket.io

# Changes

Create a hashmap to store rooms 1 - 4, then just assign playerMoves array
to that room

If I want to make it scalable to add alot of rooms
just make a createRoom function and initialize a playerMoves array inside
so that due to scoping its a new playerMoves array each time as a value for the
hashmap

Being able to create  rooms would need a db which i want to hold off for now

# Decisions

to make sure last move isnt from the previous user
cant use a hashset because if user used a different pokemon it would count as a
different move

# Bug Fixes

Not finishing game before moving onto a different room and then refreshing, means that players that join the room that was left, would need to refresh the page so that the playMoves associated with the room id can be deleted. The reason why communication doesnt occur is because the communication cant occur with a disconnected socket. Thus we need to just tell the user to refresh if they arent able to play because that would allow the room to be reset. To resolve this in the future try using cookies with jwt token to store an array of socket ids that a user has in a session then just reset all rooms the user had before disconnecting and expire that cookie 

# Chat Room
Add a chat room for each room 

# User Guide
Add a user guide page with just the rooms form to join a room and the instructions to play the game
(this wont be a page technically but itll just be conditional rendering)

# Deployment

Need to figure out how to deploy a bundler like snowpack. Options: heroku
