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
