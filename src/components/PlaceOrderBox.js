import React, { useState } from 'react';

function PlaceOrderBox({ selectedPair, userId, lastPrice }) {
    const [orderType, setOrderType] = useState("limit"); // "limit" hoặc "market"
    const [leverage, setLeverage] = useState(1);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [tp, setTp] = useState('');
    const [sl, setSl] = useState('');

    const handleLeverageChange = (e) => {
        setLeverage(e.target.value);
    };

    const handleOrderTypeChange = (e) => {
        setOrderType(e.target.value);
    };

    const placeOrder = (longPosition) => {
        // Nếu kiểu lệnh là market thì lấy giá từ lastPrice, nếu limit thì dùng giá nhập
        const entryPrice = orderType === "market" ? lastPrice * 1.01 : price;
        const position = {
            userId,
            longPosition, // true: mua, false: bán
            symbol: selectedPair ? selectedPair.symbol : "BTC_USDT",
            entryPrice: parseFloat(entryPrice),
            quantity: parseFloat(quantity),
            leverage: parseInt(leverage),
            stopLoss: parseFloat(sl),
            takeProfit: parseFloat(tp)
        };

        fetch(process.env.REACT_APP_API_BASE_URL + "/position/open", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(position)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Order placed:", data);
                // Bạn có thể thêm xử lý hiển thị thông báo thành công
            })
            .catch((err) => console.error("Error placing order:", err));
    };

    const handleBuy = () => {
        console.log('Placing Buy order', { leverage, price, quantity, tp, sl, orderType });
        placeOrder(true);
    };

    const handleSell = () => {
        console.log('Placing Sell order', { leverage, price, quantity, tp, sl, orderType });
        placeOrder(false);
    };

    return (
        <div className="order-box">
            <h3>Place Order ({orderType === "limit" ? "Limit" : "Market"})</h3>
            <p>Selected Pair: {selectedPair ? selectedPair.symbol : 'BTC_USDT'}</p>

            <div className="order-input">
                <label>Order Type:</label>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="limit"
                            checked={orderType === "limit"}
                            onChange={handleOrderTypeChange}
                        />
                        Limit
                    </label>
                    <label style={{ marginLeft: "10px" }}>
                        <input
                            type="radio"
                            value="market"
                            checked={orderType === "market"}
                            onChange={handleOrderTypeChange}
                        />
                        Market
                    </label>
                </div>
            </div>

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
            {orderType === "limit" && (
                <div className="order-input">
                    <label>Price (USDT)</label>
                    <input
                        type="text"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
            )}
            {orderType === "market" && (
                <div className="order-input">
                    <label>Price (USDT)</label>
                    <input
                        type="text"
                        placeholder="Market Price"
                        value={lastPrice || ''}
                        disabled
                    />
                </div>
            )}
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
