import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CONSTANTS from "./constants/routes.js";
import ServiceRequestForm from "./Pages/ServiceRequestForm/ServiceRequestForm";
import TaskList from "./Pages/TaskList/TaskList";
import {Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from "reactstrap";
import routes from "./constants/routes";
// import firebase from './firebase.js';

// import Login from "./Pages/Login/Login";
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggle = this.toggle.bind(this);
  }

  //Toggling Navbar
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render(){
  return (
    <div>
      <Navbar color="light" light expand="md">
          <NavbarBrand href="/">
            <img src="./logo.png" />
            <h1 className="float-right">&nbsp;Insure Compliance</h1>{" "}
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/srf">Service Request Form</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/tasklist">Task List</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Options
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>Option 1</DropdownItem>
                  <DropdownItem>Option 2</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Reset</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
        <Router>
        <Switch>
        <Route exact={true} path={routes.SERVICE_FORM} component={ServiceRequestForm} />
        {/* <Route exact={true} path={routes.LOGIN} component={LoginPage} />
        <Route exact={true} path={routes.REGISTER} component={RegisterPage} /> */}
        <Route exact={true} path={routes.TASK_LIST} component={TaskList} />
        </Switch>
        </Router>
    </div>
  ) 
  
}
};

export default App;