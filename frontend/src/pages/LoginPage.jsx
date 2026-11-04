import  {useAuth}  from '../contexts/AuthContext';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify'; 
import styles from '../styles/LoginPage.module.css';

function LoginPage() {

    const {login} = useAuth(); 
    const emailRef = useRef();
    const passwordRef = useRef();
    
    function handleSubmit(e) {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        
        login(email, password);
    }

    const NewVerificationEmailMutation = useMutation({
        mutationKey: ['NewVerificationEmail'],
        mutationFn: async ({email}) => {
            let response;
            try {
                response = await fetch('/api/v1/users/resend-verification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });
            } catch (networkError) {
                console.error("Error during the fetch:", networkError);
                throw new Error('Network error:', { cause: networkError });
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to resend verification email');
            }

            return await response.json();
        },

        onSuccess: () => {
            toast.success('Email has been sent again');
        },

        onError: (error) => {
            console.error("Error while sending verification email:", error);
            toast.error(`Error while sending verification email: ${error.message}`);
        }
    });

    const handleNewVerificationEmail = () => {
        const currentEmail = emailRef.current.value;
        
        if (!currentEmail) {
            toast.error("Please, write your email before requesting a new link.");
            return; 
        }
        
        NewVerificationEmailMutation.mutate({ email: currentEmail });
    }

        return( 
        <div className={styles.page}>
            <h1 className={styles.title}>Login</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.field}>
                    <span className={styles.label}>Email</span>
                    <input type="email" ref={emailRef} required />
                </label>
                <label className={styles.field}>
                    <span className={styles.label}>Password</span>
                    <input type="password" ref={passwordRef} required />
                </label>
                <button type="submit" className={styles.primary}>Login</button>
                <button
                    type="button"
                    className={styles.secondary}
                    onClick={handleNewVerificationEmail}
                    disabled={NewVerificationEmailMutation.isPending}
                >
                    Resend verification email
                </button>
            </form>
            <p className={styles.footer}>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    )
}
export default LoginPage;