'use strict'

// Store active connections in an array
const connections = [];

module.exports = async function (fastify, opts) {
  fastify.get('/ws', { websocket: true }, async function (connection, request) {
    // Add the new connection to the connections array
    connections.push(connection);

    connection.socket.on('message', message => {
      let mgs =  message.toString()
      // Send the message to all connected clients
      broadcastMessage(mgs);
    });

    connection.socket.on('close', () => {
      // Remove the closed connection from the connections array
      const index = connections.indexOf(connection);
      if (index !== -1) {
        connections.splice(index, 1);
      }
    });
  });
}

// Function to broadcast a message to all connected clients
function broadcastMessage(message) {
  connections.forEach(connection => {
    connection.socket.send(message);
  });
}
