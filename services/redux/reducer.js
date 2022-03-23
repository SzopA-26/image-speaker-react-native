import * as actions from './actions';

const initial_state = {
    docs: [],
    currentDoc: 0,
    switchDoc: 0,
};

export const documentReducer = (state = initial_state, action) => {
    switch(action.type) {
        case actions.GET_DOCS: 
            return {
                ...state,
                docs: state.docs
            }
        case actions.SET_DOCS: 
            return {
                ...state,
                docs: action.playload
            }
        case actions.GET_CURRENT_DOC:
            return {
                ...state,
                currentDoc: state.currentDoc
            };
        case actions.SET_CURRENT_DOC:
            return {
                ...state,
                currentDoc: action.playload
            };
        case actions.NEXT_DOC:
            return {
                ...state,
                currentDoc: state.currentDoc === state.docs.length-1 ? 0 : state.currentDoc+1
            };
        case actions.PREVIOUS_DOC:
            return {
                ...state,
                currentDoc: state.currentDoc === 0 ? state.docs.length-1 : state.currentDoc-1
            };
        case actions.SWITCH_DOC:
            return {
                ...state,
                switchDoc: state.switchDoc + 1
            }
        default:
            return state;
    }
}
