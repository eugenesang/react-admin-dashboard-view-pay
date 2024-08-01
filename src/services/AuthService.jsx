import swal from "sweetalert";
import {
    loginConfirmedAction,
    logout,
} from '../store/actions/AuthActions';
import { MEMBER } from "./Request/RequestService";
import { ccmaInstance } from "./CcmaInstance";

export function signUp(username, password, email, fullName, role = MEMBER) {
    //axios call
    const postData = {
        "email": email,
        "password": password,
        "role": role,
        "fullName": fullName,
        "userName": username
    };
    return ccmaInstance.post(
        'requester/register',
        postData,
    );
}

export function login(username, password) {
    return ccmaInstance.get(
        'login/',
        {
            auth: {
                username,
                password,
            }
        });
}

export function formatError(errorResponse) {
    switch (errorResponse) {
        case 'EMAIL_EXISTS':
            swal("Oops", "Email already exists", "error");
            break;
        case 'EMAIL_NOT_FOUND':
            swal("Oops", "Email not found", "error", { button: "Try Again!", });
            break;
        case 'INVALID_PASSWORD':
            swal("Oops", "Invalid Password", "error", { button: "Try Again!", });
            break;
        case 'USER_DISABLED':
            return 'User Disabled';
        default:
            return 'Invalid Credentials';
    }
}

export function saveTokenInLocalStorage(tokenDetails) {
    tokenDetails.expireDate = new Date(
        new Date().getTime() + (30 * 60 * 1000),
    );

    localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
}

export function runLogoutTimer(dispatch, timer, history) {
    setTimeout(() => {
        dispatch(logout(history));
    }, timer);
}

export function checkAutoLogin(dispatch, history) {
    // Bypass login
    const tokenDetails = {
        token: "fake-token",
        expireDate: new Date(
            new Date().getTime() + (30 * 60 * 1000)
        ),
        role: MEMBER,
        id: 1,
        userName: "bypassUser"
    };

    localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
    dispatch(loginConfirmedAction(tokenDetails));

    const timer = tokenDetails.expireDate.getTime() - new Date().getTime();
    runLogoutTimer(dispatch, timer, history);
}

export function saveRole(role) {
    localStorage.setItem('userRole', JSON.stringify(role));
}

export function getRole() {
    return JSON.parse(localStorage.getItem('userDetails')).role;
}

export function getId() {
    return JSON.parse(localStorage.getItem('userDetails')).id;
}

export function getName() {
    return JSON.parse(localStorage.getItem('userDetails')).userName;
}