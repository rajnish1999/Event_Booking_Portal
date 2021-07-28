import React, { Component  } from "react";

import './Auth.css'

class AuthPage extends Component {

    constructor(props){
        super(props);
        this.emailEl = React.createRef();
        this.passEl = React.createRef();
    }

    state = {
        isLogin: true
    }

    switchModeHandler = () => {
        this.setState((prevState) => {
            return {
                isLogin: !prevState.isLogin,
            }
        })
    }

    submitHandler = (e) => {
        e.preventDefault();
        let email = this.emailEl.current.value;
        let password = this.passEl.current.value;
        
        if(email.trim().length === 0 || password.trim().length === 0){
            return;
        }
        let requestBody
        if(this.state.isLogin){
            requestBody = {
                query: `
                    query {
                        login(email: "${email}", password: "${password}") {
                            userId
                            token
                            tokenExpiration
                        }
                    }
                `
            }    
        } else{
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: {
                            email: "${email}", password: "${password}"
                        }) {
                            _id
                            email
                        }
                    }
                `
            }
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res);
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
            }
            return res.json();
          })
          .then(resData => {
            console.log(resData);
          })
          .catch(err => {
            console.log(err);
          });
    }
    
    render() {
        return (
            <form className="authForm" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" id="email" ref={this.emailEl} />
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passEl}/>
                </div>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'SignUp' : 'Login'}</button>
                    
                </div>
            </form>
        )
    }
}

export default AuthPage