//
const requestCookie = 'locale=""; blahblahblah';
const request_csrf = 'string';
const request_z = 'string';

const configObj = {
    requestCookie,
    request_csrf,
    request_z,
}

exports.getRequestKeys = () => configObj;