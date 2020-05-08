import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import Homepage from './Component/Homepage'
import Login from './Components/signup-login/signup-login'
import Profile from './profile/profile'

import Chat from './chatroom/chat_room'

import Start from './Strartpage/Startpage'
import About from './About/About'

const App = () => {
    return (
        <BrowserRouter>
            <div>


                
                <Route path="/homepage" component={Homepage}/>
                <Route path="/login" component={Login}/>
                <Route path="/startpage" component={Start}/>
                <Route path="/about" component={About} />
                <Route path="/profile/:id" component={Profile} />

                <Route exact path="/group/:id"  component={Chat} />





            </div>
        </BrowserRouter>
 
    )
}

ReactDOM.render(
    <App/>, document.querySelector('#root')
)
//serviceWorker.unregister();