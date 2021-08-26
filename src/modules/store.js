import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { promiseMiddleware, bindRequestMiddleware } from './middleware';
import reducers from './reducers';

const config = {
    key: 'root',
    storage,
    whitelist: ['app']
};

const reducer = persistReducer(config, reducers);

const initialState = {};
const enhancers = [];
const middleware = [promiseMiddleware, bindRequestMiddleware];

if (process.env.NODE_ENV === 'development') {
    const { devToolsExtension } = window;

    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension());
    }
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const configureStore = () => {
    const store = createStore(reducer, initialState, composedEnhancers);
    const persistor = persistStore(store, null, () => {
        store.getState();
    });

    return { persistor, store };
};

export default configureStore;