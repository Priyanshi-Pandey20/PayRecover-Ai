import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="brand">
                 Pay<span>Recover</span> AI
            </div>
            <div className="nav-links">
                <Link to="/"> Store</Link>
                <Link to="/dashboard"> Dashboard</Link>
            </div>
        </nav>
    );
};

export default Navbar;