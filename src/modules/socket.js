import io from 'socket.io-client';
import config from './constants/config';

const socket = io.connect(config.socket.url, {
  path: config.socket.path,
  transports: ['websocket'],
  auth: {
    token: config.tokenName
  }
});

/* Emitting events */
const sendEvent = (name, options = {}) => {
  if (!options) {
    socket.emit(name);
  } else {
    socket.emit(name, options);
  }
};

// Receiving events
const listenEvent = (name, callback) => {
  socket.on(name, callback);
};

/* Unsubscribe events on unmount */
const removeEvent = name => {
  socket.off(name);
};

export { sendEvent, listenEvent, removeEvent };
