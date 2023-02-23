// import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import './App.css';
import './App.scss';
import { Nav, Navbar, Container }  from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { SecureRoute, useAuthContext } from "@asgardeo/auth-react";
import { useHistory } from "react-router-dom"

import Catalog from './components/Catalog/Catalog.js';
import MyCart from './components/MyCart/Cart.js';
import Admin from './components/Admin/Admin.js';

// Component to render the login/signup/logout menu
const RightLoginSignupMenu = () => {
  // Based on Asgardeo SDK, set a variable like below to check and conditionally render the menu

  const { signIn, signOut, state, getBasicUserInfo } = useAuthContext();
  const [ userInfo, setUserInfo ] = useState(null);

  useEffect(() => {
    if (!state.isAuthenticated) {
      return;
    }
    getBasicUserInfo().then((response) => {
      setUserInfo(response);
    });
  }, [ state.isAuthenticated, getBasicUserInfo ]);

  // Host the menu content and return it at the end of the function
  let menu;

  // Conditionally render the following two links based on whether the user is logged in or not
if (state.isAuthenticated) {
    menu =  <>
      <Nav>
      <Nav.Link onClick={ () => signOut() }>Logout</Nav.Link>
      <Nav.Link href="#deets"><FontAwesomeIcon icon={ faUser } />{ userInfo?.username }</Nav.Link></Nav>
    </>
  } else {
    menu = <>
      <Nav>
        <Nav.Link onClick={ () => signIn() }>Login</Nav.Link>
        <Nav.Link href="#deets">Sign Up</Nav.Link>
      </Nav>
    </>
  }


  return menu;
}

// Component to render the navigation bar
const PetStoreNav = () => {
  const { state, getBasicUserInfo } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (!state.isAuthenticated) {
      return;
    }
    getBasicUserInfo().then((response) => {
      const groups = response.groups
      console.log("groups: ", groups);
      if (groups === undefined) {
        return;
      }
      const isAdmin = groups.includes("Admin");
      console.log("isAdmin: ", isAdmin);
      setIsAdmin(isAdmin);
    }).catch((error) => {
      console.error(error);
    });
  }, [state.isAuthenticated, getBasicUserInfo]);

  // Host the menu content and return it at the end of the function
  let menu;

  // Conditionally render the following nevigation links weather user is admin or not

  if (!state.isAuthenticated) {
    menu = <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">PetStore</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link to="/" className="nav-link">Catalog</Link>
            </Nav>
          </Navbar.Collapse>
          <RightLoginSignupMenu />
        </Container>
      </Navbar>
    </>
  } else {
    if (isAdmin) {
      menu = <>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="#home">PetStore</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Link to="/" className="nav-link">Catalog</Link>
                <Link to="/mycart" className="nav-link">My Cart</Link>
                <Link to="/admin" className="nav-link">Admin</Link>
              </Nav>
            </Navbar.Collapse>
            <RightLoginSignupMenu />
          </Container>
        </Navbar>
      </>
    } else {
      menu = <>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="#home">PetStore</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Link to="/" className="nav-link">Catalog</Link>
                <Link to="/mycart" className="nav-link">My Cart</Link>
              </Nav>
            </Navbar.Collapse>
            <RightLoginSignupMenu />
          </Container>
        </Navbar>
      </>
    }
  }
  return menu;
};

// Main app component
const App = () => {
  useEffect(() => {
    document.title = 'PetStore';
  }, []);
  return (
    <>
      <BrowserRouter>
      <PetStoreNav />
      <Switch>
        <Route exact path="/" component={Catalog} />
        <SecureRedirect path="/mycart" component={MyCart} />
        <SecureRedirect path="/admin" component={Admin} />
      </Switch>
    </BrowserRouter>
    </>
  );
}

const SecureRedirect = (props) => {
  const { component, path } = props;
  const { state, getBasicUserInfo } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const history = useHistory();

  const callback = () => {
    history.push("/");
  };

  useEffect(() => {
    if (!state.isAuthenticated) {
      return;
    }
    getBasicUserInfo().then((response) => {
      const groups = response.groups
      console.log("groups: ", groups);
      if (groups === undefined) {
        return;
      }
      const isAdmin = groups.includes("Admin");
      console.log("isAdmin: ", isAdmin);
      setIsAdmin(isAdmin);
    }).catch((error) => {
      console.error(error);
    });
  }, [state.isAuthenticated, getBasicUserInfo]);

  if (!state.isAuthenticated) {
    return (<SecureRoute path="/" component={Catalog} callback={callback} />);
  } else if ( path=="/admin" && !isAdmin) {
    return (<SecureRoute path="/" component={Catalog} callback={callback} />);
  }

  return (<SecureRoute path={path} component={component} callback={callback} />);
};

export default App;
