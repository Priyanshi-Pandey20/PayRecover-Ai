import React from 'react';

const SummaryCards = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="summary-cards">
            <div className="card">
                <div className="number">{stats.totalPayments || 0}</div>
                <div> Total Payments</div>
            </div>
            <div className="card failed">
                <div className="number">{stats.failedPayments || 0}</div>
                <div> Failed</div>
            </div>
            <div className="card recovered">
                <div className="number">{stats.recoveredPayments || 0}</div>
                <div> Recovered</div>
            </div>
            <div className="card rate">
                <div className="number">{stats.recoveryRate || 0}%</div>
                <div> Recovery Rate</div>
            </div>
        </div>
    );
};

export default SummaryCards;