import React from 'react';
import { useSelector } from 'react-redux';
import SigninFormComponent from '../../../features/authentication/SigninFormComponent';
import SignupFormComponent from '../../../features/authentication/SignupFormComponent';

const ModalHandler = () => {
    const modalSelector = {
        SigninFormComponent,
        SignupFormComponent
    };
    const currentlyActiveModal = useSelector(state => state.modals);

    let activatedModal;
    if(currentlyActiveModal){
        const {modalType, modalProps} = currentlyActiveModal;
        const ModalComponent = modalSelector[modalType];
        activatedModal = <ModalComponent {...modalProps} />
    }

    return <span>{activatedModal}</span>
}

export default ModalHandler;