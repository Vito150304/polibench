import useRegister from '../hooks/useRegister';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/RegisterPage.module.css';

function RegisterPage() {
    const registerMutation = useRegister();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            first_name: firstNameRef.current.value,
            last_name: lastNameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        registerMutation.mutate(formData);
    }

        return (
        <div className={styles.page}>
            <h1 className={styles.title}>Register</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                    <label className={styles.field}>
                        <span className={styles.label}>First name</span>
                        <input type="text" ref={firstNameRef} required />
                    </label>
                    <label className={styles.field}>
                        <span className={styles.label}>Last name</span>
                        <input type="text" ref={lastNameRef} required />
                    </label>
                </div>
                <label className={styles.field}>
                    <span className={styles.label}>Email</span>
                    <input type="email" ref={emailRef} required />
                </label>
                <label className={styles.field}>
                    <span className={styles.label}>Password</span>
                    <input type="password" ref={passwordRef} required />
                </label>
                <button type="submit" className={styles.primary} disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p className={styles.footer}>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    )
}
export default RegisterPage;