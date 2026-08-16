import  useAuth  from '../contexts/AuthContext';
import { useRef } from 'react';

function LoginPage() {

    const {login} = useAuth(); //dentro la parentesi ci dovrò mettere tutte le cose che mi possono servire
    const emailRef = useRef();
    const passwordRef = useRef();
    
    function handleSubmit(e) {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        
        login(email, password);
    }
    
    return(
        <form onSubmit = {handleSubmit}>
            <input type = "email" ref = {emailRef} placeholder = "Email" required />
            <input type = "password" ref = {passwordRef} placeholder = "Password" required />
            <button type = "submit">Login</button>
        </form>
    )
}
export default LoginPage;