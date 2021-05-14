import React from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from 'semantic-ui-react';
import { closeTheModal } from './modalReducer';

const ModalWrapper = (props) => {
    const {children, size, header} = props;
    const dispatch = useDispatch();

    return(
        <Modal open={true} onClose={() => dispatch(closeTheModal())} size={size}>
            {header && <Modal.Header>{header}</Modal.Header>}
            <Modal.Content>
                {children}
            </Modal.Content>
        </Modal>
    )
}

export default ModalWrapper;