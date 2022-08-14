import React,{useState} from 'react';
import { useHistory } from 'react-router-dom';

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:"",email: "", password: ""}) 
    let history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/createUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: credentials.name,email: credentials.email, password: credentials.password})
        });
        const json = await response.json()
        console.log(json);
        if (json.success){
            // Save the auth token and redirect
            props.showAlert("Signed Up successfully","success");
            localStorage.setItem('token', json.authtoken); 
            history.push('/login');
        }
        else{
            props.showAlert("Invalid Details","warning");
            setCredentials({name:"",email: "", password: ""});
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }
    return (
        <div  className='container fluid-container mt-5'>
            <form autocomplete="off" onSubmit={handleSubmit} className='my-4'>
                <h3 className="mx-5">Welcome to NOTX - Save ur Notes On Cloud</h3>
                <div className="mb-3 my-4">
                    <label htmlFor="exampleInputName" className="form-label">Your Name</label>
                    <input type="text" className="form-control" name="name" id="exampleInputEmail1" aria-describedby="namelHelp" minLength={5} required onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" name="email" id="exampleInputEmail2" aria-describedby="emailHelp" required onChange={onChange}/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" id="exampleInputPassword1" minLength={5} required onChange={onChange}/>
                </div>
                <button disabled={credentials.password.length<5 && credentials.name.length!==0} type="submit" className="btn btn-primary">SignUp</button>
            </form>
        </div>


    )
}

export default Signup
