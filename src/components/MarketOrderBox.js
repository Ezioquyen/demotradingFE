import React from 'react';

function MarketOrderBox({ selectedPair }) {
    return (
        <div className="market-order-box">
            <h3>Market Order</h3>
            <p>Selected Pair: {selectedPair ? selectedPair.symbol : 'N/A'}</p>
            <button className="buy-btn">Buy Market</button>
            <button className="sell-btn">Sell Market</button>
        </div>
    );
}

export default MarketOrderBox;
