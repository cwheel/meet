import { META_CONNECT, META_SPEECH_EVENT } from './actionTypes';

export function connect() {
    return dispatch => {
        let socket = io(window.location.origin);
        socket.emit('room', window.swrtcCall.roomName);

        dispatch(connectionComplete(socket));
    }
}

function connectionComplete(socket) {
    return {
        type: META_CONNECT,
        socket
    }
}

export function speechEvent(isSpeaking) {
    return {
        type: META_SPEECH_EVENT,
        event: {
            peerId: window.swrtcCall.connection.getSessionid(),
            speaking: isSpeaking,
            timestamp: Date.now(),
            room: window.swrtcCall.roomName
        }
    }
}
