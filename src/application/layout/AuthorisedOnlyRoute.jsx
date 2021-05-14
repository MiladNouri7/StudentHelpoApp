import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import UnauthorisedModal from '../../features/authentication/UnauthorisedModal';


const AuthorisedOnlyRoute = (prop) => {
  const {component: Component,prevLocation,...rest} = prop;
  const [modalOpen, setModalOpen] = useState(false);
  const { authenticated } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? <Component {...props} /> : <UnauthorisedModal {...props} setModalOpen={setModalOpen} />
      }
    />
  );
}

export default AuthorisedOnlyRoute;