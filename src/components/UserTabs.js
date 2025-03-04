import React, { useEffect, useState } from 'react';
import { usePositionOrder } from '../contexts/PositionOrderContext';

function UserTabs() {
    const { positions, orders, setPositions, setOrders } = usePositionOrder();
    const [activeTab, setActiveTab] = useState('positions');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClosePosition = (positionId) => {
        fetch(process.env.REACT_APP_API_BASE_URL + `/position/close/${parseInt(positionId)}`, {
            method: 'POST',
        })
            .then((res) => res.json())
            .then(() => {
                setPositions(prevPositions => prevPositions.filter(position => position.id !== positionId));
            })
            .catch((err) => console.error("Error closing position:", err));
    };

    const handleCancelOrder = (orderId) => {
        fetch(process.env.REACT_APP_API_BASE_URL + `/position/cancel/${orderId}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then(() => {
                setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
            })
            .catch((err) => console.error("Error canceling order:", err));
    };

    const handleEditPosition = (position) => {
        setEditingPositionId(position.id);
        setEditTP(position.takeProfit || '');
        setEditSL(position.stopLoss || '');
        setEditEntryPrice(position.entryPrice); // Khởi tạo entryPrice khi chỉnh sửa
    };

    // Các state chỉnh sửa vị thế và order
    const [editingPositionId, setEditingPositionId] = useState(null);
    const [editTP, setEditTP] = useState('');
    const [editSL, setEditSL] = useState('');
    const [editEntryPrice, setEditEntryPrice] = useState('');
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [editOrderTP, setEditOrderTP] = useState('');
    const [editOrderSL, setEditOrderSL] = useState('');

    const handleSavePosition = (position) => {
        fetch(process.env.REACT_APP_API_BASE_URL + `/position/update`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: parseInt(position.id),
                entryPrice: parseFloat(editEntryPrice),
                takeProfit: parseFloat(editTP),
                stopLoss: parseFloat(editSL)
            })
        })
            .then((res) => res.json())
            .then((updatedPosition) => {
                setPositions(prevPositions =>
                    prevPositions.map(pos =>
                        pos.id === position.id
                            ? {
                                ...pos,
                                entryPrice: updatedPosition.entryPrice,
                                takeProfit: updatedPosition.takeProfit,
                                stopLoss: updatedPosition.stopLoss
                            }
                            : pos
                    )
                );
                setEditingPositionId(null);
            })
            .catch((err) => console.error("Error updating position:", err));
    };

    const handleEditOrder = (order) => {
        setEditingOrderId(order.id);
        setEditOrderTP(order.takeProfit || '');
        setEditOrderSL(order.stopLoss || '');
    };

    const handleSaveOrder = (order) => {
        fetch(process.env.REACT_APP_API_BASE_URL + `/order/update`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: order.id,
                takeProfit: parseFloat(editOrderTP),
                stopLoss: parseFloat(editOrderSL)
            })
        })
            .then((res) => res.json())
            .then((updatedOrder) => {
                setOrders(prevOrders =>
                    prevOrders.map(o =>
                        o.id === order.id
                            ? { ...o, takeProfit: updatedOrder.takeProfit, stopLoss: updatedOrder.stopLoss }
                            : o
                    )
                );
                setEditingOrderId(null);
            })
            .catch((err) => console.error("Error updating order:", err));
    };

    // Layout cho desktop: sử dụng bảng
    const renderDesktopPositions = () => (
        <table>
            <thead>
            <tr>
                <th>Symbol</th>
                <th>Quantity</th>
                <th>Entry Price</th>
                <th>Fair Price</th>
                <th>Last Price</th>
                <th>TP/SL</th>
                <th>PNL</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {positions.length > 0 ? (
                positions.map((pos) => (
                    <tr key={pos.id}>
                        <td>{pos.symbol}</td>
                        <td>{pos.quantity}</td>
                        <td>{pos.entryPrice}</td>
                        <td>{pos.fairPrice || '-'}</td>
                        <td>{pos.lastPrice || '-'}</td>
                        <td>
                            {editingPositionId === pos.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editTP}
                                        onChange={(e) => setEditTP(e.target.value)}
                                        placeholder="TP"
                                    />
                                    <input
                                        type="text"
                                        value={editSL}
                                        onChange={(e) => setEditSL(e.target.value)}
                                        placeholder="SL"
                                    />
                                </>
                            ) : (
                                (pos.takeProfit || '-') + '/' + (pos.stopLoss || '-')
                            )}
                        </td>
                        <td>{pos.pnl.toFixed(3)}</td>
                        <td>
                            {editingPositionId === pos.id ? (
                                <button onClick={() => handleSavePosition(pos)}>Save</button>
                            ) : (
                                <>
                                    <button onClick={() => handleEditPosition(pos)}>Edit</button>
                                    <button onClick={() => handleClosePosition(pos.id)}>Close</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="8">No positions found</td>
                </tr>
            )}
            </tbody>
        </table>
    );

    // Layout cho mobile: chuyển các hàng thành card
    const renderMobilePositions = () => (
        <div>
            {positions.length > 0 ? (
                positions.map((pos) => (
                    <div key={pos.id} className="position-card">
                        <p><strong>Symbol:</strong> {pos.symbol}</p>
                        <p><strong>Quantity:</strong> {pos.quantity}</p>
                        <p><strong>Entry Price:</strong> {pos.entryPrice}</p>
                        <p><strong>Fair Price:</strong> {pos.fairPrice || '-'}</p>
                        <p><strong>Last Price:</strong> {pos.lastPrice || '-'}</p>
                        <p><strong>TP/SL:</strong> {(pos.takeProfit || '-') + '/' + (pos.stopLoss || '-')}</p>
                        <p><strong>PNL:</strong> {pos.pnl.toFixed(3)}</p>
                        <div className="card-actions">
                            {editingPositionId === pos.id ? (
                                <button onClick={() => handleSavePosition(pos)}>Save</button>
                            ) : (
                                <>
                                    <button onClick={() => handleEditPosition(pos)}>Edit</button>
                                    <button onClick={() => handleClosePosition(pos.id)}>Close</button>
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>No positions found</p>
            )}
        </div>
    );

    const renderDesktopOrders = () => (
        <table>
            <thead>
            <tr>
                <th>Symbol</th>
                <th>Entry Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>TP/SL</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {orders.length > 0 ? (
                orders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.symbol}</td>
                        <td>
                            {editingOrderId === order.id ? (
                                <input
                                    type="text"
                                    value={editEntryPrice}
                                    onChange={(e) => setEditEntryPrice(e.currentTarget.value)}
                                    placeholder="Entry Price"
                                />
                            ) : (
                                order.entryPrice
                            )}
                        </td>
                        <td>{order.quantity}</td>
                        <td>{order.status}</td>
                        <td>
                            {editingOrderId === order.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editOrderTP}
                                        onChange={(e) => setEditOrderTP(e.target.value)}
                                        placeholder="TP"
                                    />
                                    <input
                                        type="text"
                                        value={editOrderSL}
                                        onChange={(e) => setEditOrderSL(e.target.value)}
                                        placeholder="SL"
                                    />
                                </>
                            ) : (
                                (order.takeProfit || '-') + '/' + (order.stopLoss || '-')
                            )}
                        </td>
                        <td>
                            {editingOrderId === order.id ? (
                                <button onClick={() => handleSaveOrder(order)}>Save</button>
                            ) : (
                                <>
                                    <button onClick={() => handleEditOrder(order)}>Edit</button>
                                    <button onClick={() => handleCancelOrder(order.id)}>Cancel</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="6">No orders found</td>
                </tr>
            )}
            </tbody>
        </table>
    );

    const renderMobileOrders = () => (
        <div>
            {orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <p><strong>Symbol:</strong> {order.symbol}</p>
                        <p><strong>Entry Price:</strong> {order.entryPrice}</p>
                        <p><strong>Quantity:</strong> {order.quantity}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p>
                            <strong>TP/SL:</strong>{" "}
                            {editingOrderId === order.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editOrderTP}
                                        onChange={(e) => setEditOrderTP(e.target.value)}
                                        placeholder="TP"
                                    />
                                    <input
                                        type="text"
                                        value={editOrderSL}
                                        onChange={(e) => setEditOrderSL(e.target.value)}
                                        placeholder="SL"
                                    />
                                </>
                            ) : (
                                (order.takeProfit || '-') + '/' + (order.stopLoss || '-')
                            )}
                        </p>
                        <div className="card-actions">
                            {editingOrderId === order.id ? (
                                <button onClick={() => handleSaveOrder(order)}>Save</button>
                            ) : (
                                <>
                                    <button onClick={() => handleEditOrder(order)}>Edit</button>
                                    <button onClick={() => handleCancelOrder(order.id)}>Cancel</button>
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>No orders found</p>
            )}
        </div>
    );

    return (
        <div className="user-tabs">
            <div className="tabs">
                <button
                    className={activeTab === 'positions' ? 'active' : ''}
                    onClick={() => setActiveTab('positions')}
                >
                    Positions
                </button>
                <button
                    className={activeTab === 'orders' ? 'active' : ''}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'positions' &&
                    (isMobile ? renderMobilePositions() : renderDesktopPositions())}
                {activeTab === 'orders' &&
                    (isMobile ? renderMobileOrders() : renderDesktopOrders())}
            </div>
        </div>
    );
}

export default UserTabs;
