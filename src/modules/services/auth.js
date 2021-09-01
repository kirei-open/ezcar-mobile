const auth = request => ({
    info: () => request.get('/auth/info'),
    login: (identity, password) => {
        const options = {
            identity,
            password
        };

        console.log(process.env.REACT_NATIVE_MOBILE_API)

        if (process.env.REACT_NATIVE_MOBILE_API) {
            options.mobile = true;
        }

        return request.post('/auth/login', options);
    },
    changePassword: data => request.post('/auth/change-password', { ...data }),
    resetPassword: data => request.post('/auth/reset-password', { ...data }),
    registerMobile: expoToken => 
        requests.post('/auth/register-push', { expoToken }),
    loginSSO: (clientKey, email, ssoToken) => {
        const options = {
            clientKey,
            email,
            ssoToken
        };

        return request.post('/auth/loginSSO', options);
    }
});

export default auth;