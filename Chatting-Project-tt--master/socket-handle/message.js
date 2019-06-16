const messageController = require('../controllers/messages');

exports.initEvent = (socket) => {
    socket.on('messages', async function(data, callback) {
        try {
            if (!data) { 
                return callback(new Error('INVALID_DATA'));
            }
            switch (data.action) {
                case 'SEND': {
                    return await createMessage(socket, data, callback);
                }
                // case 'SEND': {

                // }
                case 'GET': {
                    return await getListMessageOfGroup(socket, data, callback);
                }
                case "SEEN": {
                    socket.broadcast.emit('messages', {action: 'SEEN'});
                    return callback(null, data);
                }
                case 'SEND_TYPING': {
                    socket.broadcast.emit('messages', {action: 'RECEIVE_TYPING'});
                    return callback(null, data);
                }
                case 'SEND_DONE_TYPING': {
                    socket.broadcast.emit('messages', {action: 'RECEIVE_DONE_TYPING'});
                    return callback(null, data);
                }
            }          
        } catch (error) {
            return callback(error, null);
        }
    });
};

const createMessage = async (socket, data, callback) => {
    // hard code room
    const group = '5d009e83351b7e14582b9b99';
    const responseData = await messageController.sendMessage({
        body: {
            // room: data.room,
            group,
            content: data.message
        },
        user: socket.user
    });
    socket.broadcast.emit('messages', {
        action: 'RECEIVE',
        message: responseData.data
    });
    return callback(null, responseData.data);
}
const getListMessageOfGroup = async (socket, data, callback) => {
    const group = '5d009e83351b7e14582b9b99';
    const responseData = await messageController.getListMessageOfGroup({
        body: {
            group
        },
        user: socket.user
    });
    socket.emit('messages', {action: 'GETMS', messages: responseData.data, user: socket.user });
    return callback(null, responseData.data);
}