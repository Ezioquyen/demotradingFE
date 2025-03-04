import React, {useEffect, useState} from 'react';
import Header from './Header';
import FuturesList from './FuturesList';
import UserTabs from './UserTabs';
import MarketOrderBox from './MarketOrderBox';
import PlaceOrderBox from './PlaceOrderBox';
import WalletInfo from './WalletInfo';
import './MobileDashboard.css';

function MobileDashboard({ user, onLogout }) {
    const [showFuturesList, setShowFuturesList] = useState(false);
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
        <div className="mobile-dashboard">
            {/* Header */}
            <Header onLogout={onLogout} />

            {/* Nút Toggle danh sách Futures */}
            <button
                className="toggle-futures-btn"
                onClick={() => setShowFuturesList(!showFuturesList)}
            >
                {showFuturesList ? "Hide Futures" : "Show Futures"}
            </button>

            {/* Danh sách Futures (chỉ hiển thị displayName) */}
            {showFuturesList && (
                <div className="mobile-futures-list">
                    <FuturesList
                        onSelectPair={(pair) => {
                            setSelectedPair(pair);
                            setShowFuturesList(false);
                        }}
                    />
                </div>
            )}

            {/* Nút tìm kiếm */}
            <div className="mobile-search">
                <input type="text" placeholder="Search futures..." />
            </div>

            {/* Main area chia đôi: bên trái PlaceOrderBox, bên phải MarketOrderBox và WalletInfo */}
            <div className="mobile-main-area">
                <div className="left-pane">
                    <PlaceOrderBox selectedPair={selectedPair} userId={user.id} lastPrice={globalPrice}/>
                </div>
                <div className="right-pane">
                    <div className="top-right">
                        <MarketOrderBox selectedPair={selectedPair} onPriceUpdate={(price) => setGlobalPrice(price)}/>
                    </div>
                    <div className="bottom-right">
                        <WalletInfo userId={user.id} positions={globalPositions}/>
                    </div>
                </div>
            </div>

            {/* UserTabs nằm dưới cùng */}
            <div className="mobile-bottom">
                <UserTabs userId={user.id}/>
            </div>
        </div>
    );
}

export default MobileDashboard;
