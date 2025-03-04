import React, {useEffect, useState} from 'react';
import {usePositionOrder} from '../contexts/PositionOrderContext';

function WalletInfo({userId}) {
    const {positions} = usePositionOrder();
    const [wallet, setWallet] = useState({balance: 0});
    const [unrealized, setUnrealized] = useState(0);
    const totalPnl = positions.reduce((acc, pos) => acc + (pos.pnl || 0), 0);

    // Gọi API lấy thông tin ví mỗi khi userId hoặc positions thay đổi (đóng lệnh cập nhật positions)
    useEffect(() => {
        fetch(process.env.REACT_APP_API_BASE_URL + `/wallet/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setWallet(data);
                }
            })
            .catch((err) => console.error('Error fetching wallet:', err));
    }, [userId, positions]);

    useEffect(() => {
        setUnrealized(wallet.balance + totalPnl);
    }, [wallet, positions, totalPnl]);

    return (
        <div className="wallet-info">
            <h4>Wallet</h4>
            <p>Balance: {wallet.balance.toFixed(2)} USDT</p>
            <p>Unrealized Balance: {unrealized.toFixed(2)} USDT</p>
                <p>Unrealized PNL: {totalPnl.toFixed(4)} USDT</p>
        </div>
    );
}

export default WalletInfo;
