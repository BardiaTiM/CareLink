import { Link } from 'react-router-dom';
import "../style/Navbar.css";

export function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="nav-item"><Link to="/">Home</Link></li>
                <li className="nav-item"><Link to="/login">Login</Link></li>
                <li className="nav-item"><Link to="/main">Main (Temp Link)</Link></li>
            </ul>
        </nav>
    );
}