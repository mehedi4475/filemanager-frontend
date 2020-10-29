import React, { Component } from 'react';
import ApiService from './ApiService';

export default function withAuth(AuthComponent) {
    
    const Api = new ApiService('http://localhost:8080');
    return class AuthWrapped extends Component {
        constructor() {
            super();
            this.state = {
                user: null
            }
        }

        componentWillMount() {
            if (!Api.loggedIn()) {
                this.props.history.replace('/login')
            }
            else {
                try {
                    const profile = Api.getProfile()
                    this.setState({
                        user: profile
                    })
                }
                catch(err){
                    Api.logout()
                    this.props.history.replace('/login')
                }
            }
        }

        render() {
            if (this.state.user) {
                return (
                    <AuthComponent history={this.props.history} user={this.state.user} />
                )
            }
            else {
                return null
            }
        }
    }
}