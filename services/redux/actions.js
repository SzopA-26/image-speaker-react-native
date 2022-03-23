export const GET_DOCS = 'GET_DOCS';
export const SET_DOCS = 'SET_DOCS';
export const GET_CURRENT_DOC = 'GET_CURRENT_DOC';
export const SET_CURRENT_DOC = 'SET_CURRENT_DOC';
export const NEXT_DOC = 'NEXT_DOC';
export const PREVIOUS_DOC = 'PREVIOUS_DOC';
export const ADD_DOC = 'ADD_DOC';
export const SWITCH_DOC = 'SWITCH_DOC';

export const setDocs = (docs) => {
    return {
        type: SET_DOCS,
        playload: docs,
    }
}

export const setCurrentDoc = (doc) => {
    return {
        type: SET_CURRENT_DOC,
        playload: doc,
    }
}

export const nextDoc = () => {
    return {
        type: NEXT_DOC,
    }
}

export const previousDoc = () => {
    return {
        type: PREVIOUS_DOC,
    }
}

export const switchDoc = () => {
    return {
        type: SWITCH_DOC,
    }
}