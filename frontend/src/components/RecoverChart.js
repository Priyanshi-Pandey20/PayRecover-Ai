import React from 'react';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RecoverChart = ({ stats }) => {
    if (!stats) {
        return <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
            No data to display
        </p>;
    }

    const data = {
        labels: ['Failed', 'Recovered'],
        datasets: [
            {
                label: 'Amount (₹)',
                data: [
                    stats.failedAmount || 0,
                    stats.recoveredAmount || 0
                ],
                backgroundColor: ['#f87171', '#22c55e'],
                borderColor: ['#ef4444', '#16a34a'],
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#e2e8f0',
                    font: { size: 14 }
                }
            },
            title: {
                display: true,
                text: ' Revenue Recovery Overview',
                color: '#e2e8f0',
                font: { size: 18, weight: 'bold' }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#94a3b8',
                    callback: (value) => '₹' + value,
                },
                grid: {
                    color: 'rgba(255,255,255,0.05)'
                }
            },
            x: {
                ticks: {
                    color: '#94a3b8',
                    font: { size: 14 }
                },
                grid: {
                    color: 'rgba(255,255,255,0.05)'
                }
            }
        }
    };

    return <Bar data={data} options={options} />;
};

export default RecoverChart;