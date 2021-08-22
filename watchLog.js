
const fs = require('fs');


class LogsServices {

    static watchLog(fileName, connections) {
        
        /**The server should push updates to the clients as we have to be as real time as possible. */
        fs.watchFile(fileName, (curr, prev) => {
    
            fs.open(fileName, 'r', (err, fd) => {
    
                if (err) {
                    console.error(err);
                } else if (curr.size - prev.size > 0) {
    
                    fs.read(fd, new Buffer(10000), 0, curr.size - prev.size, prev.size, (err, datalen, buffer) => {
    
                        if (err) {
                            console.error(err);
                        } else {
                            connections.forEach(conn => {
                                conn.sendUTF(buffer.toString());
                            });
                        }
                    });
                }
    
            })
    
        })
    
    }
    
    
    static getLastFewLines(byteSize, fileName) {
        return new Promise(function (resolve, reject) {
    
            fs.open(fileName, 'r', (err, fd) => {
        
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
        
                    fs.stat(fileName, (err, stat) => {
        
                        let size = stat.size;
                        let bytesToRead = stat.size > byteSize? byteSize: stat.size;
                        let start = size - bytesToRead;
        
                        fs.read(fd, new Buffer(10000), 0, bytesToRead, start, (err, datalen, buffer) => {
            
                            if (err) {
                                console.error(err);
                                reject(err);
                            } else {
                                let msgToSend = buffer.toString();
                                resolve(msgToSend);
                            }
            
                        });
                    })
                }
            })
        })
    }

}

module.exports = LogsServices;