import React from 'react';

function WalletInfo() {
    // Giả lập số dư ví và unrealized PNL
    return (
        <div className="wallet-info">
            <h4>Wallet</h4>
            <p>Balance: 1000 USDT</p>
            <p>Unrealized PNL: +20 USDT</p>
        </div>
    );
}

export default WalletInfo;
