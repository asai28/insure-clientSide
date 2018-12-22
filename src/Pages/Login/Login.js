import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Grid, Alert } from 'reactstrap';
import { RegisterLink } from './RegisterPage';
import { auth } from '../firebase/firebase';
import * as routes from '../constants/routes';

const LoginPage = ({ history }) =>
  <Grid centered columns={2}>
    <Grid.Column>
      <h2>Login</h2>
      <LoginForm history={history} />
      <br />
      <RegisterLink />
    </Grid.Column>
  </Grid>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    event.preventDefault();
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

      const username = this.state.email;

      const url = `http://localhost:8080/adaptiveweb/login?username=${username}&password=1111`
        return fetch(url)
            .then(response => response.json())
            .then(response => console.log('Successful login!'))
            .catch(error => console.log(error));

  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Input fluid
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
          label="Email Address"
        />
        <Form.Input fluid
          value={password}
          onChange={event => this.setState(byPropKey('password', event.target.value))}
          type="password"
          placeholder="Password"
          label="Password"
        />
        <Form.Button disabled={isInvalid}>Submit</Form.Button>
        {
          error &&
          <Alert negative>
            <Message.Header>{error.message}</Message.Header>
          </Alert>
        }
      </Form>
    );
  }
}

export default withRouter(LoginPage);

export {
  LoginForm,
};