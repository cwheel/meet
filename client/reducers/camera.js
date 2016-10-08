import Immutable from 'immutable';
import { MIC_CAPTURE, VID_CAPTURE } from '../actions/actionTypes';

export default (state = Immutable.Map({microphone: true, video: true}), action) => {
    switch(action.type) {
        case MIC_CAPTURE:
            window.swrtcCall.mute();
            return state.set('microphone', action.isCapturing);
        case VID_CAPTURE:
            if (state.get('video')) {
                window.swrtcCall.pauseVideo();
            } else {
                window.swrtcCall.resumeVideo();
            }

            return state.set('video', action.isCapturing);
        default:
            return state;
    }
};
