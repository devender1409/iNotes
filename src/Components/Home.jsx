import React from 'react'
import Notes from './Notes.jsx'


const Home = (props) => {
    return (
        <div className='container fluid-container'>
            <Notes showAlert={props.showAlert} ></Notes>
        </div>


    )
}

export default Home
