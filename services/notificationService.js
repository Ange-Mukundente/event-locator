const sendNotification = (io, message) => {
    io.emit("notification", { message });
  };
  
  module.exports = { sendNotification };
  