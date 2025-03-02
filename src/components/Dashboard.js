import React, { useState } from 'react';
import Header from './Header';
import FuturesList from './FuturesList';
import UserTabs from './UserTabs';
import MarketOrderBox from './MarketOrderBox';
import PlaceOrderBox from './PlaceOrderBox';
import WalletInfo from './WalletInfo';

function Dashboard({ user, onLogout }) {
    const [selectedPair, setSelectedPair] = useState(null);

    return (
        <div className="dashboard-container">
            <Header onLogout={onLogout} />

            <div className="dashboard-content">
                {/* Khu vực “chart” thay bằng futures list + tabs Positions/Orders */}
                <div className="chart-area">
                    <FuturesList onSelectPair={(pair) => setSelectedPair(pair)} />
                    <UserTabs />
                </div>

                {/* Khu vực bên phải: Market Order, Place Order, WalletInfo */}
                <div className="order-side">
                    <MarketOrderBox selectedPair={selectedPair} />
                    <PlaceOrderBox selectedPair={selectedPair} />
                    <WalletInfo />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
