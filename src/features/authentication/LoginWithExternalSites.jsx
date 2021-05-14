import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { closeTheModal } from '../../application/utilities/modals/modalReducer';
import { loginWithExternalSites } from '../../application/firebase/firebaseService';

const LoginWithExternalSites = () => {
    const dispatch = useDispatch();

    const handleSocialLogin = (provider) => {
        dispatch(closeTheModal());
        loginWithExternalSites(provider);
    }

    return (
        <>
            <Button onClick={() => handleSocialLogin("facebook")} icon="facebook" fluid color="facebook" style={{marginBottom: 10}} content="Login with Facebook"/>
            <Button onClick={() => handleSocialLogin("google")}icon="google" fluid color="google plus" content="Login with Google"/>
        </>
    )
}

export default LoginWithExternalSites;