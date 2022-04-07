import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Sidenav, Nav } from 'rsuite';

//customize
import DashboardIcon from '@rsuite/icons/Dashboard';
import AdminIcon from '@rsuite/icons/Admin';
import BarChartIcon from '@rsuite/icons/BarChart';
import SplitIcon from '@rsuite/icons/Split';
import CreditCardPlusIcon from '@rsuite/icons/CreditCardPlus';
import ToolsIcon from '@rsuite/icons/Tools';

const AdminLeftTop = ({ match, history }) => {
  return (
    <>
      <Sidenav appearance="subtle" defaultOpenKeys={['3', '4']}>
        <Sidenav.Body>
          <Nav>
            <Nav.Item as={NavLink} to="/" eventKey="1" icon={<DashboardIcon />}>
              Dashboard
            </Nav.Item>
            <Nav.Item as={NavLink} to="/users" eventKey="2" icon={<AdminIcon />}>
              Users
            </Nav.Item>
            <Nav.Item as={NavLink} to="/analytics" eventKey="3" icon={<BarChartIcon />}>
              Analytics
            </Nav.Item>
            <Nav.Item as={NavLink} to="/bookings" eventKey="4" icon={<CreditCardPlusIcon />}>
              Bookings
            </Nav.Item>
            <Dropdown placement="rightStart" eventKey="5" title="Products" icon={<SplitIcon />}>
              <Dropdown.Item as={NavLink} to="/types" eventKey="5-1">
                Types
              </Dropdown.Item>
              <Dropdown.Item as={NavLink} to="/categories" eventKey="5-2">
                Categories
              </Dropdown.Item>
              <Dropdown.Item as={NavLink} to="/cars" eventKey="5-3">
                Cars
              </Dropdown.Item>
            </Dropdown>
            <Dropdown placement="rightStart" eventKey="6" title="Settings" icon={<ToolsIcon />}>
              <Dropdown.Item as={Link} to="/" eventKey="6-1">
                User Profile
              </Dropdown.Item>
              <Dropdown.Item eventKey="6-2">Home Page</Dropdown.Item>
              <Dropdown.Item eventKey="6-3">Versions</Dropdown.Item>
            </Dropdown>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    </>
  );
};

export default withRouter(AdminLeftTop);
