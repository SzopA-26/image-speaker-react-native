import { createStore, combineReducers, applyMiddleware } from 'redux';
import { documentReducer } from './reducer';

export const store = createStore(
    documentReducer
)
