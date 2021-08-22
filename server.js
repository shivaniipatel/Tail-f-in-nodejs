
const WebSocketServer = require('websocket').server;
const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {});
const websocket = new WebSocketServer({httpServer: server});
const {watchLog, getLastFewLines} = require('./watchLog');
const fileName = 'logfile';


let connections = [];
websocket.on('request', async (request) => {
    
    let connection = request.accept(null, request.origin);
    connections.push(connection);
    
    /**SEND LAST FEW LINES */
    let lastFewLines = await getLastFewLines(1096, fileName);
    connection.sendUTF(lastFewLines);

    connection.on('message', (msg) => {
        console.log(msg.utf8Data);
        connections.forEach(conn => {
            conn.sendUTF(msg.utf8Data);
        }) 
    });

    connection.on('close', () => {
        connections = connections.filter(curr => curr !== connection);
        console.log('CLOSED');
    })
    
});

/**Watch log file for updates and send when there is an addition */
watchLog(fileName, connections);


server.listen(3000, () => console.log('Express Server Listenning on Port 3000'));