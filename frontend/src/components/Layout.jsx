import {Link, NavLink, Outlet, useNavigate} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/Layout.module.css";

function Layout() {

    const {isLoggedIn, isCheckingSession, logout, utente} = useAuth();
    const navigate = useNavigate();


    if (isCheckingSession) {
        return (
            <>
                <header className={styles.header}>
                    <Link to="/" className={styles.brand}>PoliBench</Link>
                </header>
                <p>Loading...</p> 
            </>
        )
    }

    const navLink = ({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;


    return (
        <>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        <li><NavLink to="/" end className={navLink}>Home</NavLink></li>
                        <li><NavLink to="/leaderboard" className={navLink}>Leaderboard</NavLink></li>
                        <li><NavLink to="/experiment" className={navLink}>Submit Experiment</NavLink></li>
                        <li><NavLink to="/models" className={navLink}>Models</NavLink></li>
                        <li><NavLink to="/datasets" className={navLink}>Datasets</NavLink></li>
                        {utente?.is_superuser && (
                            <li><NavLink to="/users" className={navLink}>Users</NavLink></li>
                        )}
                    </ul>
                </nav>
                <div className={styles.userMenu}>
                    {isLoggedIn ? (
                        <ul className={styles.dropdownMenu}>
                            <li><NavLink to="/profile" className={navLink}>Profile</NavLink></li>
                            <li><button className={styles.logoutButton} onClick={() => {
                                logout();
                                navigate("/login");
                            }}>
                                Logout</button></li>
                        </ul>
                    ) : (
                        <ul className={styles.dropdownMenu}>
                            <li><NavLink to="/login" className={navLink}>Login</NavLink></li>
                            <li><NavLink to="/register" className={navLink}>Register</NavLink></li>
                        </ul>
                    )}
                </div>
            </header>
            <main className={styles.content}>
                <Outlet />
            </main>
        </>
    )
}
export default Layout;