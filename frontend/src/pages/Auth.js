import React, { Component  } from "react";

import './Auth.css'

class AuthPage extends Component {

    constructor(props){
        super(props);
        this.emailEl = React.createRef();
        this.passEl = React.createRef();
    }

    submitHandler = (e) => {
        e.preventDefault();
        let email = this.emailEl.current.value;
        let password = this.passEl.current.value;
        
        if(email.trim().length === 0 || password.trim().length === 0){
            return;
        }
        console.log(email + " " + password);
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
                    <button type="button">Switch to SignUp</button>
                    
                </div>
            </form>
        )
    }
}

export default AuthPage