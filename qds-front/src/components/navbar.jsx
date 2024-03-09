import { Link } from 'react-router-dom';
import "../style/Navbar.css";

export function Navbar() {
    return (
        <nav className="navbar">
            <div className="brand">CareLink</div>
            <ul className="navbar-nav">
                <li className="nav-item non-highlight"><Link to="/">Home</Link></li>
                <li className="nav-item non-highlight"><Link to="/main">Main</Link></li>
                <li className="nav-item non-highlight"><Link to="/login">Login</Link></li>
                <li className="nav-item highlight"><Link to="/login">Get Started</Link></li>
            </ul>
        </nav>
    );
}