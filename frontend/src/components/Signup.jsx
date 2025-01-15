import React from 'react'
import { useState } from 'react';
import { useNavigate} from 'react-router-dom'

const Signup = (props) => {
    const [credentials,setCredentials]=useState({name:"",email:"", password:"",cpassword:""});
    let history = useNavigate()

    const handleSubmit = async(e)=>{
        e.preventDefault();
        // eslint-disable-next-line 
        const {name,email,password,cpassword}=credentials;
        const response = await fetch("http://localhost:8080/api/auth/createuser",{
            method:'POST',
            headers:{
                'content-type':'application/json',
            },
            body:JSON.stringify({name,email,password})
        });
        const json= await response.json()
        console.log(json)
        if(json.success){
             //save the token and redirect
             localStorage.setItem('token',json.authtoken);
             history("/")
             props.showAlert("Account created Succesfully","success")
        }
    else{
      props.showAlert("Invalid Credentials","danger")
    }
  }
    const onChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
   }

  return (
    <div className='container mt-3'>
      <h1>Signup to use iNotebook</h1>
      <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
    <input type="text" className="form-control" id="name" aria-describedby="emailHelp" name='name' onChange={onChange}/>
  </div>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name='email' onChange={onChange}/>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" id="password" name='password' onChange={onChange} minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
    <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange}/>
  </div>
  
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default Signup
