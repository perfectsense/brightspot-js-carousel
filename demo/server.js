var path = require('path');
var express = require('express');
var server = express();
server.use('/assets', express.static( path.resolve(__dirname, '../') ));
server.use(express.static( path.resolve(__dirname, '../demo') ));
server.listen(3000);
console.log('Listening on http://localhost:3000...');