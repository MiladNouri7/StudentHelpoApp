import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Menu, Image, Dropdown } from "semantic-ui-react";
import { LogoutFromFb } from '../../application/firebase/firebaseService';

const LoggedInNavMenu = () => {
    const history = useHistory();
    const {currentActiveUserProfile} = useSelector(state => state.profile);

    const handleLogOut = async () => {
        try {
            history.push("/");
            await LogoutFromFb();
        } catch(error){
            toast.error(error.message);
        }
    }

    return(
        <Menu.Item position='right'>
        <Image avatar spaced='right' src={currentActiveUserProfile?.photoURL || '/assets/user.png'} />
        <Dropdown pointing='top left' text={currentActiveUserProfile?.displayName}>
          <Dropdown.Menu>
            <Dropdown.Item
              as={Link}
              to='/createGroup'
              text='Create Group'
              icon='plus'
            />
            <Dropdown.Item as={Link} to={`/profile/${currentActiveUserProfile?.id}`} text='My Profile' icon='user' />
            <Dropdown.Item as={Link} to='/account' text='My Account' icon='settings' />
            <Dropdown.Item
              onClick={handleLogOut}
              text='Sign out'
              icon='power'
            />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
    )
}

export default LoggedInNavMenu;