import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Divider } from 'semantic-ui-react';
import { openTheModal } from '../../application/utilities/modals/modalReducer';

const UnauthorisedModal = (prop) => {
  const [open, setOpen] = useState(true);
  const { previousPoint } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    if (!prop.history) {
      setOpen(false);
      prop.setModalOpen(false);
      return;
    }
    if (prop.history && previousPoint) {
      prop.history.push(previousPoint.pathname);
    } else {
      prop.history.push('/feeds');
    }
    setOpen(false);
  }

  const handleOpenModal = (modalType) => {
    dispatch(openTheModal({modalType}));
    setOpen(false);
    prop.setModalOpen(false);
  }

  return (
    <Modal open={open} size='mini' onClose={handleCloseModal}>
      <Modal.Header content='Register or sign in to do that' />
      <Modal.Content>
        <p>Please either login or register to see this content</p>
        <Button.Group widths={4}>
          <Button
            fluid
            color='blue'
            content='Login'
            onClick={() => handleOpenModal('SigninFormComponent')}
          />
          <Button.Or />
          <Button
            fluid
            color='green'
            content='Register'
            onClick={() => handleOpenModal('SignupFormComponent')}
          />
        </Button.Group>
        <Divider />
        <div style={{ textAlign: 'center' }}>
          <p>cancel to continue as a guest</p>
          <Button onClick={handleCloseModal} content='Cancel' />
        </div>
      </Modal.Content>
    </Modal>
  );
}

export default UnauthorisedModal;