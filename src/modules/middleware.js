import {
    API_START,
    API_END,
    APP_LOGIN,
    APP_LOGIN_SSO,
    APP_LOGOUT,
    APP_LOAD
} from './constants/actions';

function isPromise(entry) {
    return entry && typeof entry.then === 'function';
}

const promiseMiddleware = store => next => action => {
    if (isPromise(action.payload)) {
        store.dispatch({ type: API_START });

        action.payload.then(
            res => {
                action.status = res.status;
                action.payload = res;
                store.dispatch({ type: API_END, payload: action.payload });
                store.dispatch(action);
            },
            error => {
                action.status = 'error';
                action.payload = 
                    error.response && error.response.data 
                    ? error.response.data
                    : error.toString();
                store.dispatch({ type: API_END, payload: action.payload });

                if (
                    action.type === APP_LOAD &&
                    action.payload &&
                    action.payload.data &&
                    action.payload.data.message &&
                    (['Unauthorized User', 'jwt expired'].indexOf(
                        action.payload.data.message
                    ) > -1 ||
                        action.payload === '"Error: Nework Error"')
                ) {
                    store.dispatch({ type: APP_LOGOUT });
                } else {
                    store.dispatch(action);
                }
            }
        );

        return;
    }

    next(action);
};

const bindRequestMiddleware = store => next => action => {
    if (action.type === APP_LOGIN || action.type === APP_LOGIN_SSO) {
        if (action.payload.status === 'success') {
            api.setToken(action.payload.data.token);
        }
    } else if (action.type === APP_LOGOUT) {
        api.setToken(null);
    }

    next(action);
}

export { promiseMiddleware, bindRequestMiddleware };