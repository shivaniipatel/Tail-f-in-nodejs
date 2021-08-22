
const fs = require('fs');


function watchLog(fileName, connections) {
    
    /**The server should push updates to the clients as we have to be as real time as possible. */
    // return new Promise(function (resolve, reject) {
    fs.watchFile(fileName, (curr, prev) => {

        fs.open(fileName, 'r', (err, fd) => {

            if (err) {
                console.error(err);
                // reject(err);
            } else if (curr.size - prev.size > 0) {

                fs.read(fd, new Buffer(10000), 0, curr.size - prev.size, prev.size, (err, datalen, data) => {

                    if (err) {
                        console.error(err);
                        // reject(err);
                    } else {
                        // resolve(data.toString());
                            connections.forEach(conn => {
                                conn.sendUTF(data.toString());
                            });
                    }
                });
            }

        })

    })
    // });

}


function getLastFewLines(byteSize, fileName) {
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
    
                    fs.read(fd, new Buffer(10000), 0, bytesToRead, start, (err, datalen, data) => {
        
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            let msgToSend = data.toString();
                            resolve(msgToSend);
                        }
        
                    });
                })
            }
        })
    })
}

exports.watchLog = watchLog;
exports.getLastFewLines = getLastFewLines;