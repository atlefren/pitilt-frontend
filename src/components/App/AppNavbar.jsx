import React from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import {Link} from 'react-router-dom';

var LoginStatus = function (props) {
    return (
        <NavDropdown
            id="profile-dropdown"
            title={ props.user.displayName }>
            <li><Link to="/profile">Profile</Link></li>
            <MenuItem divider />
            <li><Link to="/logout">Log Out</Link></li>
        </NavDropdown>
    );
};

var AppNavbar = function (props) {

    if (!props.authed) {
        return null;
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
                <ul className='nav navbar-nav'>
                    <li>
                        <Link to='/plots'> Plots
                        </Link>
                    </li>
                </ul>
                <Nav pullRight>
                    <LoginStatus {...props} />
                </Nav>;
            </Navbar.Collapse>
        </Navbar>
    );
};

export default AppNavbar;
