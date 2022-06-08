import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createBrowserHistory } from "history";

import Intro from "../Components/BeginPage/Intro";
import Reset from "../Components/BeginPage/Reset";
import App from "../Components/App/App";
import Admin from "../Components/Admin/Admin";
import {UpdateThesis, WriteThesis} from "../Components/Thesis/WriteThesis";
import SeeThesis from "../Components/Thesis/SeeThesis";
import NotFound from "../Components/BeginPage/NotFound";

export default class Routing extends React.Component {
    render() {
        return <Router history={ createBrowserHistory() }>
            <Routes>
                <Route exact path="/" element={ <Intro/> }/>
                <Route path="/reset" element={ <Reset/> }/>
                <Route path="/app" element={ <App/> }/>
                <Route path="/admin" element={ <Admin/>}/>
                <Route path="/writing" element={ <WriteThesis/> }/>
                <Route path="/detail/:id" element={ <SeeThesis/> }/>
                <Route path="/edit/:id" element={ <UpdateThesis/> }/>
                <Route path="*" element={ <NotFound/> }/>
            </Routes>
        </Router>
    }
}