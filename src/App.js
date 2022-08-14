import React,{useState} from 'react';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import About from './Components/About';
import NoteState from './context/notes/NoteState';
import Alert from './Components/Alert';

import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import Signup from './Components/Signup';
import Login from './Components/Login';



function App() {
  const[alert,setAlert] = useState(null);
  const showAlert=(message,type)=>{
    setAlert({
      msg:message,
      type:type
    })
    setTimeout(() => {
      setAlert(null);
    },1500);
  }

  return (
    <>
      <Router>
      <NavBar />
      <Alert alert={alert}/>
        <NoteState showAlert={showAlert}>
          <div className='container'>
            <Route exact path="/">
              <Home showAlert={showAlert}/>
            </Route>
            <Route exact path="/about">
              <About />
            </Route>
            <Route exact path="/login">
              <Login showAlert={showAlert}/>
            </Route>
            <Route exact path="/signup">
              <Signup showAlert={showAlert}/>
            </Route>
          </div>
        </NoteState>
      </Router>
    </>

  );
}

export default App;

