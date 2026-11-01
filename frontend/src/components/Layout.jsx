import {Link, NavLink, Outlet, useNavigate} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { House, Podium, CirclePlus, Cpu, Database, UserRound } from 'lucide-react';
import styles from "../styles/Layout.module.css";

function Layout() {

    const {isLoggedIn, isCheckingSession, logout, utente} = useAuth();
    const navigate = useNavigate();


    if (isCheckingSession) {
        return (
            <>
                <header className={styles.header}>
                    <Link to="/" className={styles.loadingTitle}>PoliBench</Link>
                </header>
                <p>Loading...</p> {/*volendo ci posso mettere un'icona o 
                componente di caricamento diverso. 
                Forse non serve perché è gestito da ProtectedRoute*/}
            </>
        )
    }

    const navLink = ({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;


    return (
        <>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <ul>
                        <li><NavLink to="/" end className={navLink}><House size="1.2em" /> Home</NavLink></li>
                        <li><NavLink to="/leaderboard" className={navLink}><Podium size="1.2em" /> Leaderboard</NavLink></li>
                        <li><NavLink to="/experiment" className={navLink}><CirclePlus size="1.2em" /> Submit Experiment</NavLink></li>
                        <li><NavLink to="/models" className={navLink}><Cpu size="1.2em" /> Model</NavLink></li>
                        <li><NavLink to="/datasets" className={navLink}><Database size="1.2em" /> Datasets</NavLink></li>
                    </ul>
                    {utente?.is_superuser && (
                        <ul>
                            <li><NavLink to="/users" className={navLink}><UserRound size={"1.2em"} /> Users</NavLink></li>
                        </ul>
                    )}
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