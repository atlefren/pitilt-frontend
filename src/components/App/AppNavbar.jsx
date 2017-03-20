import React from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';


var LoginStatus = function (props) {
    if (!props.isLoggedIn) {
        return (
            <NavItem onClick={props.logIn}>Logg inn</NavItem>
        );
    }
    console.log(props.user);
    return (
        <NavItem onClick={props.logOut}>{props.user.displayName}</NavItem>
    );
};

var AppNavbar = function (props) {

    var menuItems = null;
    if (props.isLoggedIn) {
        menuItems = (
            <Nav>
                <NavItem eventKey={1} href='#'>Link</NavItem>
                <NavItem eventKey={2} href='#'>Link</NavItem>
                <NavItem eventKey={3} href='#'>Link2</NavItem>
            </Nav>
        );
    }

    return (
        <Navbar inverse={true}>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href='#'>PiTilt</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                {menuItems}
                <Nav pullRight>
                    <LoginStatus {...props} />
                </Nav>;
            </Navbar.Collapse>
        </Navbar>
    );
};

export default AppNavbar;
