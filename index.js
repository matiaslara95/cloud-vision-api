
const http = require('http');
const app = require('./app');


//Makes de PORT dynamic
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }

    return false;
}

//process.env.PORT 
//makes the app dynamic so that it can run any port assigned to it in the future when hosted on a live server.
//The normalizePort function returns a valid port, whether it is provided as a number or a string.
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port);

//Error handler
//The errorHandler function checks for various errors and handles them appropriately — it is then registered to the server.
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

const server = http.createServer(app);

server.on('error', errorHandler);
//A listening event listener is also registered, logging the port or named pipe on which the server is running to the console.
server.on('listening', () => {
    const address = server.address;
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
})

server.listen(port);  