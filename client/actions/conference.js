import { SHOW_SIDEBAR, SELECT_SIDEBAR_COMPONENT, CONFERENCE_STARTED, NEW_CONFERENCE_NAME, SHOW_INVITE, INVITE_NAME, INVITE_EMAIL, NEW_CONFERENCE_EMAIL } from './actionTypes';

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

export function newConferenceEmail(email) {
    return {
        type: NEW_CONFERENCE_EMAIL,
        email
    }
}

export function showInvite() {
    return {
        type: SHOW_INVITE
    }
}

export function inviteEmail(email) {
    return {
        type: INVITE_EMAIL,
        email
    }
}

export function inviteName(name) {
    return {
        type: INVITE_NAME,
        name
    }
}
