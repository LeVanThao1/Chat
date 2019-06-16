const message = require('../socket-handle/message.js');
const { verify } = require ('../helpers/jwt-helper');

exports.initConnection = function(io) {
    console.log('having 123');
    io.use(function(socket, next) {
        try {
            const token = socket.handshake.query.token;
            console.log(token);
            if (!token) {
                return next(new Error('AUTHENTICATION_FAILED'));
            }
            const verifiedData = verify(token);
            if (!verifiedData) {
                return next(new Error('JWT_INVALID_FORMAT'));
            } 
            socket.user = verifiedData;
            return next();
        } catch(e) {
            return next(e);
        }
    })
    io.on('connection', function(socket) {
        console.log('A user is connected.');
        message.initEvent(socket);
        socket.on('disconnect', function() {
            console.log('A user is disconnect.');
        })
    });
    
}