import React, {useState, useEffect} from 'react';
import LoginSignup from './components/LoginSignup';
import Dashboard from './components/Dashboard';
import {PositionOrderProvider} from './contexts/PositionOrderContext';
import MobileDashboard from "./components/MobileDashboard";

function App() {
    const [user, setUser] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    // Lấy user từ localStorage khi khởi động (nếu cần)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <div className="app-container">
            {user ? (
                <PositionOrderProvider userId={user.id}>
                    {isMobile ? <MobileDashboard user={user} onLogout={handleLogout}/> :
                        <Dashboard user={user} onLogout={handleLogout}/>}
                </PositionOrderProvider>
            ) : (
                <LoginSignup onLoginSuccess={handleLoginSuccess}/>
            )}
        </div>
    );
}

export default App;
