import React, { useEffect, useState } from 'react';

function FuturesList({ onSelectPair }) {
    const [futures, setFutures] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Gọi API backend để lấy danh sách futures đã được cập nhật từ MEXC
        fetch(process.env.REACT_APP_API_BASE_URL + '/futures')
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setFutures(data);
                }
            })
            .catch((err) => console.error("Error fetching futures:", err));
    }, []);

    // Bộ lọc danh sách futures dựa trên displayNameEn, baseCoin, hoặc quoteCoin
    const filteredFutures = futures.filter((item) =>
        item.displayNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.baseCoin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.quoteCoin.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (item) => {
        if (onSelectPair) onSelectPair(item);
    };

    return (
        <div className="futures-list">
            <h3>Futures Pairs</h3>
            {/* Input tìm kiếm */}
            <input
                type="text"
                placeholder="Search futures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                    marginBottom: "10px",
                    width: "100%",
                    padding: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                }}
            />
            {/* Container scroll */}
            <div className="futures-table-container" style={{ maxHeight: "300px", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                        {/* Ẩn cột symbol, chỉ hiển thị displayNameEn */}
                        <th style={{ padding: "8px", textAlign: "left" }}>Display Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredFutures.length > 0 ? (
                        filteredFutures.map((item) => (
                            <tr
                                key={item.symbol}
                                onClick={() => handleSelect(item)}
                                style={{ borderBottom: "1px solid #ddd", cursor: "pointer" }}
                            >
                                <td style={{ padding: "8px" }}>{item.displayNameEn}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={{ padding: "8px" }}>No futures found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FuturesList;
