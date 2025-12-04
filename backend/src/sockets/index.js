const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    socket.on('project:join', (projectId) => {
      socket.join(projectId);
    });

    socket.on('disconnect', () => {
      // no-op logging placeholder
    });
  });
};

module.exports = registerSocketHandlers;
