import Immutable from 'immutable';
import { ActionBar } from '../actions/actionTypes';

export default (state = Immutable.Map({}), action) => {
    switch(action.type) {
        default:
            return state;
    }
};
