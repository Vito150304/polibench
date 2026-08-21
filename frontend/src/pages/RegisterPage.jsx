import useRegister from '../hooks/useRegister';
import { useRef} from 'react';

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

    return (//Ci devo mettere l'interfaccia per registrazione con Google(?) non ricordo, controllare in futuro
        <>
        <form onSubmit={handleSubmit}>
            <input type="text" ref={firstNameRef} placeholder="First name" required />
            <input type="text" ref={lastNameRef} placeholder="Last name" required />
            <input type="email" ref={emailRef} placeholder="Email" required />
            <input type="password" ref={passwordRef} placeholder="Password" required />
            <button type="submit" disabled={registerMutation.isPending}>Register</button>
        </form>

        {registerMutation.isPending && <p>Loading...</p>}
        {registerMutation.isError && <p>Error: {registerMutation.error.message}</p>}
        </>
    )
}
export default RegisterPage;