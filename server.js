
const WebSocketServer = require('websocket').server;
const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {});
const websocket = new WebSocketServer({httpServer: server});
const LogsServices = require('./watchLog');


global.connections = {};
websocket.on('request', async (request) => {
    
    const fileName = request.resourceURL.query.fileName;
    
    /**CHECK IF FILE EXISTS */
    let fileExists = await fs.existsSync(fileName);
    if (!fileExists) {
        request.reject();
        return;
    } 

    let connection = request.accept(null, request.origin);

    if (!connections.hasOwnProperty(fileName)) {
        connections[fileName] = [connection];
        /**Watch log file for updates and send when there is an addition */
        LogsServices.watchLog(fileName);
    } else {
        connections[fileName].push(connection);
    }

    /**SEND LAST FEW LINES */
    let lastFewLines = await LogsServices.getLastFewLines(1096, fileName);
    connection.sendUTF(lastFewLines);

    connection.on('message', (msg) => {
        console.log(msg.utf8Data);
    });

    connection.on('close', () => {
        Object.keys(connections).forEach(file => {
            connections[file] = connections[file].filter(curr => curr !== connection);
        });
        console.log('CLOSED');
    })
    
});


server.listen(3000, () => console.log('Express Server Listenning on Port 3000'));