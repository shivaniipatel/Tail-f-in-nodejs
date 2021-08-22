**Tail -f like functionality in Node.js**

- Multiple clients can watch the logs
- A client can watch any existing file 
- Server pushes the changes to client in real time
- Server only pushes the appended updates to the clients and not the entire file 


---


**Client** 
- Used live-server extension in vs-code 
- To run client, just use go-live button on vs-code and open `localhost:<_port_>?fileName=<_logfilename_>` to watch the logs
- Replace port and an existing file name to watch


**Server** 
- Run server.js using command `node server.js`
