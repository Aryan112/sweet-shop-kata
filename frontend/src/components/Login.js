import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css';

const Login = ({ setToken, setRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'register' : 'login';
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, { username, password });
      
      if (isRegistering) {
        alert('Registration successful! Please login.');
        setIsRegistering(false);
      } else {
        setToken(res.data.token);
        setRole(res.data.role);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action Failed');
    }
  };

  return (
    <div className={styles.container}>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
            <input className={styles.input} placeholder="Username" onChange={e => setUsername(e.target.value)} required />
            <input className={styles.input} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
            <button className={styles.button} type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        </form>
        <p className={styles.toggle} onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </p>
    </div>
  );
};
export default Login;