import React, { useState, useEffect } from 'react';
import Header from './Header';
import FuturesList from './FuturesList';
import UserTabs from './UserTabs';
import MarketOrderBox from './MarketOrderBox';
import PlaceOrderBox from './PlaceOrderBox';
import WalletInfo from './WalletInfo';
import './MobileDashboard.css';

function Dashboard({ user, onLogout }) {
    const [selectedPair, setSelectedPair] = useState(null);
    const [globalPositions, setGlobalPositions] = useState([]);
    const [globalPrice, setGlobalPrice] = useState(null);

    useEffect(() => {
        fetch(process.env.REACT_APP_API_BASE_URL + `/position/${user.id}/OPEN`)
            .then((res) => res.json())
            .then((data) => {
                setGlobalPositions(data);
            })
            .catch((err) => console.error("Error fetching positions:", err));
    }, [user.id]);

    return (
        <div className="dashboard-container">
            <Header onLogout={onLogout}/>
            <div className="dashboard-content">
                <div className="chart-area">
                    <FuturesList onSelectPair={(pair) => setSelectedPair(pair)}/>
                    <UserTabs userId={user.id}/>
                </div>
                <div className="order-side">
                    <MarketOrderBox selectedPair={selectedPair} onPriceUpdate={(price) => setGlobalPrice(price)}/>
                    <PlaceOrderBox selectedPair={selectedPair} userId={user.id} lastPrice={globalPrice}/>
                    <WalletInfo userId={user.id} positions={globalPositions}/>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
