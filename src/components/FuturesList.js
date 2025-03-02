import React, { useEffect, useState } from 'react';

function FuturesList({ onSelectPair }) {
    const [futures, setFutures] = useState([]);

    useEffect(() => {
        fetch('https://contract.mexc.com/api/v1/contract/detail')
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setFutures(data.data);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    const handleSelect = (item) => {
        if (onSelectPair) onSelectPair(item);
    };

    return (
        <div className="futures-list">
            <h3>Futures Pairs</h3>
            <table>
                <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Base Coin</th>
                    <th>Quote Coin</th>
                    <th>Max Leverage</th>
                </tr>
                </thead>
                <tbody>
                {futures.map((item) => (
                    <tr key={item.symbol} onClick={() => handleSelect(item)}>
                        <td>{item.symbol}</td>
                        <td>{item.baseCoin}</td>
                        <td>{item.quoteCoin}</td>
                        <td>{item.maxLeverage}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default FuturesList;
