import React, { useState } from 'react';

function PlaceOrderBox({ selectedPair }) {
    const [leverage, setLeverage] = useState(1);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [tp, setTp] = useState('');
    const [sl, setSl] = useState('');

    const handleLeverageChange = (e) => {
        setLeverage(e.target.value);
    };

    const handleBuy = () => {
        // TODO: Gọi API place order (limit buy)
        console.log('Limit Buy', { leverage, price, quantity, tp, sl });
    };

    const handleSell = () => {
        // TODO: Gọi API place order (limit sell)
        console.log('Limit Sell', { leverage, price, quantity, tp, sl });
    };

    return (
        <div className="order-box">
            <h3>Place Order (Limit)</h3>
            <p>Selected Pair: {selectedPair ? selectedPair.symbol : 'N/A'}</p>

            <div className="order-input">
                <label>Leverage: {leverage}x</label>
                <input
                    type="range"
                    min="1"
                    max={selectedPair ? selectedPair.maxLeverage : 125}
                    value={leverage}
                    onChange={handleLeverageChange}
                />
            </div>
            <div className="order-input">
                <label>Price (USDT)</label>
                <input
                    type="text"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <div className="order-input">
                <label>Quantity</label>
                <input
                    type="text"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
            </div>
            <div className="order-input">
                <label>Take Profit (TP)</label>
                <input
                    type="text"
                    placeholder="TP"
                    value={tp}
                    onChange={(e) => setTp(e.target.value)}
                />
            </div>
            <div className="order-input">
                <label>Stop Loss (SL)</label>
                <input
                    type="text"
                    placeholder="SL"
                    value={sl}
                    onChange={(e) => setSl(e.target.value)}
                />
            </div>

            <button className="buy-btn" onClick={handleBuy}>Buy</button>
            <button className="sell-btn" onClick={handleSell}>Sell</button>
        </div>
    );
}

export default PlaceOrderBox;
