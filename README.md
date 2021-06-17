# Pokemon-Socket-IO

# Setup client

just use cdn socket.io from cdn library website

for prod:
const socket = io("https://pokemon-socket-io.herokuapp.com");

for dev:
const socket = io("http://localhost:3000" );

# Setup Server

npm i nodemon socket.io

# Changes

Create a hashmap to store rooms 1 - 4, then just assign playerMoves array
to that room

If I want to make it scalable to add alot of rooms
just make a createRoom function and initialize a playerMoves array inside
so that due to scoping its a new playerMoves array each time as a value for the
hashmap

Being able to create rooms would need a db which i want to hold off for now

deleting pokeone and pokeTwo to avoid timing issues if there are any within the browser...
so its literaly impossible for the pokeObjects to be printed

# Decisions

to make sure last move isnt from the previous user
cant use a hashset because if user used a different pokemon it would count as a
different move

# Bug Fixes

All bugs fixed!

# Chat Room

Add a chat room for each room

# User Guide

Add a user guide page with just the rooms form to join a room and the instructions to play the game
(this wont be a page technically but itll just be conditional rendering)

# Deployment

https://pokemon-socket-io.herokuapp.com/ 

# Take Notice

a socket.id is a room by default
stick to logic in backend to avoid timing issues
