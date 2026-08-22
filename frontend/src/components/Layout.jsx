import {Link, Outlet} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { CircleUserRound, House, Podium, CirclePlus, Cpu, Database, UserRound } from 'lucide-react';

function Layout() {

    const {isLoggedIn, isCheckingSession, logout} = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    if (isCheckingSession) {
        return (
            <>
                <header className="layout-header">
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
            <header className="layout-header">
                <nav>
                    <h3>MENU</h3>
                    <ul>
                        <li><Link to="/"><House /> Home</Link></li>
                        <li><Link to="/leaderboard"><Podium /> Leaderboard</Link></li>
                        <li><Link to="/experiment"><CirclePlus /> Submit Experiment</Link></li>
                        <li><Link to="/model"><Cpu /> Model</Link></li>
                        <li><Link to="/datasets"><Database /> Datasets</Link></li>
                        <li><Link to="/leaderboardDemo"><Podium /> Leaderboard Demo</Link></li>
                    </ul>
                    {isLoggedIn && (
                        <>
                            <h3>ADMIN</h3>
                            <ul>
                                <li><Link to="/users"><UserRound /> Users</Link></li>
                            </ul>
                        </>
                    )}
                    
                </nav>
                <h1>PoliBench</h1>
                
                <div className="layout-login">
                    {isLoggedIn ? (
                        <>
                            <button onClick={toggleMenu}>
                                <CircleUserRound />
                            </button>
                            {isOpen && (
                                
                                <ul>
                                    <li><Link to="/profile">Profile</Link></li>
                                    <li><button onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}>
                                        Logout</button></li>
                                </ul>
                            )}
                        </>
                    ) : (
                        <ul>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </ul>
                    )}
                </div>
            </header>
            <main className="layout-content">
                <Outlet /> 
            </main>
        </>
    )
}
export default Layout;