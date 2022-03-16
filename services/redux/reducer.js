import * as actions from './actions';

const initial_state = {
    docs: [
        {
            id: 1,
            name: 'example',
            duration: 0,
            currentTime: 0,
            img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png',
            content: 'content',
        },
        {
            id: 2,
            name: 'example1',
            duration: 0,
            currentTime: 0,
            img: '',
            content: 'content',
        },
    ],
    currentDoc: 1
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
                currentDoc: state.currentDoc + 1 > state.docs.length ? 1 : state.currentDoc + 1
            };
        case actions.PREVIOUS_DOC:
            return {
                ...state,
                currentDoc: state.currentDoc - 1 < 1 ? state.docs.length : state.currentDoc - 1
            };
        default:
            return state;
    }
}
