import { SHOW_SIDEBAR, SELECT_SIDEBAR_COMPONENT, CONFERENCE_STARTED, NEW_CONFERENCE_NAME } from './actionTypes';

export function showSidebar(visible) {
    return {
        type: SHOW_SIDEBAR,
        visible
    }
}

export function selectSidebarComponent(component) {
    return {
        type: SELECT_SIDEBAR_COMPONENT,
        component
    }
}

export function conferenceStarted() {
    return {
        type: CONFERENCE_STARTED
    }
}

export function newConferenceName(name) {
    return {
        type: NEW_CONFERENCE_NAME,
        name
    }
}
