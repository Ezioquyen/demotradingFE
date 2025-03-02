import React from 'react';

function Header({ onLogout }) {
    return (
        <div className="header-bar">
            <div className="header-left">
                <img
                    src="https://www.mexc.com/mexclogo.svg"
                    alt="MEXC Logo"
                />
                <span>Futures Demo</span>
            </div>
            <div className="header-right">
                <button onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Header;
