import * as actions from './actions';

const initial_state = {
    docs: [
        {
            id: 0,
            name: 'example',
            duration: '00:59:59',
            currentTime: '00:50:12',
            uri: '',
        },
        {
            id: 1,
            name: 'example1',
            duration: '00:59:59',
            currentTime: '00:50:12',
            uri: '',
        },
        {
            id: 2,
            name: 'example2',
            duration: '00:59:59',
            currentTime: '00:50:12',
            uri: '',
        },
    ],
    currentDoc: 0
};

export const documentReducer = (state = initial_state, action) => {
    switch(action.type) {
        case actions.GET_DOCS: 
            return {
                ...state,
                docs: state.docs
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
                currentDoc: state.currentDoc + 1 >= state.docs.length ? 0 :  state.currentDoc + 1
            };
        case actions.PREVIOUS_DOC:
            return {
                ...state,
                currentDoc: state.currentDoc - 1 < 0 ? state.docs.length - 1  : state.currentDoc - 1
            };
        default:
            return state;
    }
}
