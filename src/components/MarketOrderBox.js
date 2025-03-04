import React, { useEffect, useState } from 'react';

function MarketOrderBox({ selectedPair, onPriceUpdate }) {
    const [priceData, setPriceData] = useState({ fairPrice: null, lastPrice: null });

    useEffect(() => {
        const symbolToSubscribe = selectedPair && selectedPair.symbol ? selectedPair.symbol : "BTC_USDT";
        const mexcWs = new WebSocket("wss://contract.mexc.com/edge");

        mexcWs.onopen = () => {
            console.log("Connected to MEXC WS for price updates");
            const subscribeMsg = JSON.stringify({
                method: "sub.ticker",
                param: { symbol: symbolToSubscribe }
            });
            mexcWs.send(subscribeMsg);
        };

        mexcWs.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (
                    message.channel &&
                    message.channel.endsWith("ticker") &&
                    message.data &&
                    message.symbol === symbolToSubscribe
                ) {
                    const newFairPrice = message.data.fairPrice;
                    const newLastPrice = message.data.lastPrice;
                    setPriceData({ fairPrice: newFairPrice, lastPrice: newLastPrice });
                    if (onPriceUpdate) {
                        onPriceUpdate(newLastPrice);
                    }
                }
            } catch (error) {
                console.error("Error parsing MEXC WS message:", error);
            }
        };

        mexcWs.onerror = (error) => {
            console.error("MEXC WS error:", error);
        };

        return () => {
            mexcWs.close();
        };
    }, [selectedPair, onPriceUpdate]);

    return (
        <div className="market-order-box">
            <h3>Market Order</h3>
            <p>Selected Pair: {selectedPair ? selectedPair.symbol : 'BTC_USDT'}</p>
            <p>Fair Price: {priceData.fairPrice !== null ? priceData.fairPrice : '-'}</p>
            <p>Last Price: {priceData.lastPrice !== null ? priceData.lastPrice : '-'}</p>
        </div>
    );
}

export default MarketOrderBox;
