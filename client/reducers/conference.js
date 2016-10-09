import Immutable from 'immutable';
import { SHOW_SIDEBAR, SELECT_SIDEBAR_COMPONENT, CONFERENCE_STARTED, NEW_CONFERENCE_NAME, SHOW_INVITE, INVITE_EMAIL, INVITE_NAME, NEW_CONFERENCE_EMAIL } from '../actions/actionTypes';

export default (state = Immutable.Map({ sidebarVisible: false , sidebarComponent: 'participants', conferenceStarted: false, newConferenceName: '', showInvite: false,
                                        inviteEmail: '', inviteName: '', newConferenceEmail: '' }), action) => {
    switch(action.type) {
        case SHOW_SIDEBAR:
            return state.set('sidebarVisible', action.visible);
        case SELECT_SIDEBAR_COMPONENT:
            return state.set('sidebarComponent', action.component);
        case CONFERENCE_STARTED:
            return state.set('conferenceStarted', true);
        case NEW_CONFERENCE_NAME:
            return state.set('newConferenceName', action.name);
        case SHOW_INVITE:
            return state.set('showInvite', !state.get('showInvite'));
        case INVITE_NAME:
            return state.set('inviteName', action.name);
        case INVITE_EMAIL:
            return state.set('inviteEmail', action.email);
        case NEW_CONFERENCE_EMAIL:
            return state.set('newConferenceEmail', action.email);
        default:
            return state;
    }
};
