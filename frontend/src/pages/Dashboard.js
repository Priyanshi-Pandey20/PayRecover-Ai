import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            console.log(' Fetching dashboard data...');
            
            const [paymentsRes, statsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/payments'),
                axios.get('http://localhost:5000/api/stats')
            ]);
            
            console.log(' Payments:', paymentsRes.data);
            console.log(' Stats:', statsRes.data);
            
            setPayments(paymentsRes.data.data || []);
            setStats(statsRes.data.data);
        } catch (error) {
            console.error(' Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <h2>⏳ Loading dashboard...</h2>;

    const chartData = {
        labels: ['Failed', 'Recovered'],
        datasets: [
            {
                label: 'Amount (₹)',
                data: [
                    stats?.failedAmount || 0,
                    stats?.recoveredAmount || 0
                ],
                backgroundColor: ['#ff6b6b', '#4ecdc4'],
                borderColor: ['#e55a5a', '#36bdb5'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: ' Revenue Recovery Overview',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => '₹' + value,
                }
            }
        }
    };

    return (
        <div className="dashboard-page">
            <h1> Revenue Recovery Dashboard</h1>
            
            <div className="summary-cards">
                <div className="card">
                    <div className="number">{stats?.totalPayments || 0}</div>
                    <div> Total Payments</div>
                </div>
                <div className="card failed">
                    <div className="number">{stats?.failedPayments || 0}</div>
                    <div> Failed</div>
                </div>
                <div className="card recovered">
                    <div className="number">{stats?.recoveredPayments || 0}</div>
                    <div> Recovered</div>
                </div>
                <div className="card rate">
                    <div className="number">{stats?.recoveryRate || 0}%</div>
                    <div> Recovery Rate</div>
                </div>
            </div>

            <div className="recovery-stats">
                <div>
                    <strong> Money Recovered:</strong> 
                    <span style={{ color: '#4ecdc4', fontSize: '24px', marginLeft: '10px' }}>
                        ₹{stats?.recoveredAmount || 0}
                    </span>
                </div>
                <div>
                    <strong> Recovery Rate:</strong> 
                    <span style={{ color: '#ffd93d', fontSize: '24px', marginLeft: '10px' }}>
                        {stats?.recoveryRate || 0}%
                    </span>
                </div>
                <div>
                    <strong> Failed Payments:</strong> 
                    <span style={{ color: '#ff6b6b', fontSize: '24px', marginLeft: '10px' }}>
                        {stats?.failedPayments || 0}
                    </span>
                </div>
            </div>

            <div className="chart-container">
                <Bar data={chartData} options={chartOptions} />
            </div>

            <h3> Recent Transactions</h3>
            <table className="payment-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Amount</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                No payments yet.
                            </td>
                        </tr>
                    ) : (
                        payments.map((payment) => (
                            <tr key={payment._id}>
                                <td>{payment.orderId}</td>
                                <td>₹{payment.amount}</td>
                                <td>{payment.customer?.name || 'N/A'}</td>
                                <td>
                                    <span className={`status-badge status-${payment.status}`}>
                                        {payment.status === 'failed' ? 'Failed' : 
                                         payment.status === 'recovered' ? ' Recovered' : 
                                         payment.status === 'paid' ? 'Paid' : 
                                         payment.status === 'retrying' ? 'Retrying' : 
                                         ' Created'}
                                    </span>
                                </td>
                                <td>{new Date(payment.createdAt).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;