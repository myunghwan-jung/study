const net = require('net');
const PORT = 3000;

// Create a TCP server
const server = net.createServer((socket) => {
    const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Client connected from ${clientInfo}`);

    // Send a welcome message
    socket.write(`Welcome to the time server! Your address: ${clientInfo}\r\n`);

    // Set up an interval to send the current time every second
    const intervalId = setInterval(() => {
        const now = new Date().toISOString();
        socket.write(`Current time: ${now} (client: ${clientInfo})\r\n`);
    }, 1000);

    // Handle incoming data from client
    socket.on('data', (data) => {
        const message = data.toString().trim();
        console.log(`Message from client ${clientInfo}: ${message}`);

        // Optionally send an acknowledgment back
        socket.write(`Received from ${clientInfo}: "${message}"\r\n`);
    });

    // Handle client disconnection
    socket.on('close', () => {
        console.log(`Client disconnected: ${clientInfo}`);
        clearInterval(intervalId);
    });

    // Handle potential errors
    socket.on('error', (err) => {
        console.error(`Socket error for ${clientInfo}:`, err);
        clearInterval(intervalId);
    });
});

// Start listening on the specified port
server.listen(PORT, () => {
    console.log(`TCP server listening on port ${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server error:', err);
});
