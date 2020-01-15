import React, { Component } from "react";
import './index.scss';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from '../compontent/header';
import LeftColumn from '../compontent/LeftColumn';
import Agent from '../pages/agent'
import Betting from '../pages/betting'
import Capital from '../pages/capital'
import Member from '../pages/member'
import score from  '../pages/score'
import login from '../pages/login'


export default class RouterConfig extends Component{
    render(){
        return(
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={login} exact />
                    <Route  path="/login" component={login}/>
                    <Route  history ={this.props.history}>
                        <Header history ={this.props.history}></Header>
                            <div className="content">
                                <div className="left">
                                    <LeftColumn></LeftColumn>
                                </div>
                                <div className="conter">
                                    <Route  path="/Agent" component={Agent}/>
                                    <Route  path="/Betting/:name" exact component={Betting}/>
                                    <Route  path="/Capital" component={Capital}/>
                                    <Route  path="/Member" component={Member}/>
                                    <Route  path="/score" component={score}/>
                                </div>
                            </div>
                    </Route>
                </Switch>
            </BrowserRouter>
        )
    }
}