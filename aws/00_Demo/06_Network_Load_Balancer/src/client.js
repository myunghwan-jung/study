const net = require('net');

// Default connection parameters
const DEFAULT_HOST = 'demo-nlb-44705087e229f439.elb.ap-northeast-2.amazonaws.com'
const PORT = 3000;

console.log('TCP Client started...');
// Get host from command line arguments or use default
const host = process.argv[2] || DEFAULT_HOST;

// Create a new TCP client
const client = new net.Socket();
https://git-codecommit.ap-northeast-2.amazonaws.com/v1/repos/demo-tcp-server
// Connect to the server
client.connect(PORT, host, () => {
    console.log(`Connected to server at ${host}:${PORT}`);
});

// Handle incoming data
client.on('data', (data) => {
    console.log(data.toString().trim());
});

// Handle connection close
client.on('close', () => {
    console.log('Connection closed');
});

// Handle errors
client.on('error', (err) => {
    console.error('Connection error:', err.message);
    process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\nDisconnecting from server...');
    client.destroy();
    process.exit(0);
});

// Keep the process alive until explicitly closed
process.stdin.resume();

console.log('Press Ctrl+C to disconnect');
