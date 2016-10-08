import Immutable from 'immutable';
import { SHOW_SIDEBAR, SELECT_SIDEBAR_COMPONENT, CONFERENCE_STARTED, NEW_CONFERENCE_NAME } from '../actions/actionTypes';

export default (state = Immutable.Map({ sidebarVisible: false , sidebarComponent: 'participants', conferenceStarted: false, newConferenceName: ''}), action) => {
    switch(action.type) {
        case SHOW_SIDEBAR:
            return state.set('sidebarVisible', action.visible);
        case SELECT_SIDEBAR_COMPONENT:
            return state.set('sidebarComponent', action.component);
        case CONFERENCE_STARTED:
            return state.set('conferenceStarted', true);
        case NEW_CONFERENCE_NAME:
            return state.set('newConferenceName', action.name);
        default:
            return state;
    }
};
