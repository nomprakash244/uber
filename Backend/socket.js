const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // 🟢 User or Captain joins
        socket.on('join', async (data) => {
            try {
                const { userId, userType } = data;

                if (!userId || !userType) {
                    return socket.emit('error', { message: 'Missing userId or userType' });
                }

                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                } else {
                    return socket.emit('error', { message: 'Invalid userType' });
                }

                console.log(`${userType} (${userId}) joined with socket ${socket.id}`);
            } catch (error) {
                console.error('Join event error:', error.message);
                socket.emit('error', { message: 'Failed to join socket' });
            }
        });

        // 🟡 Update captain location
        socket.on('update-location-captain', async (data) => {
            try {
                const { userId, location } = data;

                if (!userId || !location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
                    return socket.emit('error', { message: 'Invalid location data' });
                }

                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        lat: location.lat,
                        lng: location.lng,
                    },
                });

                // Optionally broadcast captain's new location to nearby users
                // io.emit('captain-location-updated', { userId, location });
            } catch (error) {
                console.error('Error updating location:', error.message);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        // 🔴 Handle disconnect
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

// 🟢 Utility: send event to a specific socket
const sendMessageToSocketId = (socketId, messageObject) => {
    console.log('Emitting message:', messageObject);

    if (!io) {
        return console.log('❌ Socket.io not initialized.');
    }

    if (!socketId || !messageObject?.event) {
        return console.log('❌ Invalid message parameters.');
    }

    io.to(socketId).emit(messageObject.event, messageObject.data);
};

module.exports = { initializeSocket, sendMessageToSocketId };
