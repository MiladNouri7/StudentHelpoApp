import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Menu } from "semantic-ui-react";
import { openTheModal } from '../../application/utilities/modals/modalReducer';

const LoggedOutNavMenu = () => {
    const dispatch = useDispatch();
    return(
        <Menu.Item position="right">
            <Button onClick={() => dispatch(openTheModal({modalType: "SigninFormComponent"}))} basic inverted content="Login"/>
            <Button onClick={() => dispatch(openTheModal({modalType: "SignupFormComponent"}))} basic inverted content="Register" style={{marginLeft: '0.5em'}}/>
        </Menu.Item>
    )
}

export default LoggedOutNavMenu;