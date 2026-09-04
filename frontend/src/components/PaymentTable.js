import React from 'react';

const PaymentTable = ({ payments }) => {
    const getStatusBadge = (status) => {
        const statusMap = {
            'paid': ' Paid',
            'failed': ' Failed',
            'recovered': ' Recovered',
            'retrying': 'Retrying',
            'created': ' Created'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        return `status-badge status-${status}`;
    };

    if (payments.length === 0) {
        return <p style={{ textAlign: 'center', padding: '20px' }}>No payments yet.</p>;
    }

    return (
        <table className="payment-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Recovery Link</th>
                </tr>
            </thead>
            <tbody>
                {payments.map((payment) => (
                    <tr key={payment._id}>
                        <td>{payment.orderId}</td>
                        <td>₹{payment.amount}</td>
                        <td>{payment.customer?.name || 'N/A'}</td>
                        <td>
                            <span className={getStatusClass(payment.status)}>
                                {getStatusBadge(payment.status)}
                            </span>
                        </td>
                        <td>{new Date(payment.createdAt).toLocaleString()}</td>
                        <td>
                            {payment.recoveryLink ? (
                                <a href={payment.recoveryLink} target="_blank" rel="noopener noreferrer">
                                     Link
                                </a>
                            ) : '-'}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PaymentTable;