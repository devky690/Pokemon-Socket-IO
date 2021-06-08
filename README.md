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
Sometimes if a player starts a game early without another playing being room the game can never end. To fix the user would need to refresh their browser. But this doesnt happen all time - sometimes its okay, so not a big bug. And player shouldnt be starting a game early anyhow.

Also when a player joins a room with other players. If they join a different room, they will be able to see the previous room messages, but they shouldnt even
be joining another group of players room anyhow. I want to just limit to two players


# Chat Room
Add a chat room for each room 

# User Guide
Add a user guide page with just the rooms form to join a room and the instructions to play the game
(this wont be a page technically but itll just be conditional rendering)

# Deployment

Need to figure out how to deploy a bundler like snowpack. Options: heroku
