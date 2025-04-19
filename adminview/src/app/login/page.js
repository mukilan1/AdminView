'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!username || !password || !role) {
      setError('Please fill in all fields');
      return;
    }

    // Frontend authentication (demo purposes)
    // In a real app, this would communicate with a backend
    const success = login(username, password, role);
    
    if (success) {
      // Redirect based on role
      if (role === 'collector' || role === 'deptHead') {
        router.push('/dashboard');
      } else if (role === 'endOfficeWorker') {
        router.push('/assignments');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <Image 
            src="/government-logo.png" 
            alt="Government Logo" 
            width={80} 
            height={80} 
            className={styles.logo}
            // If logo doesn't exist yet, uncomment below and comment out the Image component
            // priority
          />
          {/* If logo doesn't exist yet, you can use a placeholder text */}
          {/* <div className={styles.logoPlaceholder}>Logo</div> */}
          <h1 className={styles.appTitle}>Administrative Portal</h1>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.select}
            >
              <option value="">Select your role</option>
              <option value="collector">Collector</option>
              <option value="deptHead">Department Head</option>
              <option value="endOfficeWorker">End Office Worker</option>
            </select>
          </div>
          
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
