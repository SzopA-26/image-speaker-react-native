import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { documentReducer } from './reducer';

// const rootReducer = combineReducers({
//     documentReducer,
// });

// export const store = createStore(rootReducer, applyMiddleware(thunk));

export const store = createStore(
    documentReducer
)
