import { SHOW_SIDEBAR } from './actionTypes';

export function showSidebar(visible) {
    return {
        type: SHOW_SIDEBAR,
        visible
    }
}
