import axios from "axios";
import ccmaCofig from "../ccmaConfig.json"
export const ccmaInstance = axios.create({
    baseURL: ccmaCofig.baseURL
});

export function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

export  function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}
ccmaInstance.interceptors.request.use(config => {
    if(ccmaCofig.LOG_LEVEL==="INFO"){
        console.log('Starting Request: URL ', config.url, 'method', config.method);
    } else if(ccmaCofig.LOG_LEVEL==="DEBUG"){
        console.log('Starting Request', JSON.stringify(config, null, 2))
    }
    let userDetails = localStorage.getItem('userDetails')
    if(userDetails){
        userDetails = JSON.parse(userDetails);
    }
    if(userDetails && userDetails.token){
        let encryptedToken = userDetails.token;
        let jsonToken = JSON.parse(b64_to_utf8(encryptedToken));
        config = {...config, auth:{
            username: jsonToken.username,
                password: jsonToken.password
            }}
    }

    return config
})

ccmaInstance.interceptors.response.use(response => {
    if(ccmaCofig.LOG_LEVEL==="INFO"){
        console.log('Response status:', response.status,' response for: URL ', response.config.url, 'method:', response.config.method);
    } else if(ccmaCofig.LOG_LEVEL==="DEBUG"){
        console.log('Response:', JSON.stringify(response, null, 2))
    }

    return response
})
