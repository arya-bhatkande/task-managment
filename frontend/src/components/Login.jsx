import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await fetch("http://localhost:8080/api/auth/login",{
            method:'POST',
            headers:{
                'content-type':'application/json' },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();
      if (json.success) {
        localStorage.setItem('token', json.authtoken);
        props.showAlert('Logged In Successfully', 'success');
        history('/');
      } else {
        props.showAlert('Invalid Credentials', 'danger');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      props.showAlert('Something went wrong. Please try again later.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-3">
      <h1>Login to continue </h1>
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name='email' onChange={onChange}/>
  </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={credentials.password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default Login;
