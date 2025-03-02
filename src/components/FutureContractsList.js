import React from 'react';

function FutureContractsList({ contracts }) {
    // Phân loại hợp đồng theo baseCoin (ví dụ)
    const grouped = contracts.reduce((acc, contract) => {
        const group = contract.baseCoin || 'Others';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(contract);
        return acc;
    }, {});

    return (
        <div>
            {Object.keys(grouped).length === 0 ? (
                <p>Loading contracts...</p>
            ) : (
                Object.keys(grouped).map((group) => (
                    <div key={group}>
                        <h4>{group}</h4>
                        <ul>
                            {grouped[group].map((contract) => (
                                <li key={contract.symbol}>
                                    <strong>{contract.displayNameEn}</strong> ({contract.symbol}) –
                                    Base: {contract.baseCoin}, Quote: {contract.quoteCoin}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
}

export default FutureContractsList;
