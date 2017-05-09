import React from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {Link} from 'react-router-dom';

var LoginStatus = function (props) {
    if (!props.isLoggedIn) {
        return (
            <NavItem onClick={ props.logIn }>
                Logg inn
            </NavItem>
        );
    }
    return (
        <NavItem onClick={ props.logOut }>
            { props.user.displayName }
        </NavItem>
    );
};

var AppNavbar = function (props) {

    var menuItems = null;
    if (props.isLoggedIn) {
        menuItems = (
            <ul className='nav navbar-nav'>
                <li>
                    <Link to='/plots'> Plots
                    </Link>
                </li>
            </ul>
        );
    }

    return (
        <Navbar inverse={ true }>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link to='/'> PiTilt
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                { menuItems }
                <Nav pullRight>
                    <LoginStatus {...props} />
                </Nav>;
            </Navbar.Collapse>
        </Navbar>
    );
};

export default AppNavbar;
