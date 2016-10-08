import { MIC_CAPTURE, VID_CAPTURE } from './actionTypes';

export function vidCapture(isCapturing) {
    return {
        type: VID_CAPTURE,
        isCapturing
    }
}

export function micCapture(isCapturing) {
    return {
        type: MIC_CAPTURE,
        isCapturing
    }
}
