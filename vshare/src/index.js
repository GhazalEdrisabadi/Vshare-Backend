import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import Create from './create_room/create_room'
import Homepage from './Component/Homepage'
import Login from './Components/signup-login/signup-login'
const App = () => {
    return (
        <BrowserRouter>
            <div>
                <Route path="/create" component={Create} />
                <Route path="/homepage" component={Homepage} />
                <Route path="/login" component={Login} />
            </div>
        </BrowserRouter>
    )
}
ReactDOM.render(
    <App />, document.querySelector('#root')
)
//serviceWorker.unregister();