import {Link, Outlet, useNavigate} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { House, Podium, CirclePlus, Cpu, Database, UserRound, ChevronDown, ChevronUp } from 'lucide-react';
import styles from "../styles/Layout.module.css";

function Layout() {

    const {isLoggedIn, isCheckingSession, logout} = useAuth();
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpenMenu(!isOpenMenu);
    }

    if (isCheckingSession) {
        return (
            <>
                <header className={styles.header}>
                    <h1>PoliBench</h1>
                </header>
                <p>Loading...</p> {/*volendo ci posso mettere un'icona o 
                componente di caricamento diverso. 
                Forse non serve perché è gestito da ProtectedRoute*/}
            </>
        )
    }

    return (
        <>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    {isOpenMenu ? (
                        <>
                        <button onClick={toggleMenu} className={styles.iconButton}>
                            <ChevronUp size={38} />
                        </button>
                        <ul>
                            <li><Link to="/"><House size="1.2em" /> Home</Link></li>
                            <li><Link to="/leaderboard"><Podium size="1.2em" /> Leaderboard</Link></li>
                            <li><Link to="/experiment"><CirclePlus size="1.2em" /> Submit Experiment</Link></li>
                            <li><Link to="/models"><Cpu size="1.2em" /> Model</Link></li>
                            <li><Link to="/datasets"><Database size="1.2em" /> Datasets</Link></li>
                        </ul>
                        {isLoggedIn && (
                            <ul>
                                <li><Link to="/users"><UserRound size={"1.2em"} /> Users</Link></li>
                            </ul>
                        )}
                        </>
                    ) : (
                        <button onClick={toggleMenu} className={styles.iconButton}>
                            <ChevronDown size={38} />
                        </button>
                    )}
                    </nav>

                    <div className={styles.userMenu}>
                        {isLoggedIn ? (
                    
                                
                            <ul className={styles.dropdownMenu}>
                                <li><Link to="/profile">Profile</Link></li>
                                <li><button className={styles.logoutButton} onClick={() => {
                                    logout();
                                    navigate("/login");
                                }}>
                                    Logout</button></li>
                            </ul>
                        ) : (
                            <ul className={styles.dropdownMenu}>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
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