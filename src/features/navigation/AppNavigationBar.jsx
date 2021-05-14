import React from "react";
import { Button, Container, Icon, Menu } from "semantic-ui-react";
import { NavLink} from 'react-router-dom';
import LoggedOutNavMenu from "./LoggedOutNavMenu";
import LoggedInNavMenu from "./LoggedInNavMenu";
import { useSelector } from "react-redux";

const AppNavigationBar = () => {

    const {authenticated} = useSelector(state => state.auth);

    return(
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item as={NavLink} exact to="/" header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: 15}}/>
                    StudentHelpo
                </Menu.Item>
                <Menu.Item as={NavLink} to="/feeds">
                    <span>
                        <Icon size="big" name="home"/>
                    </span>
                </Menu.Item>
                <Menu.Item as={NavLink} to="/groups">
                    <span>
                        <Icon size="big" name="group"/>
                    </span>
                </Menu.Item>
                <Menu.Item as={NavLink} to="/notes">
                    <span>
                        <Icon size="big" name="pencil"/>
                    </span>
                </Menu.Item>
                {authenticated &&
                <Menu.Item as={NavLink} to="/createGroup">
                    <Button inverted content="Create Group"/>
                </Menu.Item>}
                {authenticated ? <LoggedInNavMenu /> : <LoggedOutNavMenu />}
            </Container>
        </Menu>
    )
}

export default  AppNavigationBar;