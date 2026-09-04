import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Products from './pages/Products';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Success from './pages/Success';
import RecoveryPopup from './components/RecoveryPopup';
import './styles/App.css';

function App() {
    const [recoveryData, setRecoveryData] = useState(null);
    const [showRecoveryPopup, setShowRecoveryPopup] = useState(false);

    //  Poll backend for recovery data every 3 seconds
    useEffect(() => {
        const checkRecovery = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/recovery/data');
                console.log(' Recovery check:', response.data);
                
                if (response.data.success && response.data.data) {
                    const data = response.data.data;
                    // Check if it has a recovery link (not a recovery complete message)
                    if (data.recoveryLink && !data.recovered) {
                        console.log(' Recovery link found! Showing popup...');
                        setRecoveryData(data);
                        setShowRecoveryPopup(true);
                        // Clear the data after showing popup
                        await axios.post('http://localhost:5000/api/recovery/clear');
                    }
                }
            } catch (error) {
                console.error(' Error checking recovery:', error);
            }
        };

        // Check immediately
        checkRecovery();
        
        // Then check every 3 seconds
        const interval = setInterval(checkRecovery, 3000);
        
        return () => clearInterval(interval);
    }, []);

    const handleClosePopup = () => {
        setShowRecoveryPopup(false);
        setRecoveryData(null);
    };

    return (
        <BrowserRouter>
            <nav className="navbar">
                <div className="brand">
                     Pay<span>Recover</span> AI
                </div>
                <div className="nav-links">
                    <Link to="/"> Store</Link>
                    <Link to="/dashboard"> Dashboard</Link>
                </div>
            </nav>

            <div className="container">
                <Routes>
                    <Route path="/" element={<Products />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/payment-success" element={<Success />} />
                </Routes>
            </div>

            {/*  Recovery Popup - Shows automatically when recovery link is generated */}
            {showRecoveryPopup && recoveryData && (
                <RecoveryPopup
                    isOpen={showRecoveryPopup}
                    onClose={handleClosePopup}
                    recoveryLink={recoveryData.recoveryLink}
                    amount={recoveryData.amount}
                    orderId={recoveryData.orderId}
                />
            )}
        </BrowserRouter>
    );
}

export default App;