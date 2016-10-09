import { META_CONNECT, META_SPEECH_EVENT, META_INVITE, META_TRANSCRIBE } from './actionTypes';

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

export function invite(email, name, inviter, room) {
    return {
        type: META_INVITE,
        email,
        name,
        inviter,
        room
    }
}

export function transcribeEvent(text, nick) {
    return {
        type: META_TRANSCRIBE,
        event: {
            nick,
            text,
            time: Date.now(),
            room: window.swrtcCall.roomName,
        }
    }
}
