import {
    formatError,
    login,
    runLogoutTimer,
    saveTokenInLocalStorage,
    signUp,
} from '../../services/AuthService';
import {utf8_to_b64} from "../../services/CcmaInstance";


export const SIGNUP_CONFIRMED_ACTION = '[signup action] confirmed signup';
export const SIGNUP_FAILED_ACTION = '[signup action] failed signup';
export const LOGIN_CONFIRMED_ACTION = '[login action] confirmed login';
export const LOGIN_FAILED_ACTION = '[login action] failed login';
export const LOADING_TOGGLE_ACTION = '[Loading action] toggle loading';
export const LOGOUT_ACTION = '[Logout action] logout action';

export function signupAction(username, password,email,fullName, history) {
    return (dispatch) => {
        localStorage.removeItem('userDetails');
        signUp(username, password,email,fullName)
        .then((response) => {
            saveLoginUser(response, username, password, dispatch, history,confirmedSignupAction);
        })
        .catch((error) => {
            console.log(error);
            const errorMessage = formatError(error.message);
            dispatch(signupFailedAction(errorMessage));
        });
    };
}

export function logout(history) {
    localStorage.removeItem('userDetails');
    history.push('/login');
    return {
        type: LOGOUT_ACTION,
    };
}

function saveLoginUser(response, username, password, dispatch, history,nextAction) {
    let userDetails = response.data;
    let tokenJson = {
        "username": username,
        "password": password
    }
    userDetails = {
        ...userDetails, token: utf8_to_b64(JSON.stringify(tokenJson))
    }
    saveTokenInLocalStorage(userDetails);
    runLogoutTimer(
        dispatch,
        30 * 60 * 1000,
        history,
    );
    dispatch(nextAction(userDetails));
    history.push('/requests-list');
}

export function loginAction(username, password, history) {
    return (dispatch) => {
        login(username, password)
            .then((response) => {
                saveLoginUser(response, username, password, dispatch, history,loginConfirmedAction);
            })
            .catch((error) => {
				console.log(error);
                const errorMessage = formatError(error);
                dispatch(loginFailedAction(errorMessage));
            });
    };
}

export function loginFailedAction(data) {
    return {
        type: LOGIN_FAILED_ACTION,
        payload: data,
    };
}

export function loginConfirmedAction(data) {
    return {
        type: LOGIN_CONFIRMED_ACTION,
        payload: data,
    };
}

export function confirmedSignupAction(payload) {
    return {
        type: SIGNUP_CONFIRMED_ACTION,
        payload,
    };
}

export function signupFailedAction(message) {
    return {
        type: SIGNUP_FAILED_ACTION,
        payload: message,
    };
}

export function loadingToggleAction(status) {
    return {
        type: LOADING_TOGGLE_ACTION,
        payload: status,
    };
}
