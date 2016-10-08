import Immutable from 'immutable';
import { SHOW_SIDEBAR } from '../actions/actionTypes';

export default (state = Immutable.Map({ sidebarVisible: false }), action) => {
    switch(action.type) {
        case SHOW_SIDEBAR:
            return state.set('sidebarVisible', action.visible);
        default:
            return state;
    }
};
