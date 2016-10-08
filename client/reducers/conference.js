import Immutable from 'immutable';
import { SHOW_SIDEBAR, SELECT_SIDEBAR_COMPONENT, CONFERENCE_STARTED } from '../actions/actionTypes';

export default (state = Immutable.Map({ sidebarVisible: false , sidebarComponent: 'participants', conferenceStarted: false}), action) => {
    switch(action.type) {
        case SHOW_SIDEBAR:
            return state.set('sidebarVisible', action.visible);
        case SELECT_SIDEBAR_COMPONENT:
            return state.set('sidebarComponent', action.component);
        case CONFERENCE_STARTED:
            console.log('started');
            return state.set('conferenceStarted', true);
        default:
            return state;
    }
};
