import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';

const PositionOrderContext = createContext();

export const usePositionOrder = () => useContext(PositionOrderContext);

export const PositionOrderProvider = ({ userId, children }) => {
    const [positions, setPositions] = useState([]);
    const [orders, setOrders] = useState([]);
    // Fetch dữ liệu ban đầu cho positions và orders
    useEffect(() => {
        fetch(process.env.REACT_APP_API_BASE_URL + `/position/${userId}/OPEN`)
            .then((res) => res.json())
            .then((data) => setPositions(data))
            .catch((err) => console.error("Error fetching positions:", err));

        fetch(process.env.REACT_APP_API_BASE_URL + `/position/${userId}/ORDERED`)
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch((err) => console.error("Error fetching orders:", err));
    }, [userId]);

    // Kết nối WS backend với STOMP để nhận cập nhật từ backend
    useEffect(() => {
        const client = new Client({
            brokerURL: process.env.REACT_APP_WS_BASE_URL+'?userId=' + userId,
            debug: (str) => { console.log(str); },
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            client.subscribe('/user/' + userId + '/queue/notify', (message) => {
                try {
                    const update = JSON.parse(message.body);
                    console.log("Received WS update:", update);
                    setPositions((prevPositions) => {
                        const index = prevPositions.findIndex((p) => p.id === update.id);
                        if (index !== -1) {
                            if (update.status !== "OPEN") {
                                return prevPositions.filter((p) => p.id !== update.id);
                            } else {
                                const newPositions = [...prevPositions];
                                newPositions[index] = { ...newPositions[index], pnl: update.pnl, fairPrice: update.fairPrice, lastPrice: update.lastPrice };
                                return newPositions;
                            }
                        } else {
                            if (update.status === "OPEN") {
                                return [...prevPositions, update];
                            }
                            return prevPositions;
                        }
                    });
                    setOrders((prevOrders) => {
                        const index = prevOrders.findIndex((p) => p.id === update.id);
                        if (index !== -1) {
                            if (update.status !== "ORDERED") {
                                return prevOrders.filter((p) => p.id !== update.id);
                            }
                        } else {
                            if (update.status === "ORDERED") {
                                return [...prevOrders, update];
                            }
                        }
                        return prevOrders;
                    });
                    // Nếu cần cập nhật orders thì xử lý thêm tại đây
                } catch (error) {
                    console.error("Error processing WS update:", error);
                }
            });
        };

        client.activate();
        return () => client.deactivate();
    }, [userId]);

    return (
        <PositionOrderContext.Provider value={{ positions, orders, setPositions, setOrders }}>
            {children}
        </PositionOrderContext.Provider>
    );
};
