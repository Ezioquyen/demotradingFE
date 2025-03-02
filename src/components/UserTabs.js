import React, { useState } from 'react';

function UserTabs() {
    const [activeTab, setActiveTab] = useState('positions');

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
                {activeTab === 'positions' && (
                    <div>
                        <table>
                            <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Quantity</th>
                                <th>Entry Price</th>
                                <th>PNL</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* Demo data */}
                            <tr>
                                <td>BTC_USDT</td>
                                <td>0.01</td>
                                <td>17000</td>
                                <td>+10 USDT</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === 'orders' && (
                    <div>
                        <table>
                            <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* Demo data */}
                            <tr>
                                <td>BTC_USDT</td>
                                <td>Limit Buy</td>
                                <td>16500</td>
                                <td>0.02</td>
                                <td>Pending</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserTabs;
