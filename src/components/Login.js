import React, { Component } from 'react';
import './Login.css';
import ApiService from './ApiService';

class Login extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.Api = new ApiService();
  }

  componentWillMount(){
    if(this.Api.loggedIn())
        this.props.history.replace('/');
  }

  handleFormSubmit(e){
    e.preventDefault();

    this.Api.login(this.state.username,this.state.password)
        .then(res =>{
           this.props.history.replace('/');
        })
        .catch(err =>{
            alert(err);
        })
  }

  render() {
    return (
      <div className="center">
        <div className="card">
          <h1>Login</h1>
          <form onSubmit={this.handleFormSubmit}>
            <input
              className="form-item"
              placeholder="Username goes here..."
              name="username"
              type="text"
              onChange={this.handleChange}
            />
            <input
              className="form-item"
              placeholder="Password goes here..."
              name="password"
              type="password"
              onChange={this.handleChange}
            />
            <input className="form-submit" value="SUBMIT" type="submit" />
          </form>
        </div>
      </div>
    );
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
}

export default Login;