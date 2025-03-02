import React, { useState } from 'react';
import LoginSignup from './components/LoginSignup';
import Dashboard from './components/Dashboard';

function App() {
    // Lưu user khi đăng nhập (id, username)
    const [user, setUser] = useState(null);

    // Xử lý đăng nhập thành công -> lưu user
    const handleLoginSuccess = (userData) => {
        setUser(userData);
    };

    // Xử lý đăng xuất
    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div className="app-container">
            {user ? (
                <Dashboard user={user} onLogout={handleLogout} />
            ) : (
                <LoginSignup onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}

export default App;
