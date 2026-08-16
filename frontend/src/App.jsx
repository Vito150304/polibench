//import { useState } from 'react'
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';


function App() {
    return (
        <div>
            <h1>Welcome to the Registration Page</h1>
            <RegisterPage />    
            <h1>Welcome to the Login Page</h1>
            <LoginPage />
        </div>
    );
}

export default App
