// == Import
import io from 'socket.io-client';
import { SOCKET_CONNECT, SOCKET_SEND_MESSAGE } from '../actions/socketActions';
import { actionAddMessage } from '../actions/chatActions';

let socket;

const socketMiddleware = (store) => (next) => async (action) => {
  // get the state to have the pseudo
  const state = store.getState();
  // get the next action to continue
  const result = next(action);
  switch (action.type) {
    case SOCKET_CONNECT:
      socket = io('http://localhost:3001');
      console.log(socket);
      // event when a message is sent
      socket.on('send_message', (message) => {
        console.log('received send_message', message);
        // send an action with the message object
        store.dispatch(actionAddMessage(message));
      });
      // we don't want to pass the SOCKET_CONNECT action to the reducers so return
      return null;
    case SOCKET_SEND_MESSAGE:
      console.log('sent send_message', action.payload);
      // send the message to the server with the pseudo
      socket.emit(
        'send_message',
        {
          text: action.payload,
          author: state.settings.pseudo,
        },
      );
      return null;
    default:
      // Send the action to the reducers
      return result;
  }
};

export default socketMiddleware;
