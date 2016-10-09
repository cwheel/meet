import Immutable from 'immutable';
import { META_CONNECT, META_SPEECH_EVENT, META_INVITE, META_TRANSCRIBE, LEAVE_CONFERENCE } from '../actions/actionTypes';

export default (state = Immutable.Map({ socket: null }), action) => {
    switch(action.type) {
        case META_CONNECT:
            return state.set('socket', action.socket);
        case META_SPEECH_EVENT:
            if (state.get('socket')) {
                state.get('socket').emit('speechEvent', action.event);
            }

            return state.set('isSpeaking', action.event.isSpeaking);
        case META_INVITE:
            if (state.get('socket')) {
                state.get('socket').emit('invite', {email: action.email, name: action.name, inviter: action.inviter, room: action.room});
            }

            return state;
        case META_TRANSCRIBE:
            if (state.get('socket')) {
                state.get('socket').emit('transcribeEvent', action.event);
            }

            return state;
        case LEAVE_CONFERENCE:
            if (state.get('socket')) {
                state.get('socket').emit('leaveConference', {nick: action.nick, email: action.email, room: action.room});
            }

            return state;
        default:
            return state;
    }
};
