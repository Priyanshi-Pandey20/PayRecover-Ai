import axios from 'axios';

//  CORRECT URL - Use http://localhost:5000 NOT https://localhost:8080
const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
    //  Remove withCredentials to avoid CORS issues
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log(' Request:', config.method.toUpperCase(), config.url);
        console.log(' Request Data:', config.data);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log(' Response:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error(' Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export const createOrder = async (amount, customer) => {
    console.log(' createOrder called with:', { amount, customer });
    
    try {
        const payload = {
            amount: amount,
            currency: 'INR',
            customer: customer
        };
        console.log(' Sending payload:', payload);
        
        const response = await api.post('/payment/create-order', payload);
        console.log(' createOrder response:', response.data);
        return response.data;
    } catch (error) {
        console.error(' createOrder error:', error.response?.data || error.message);
        throw error;
    }
};

export const verifyPayment = async (paymentData) => {
    try {
        const response = await api.post('/payment/verify-payment', paymentData);
        return response.data;
    } catch (error) {
        console.error('Verify payment error:', error);
        throw error;
    }
};

export const getPayments = async () => {
    try {
        const response = await api.get('/payments');
        return response.data;
    } catch (error) {
        console.error('Get payments error:', error);
        throw error;
    }
};

export const getStats = async () => {
    try {
        const response = await api.get('/stats');
        return response.data;
    } catch (error) {
        console.error('Get stats error:', error);
        throw error;
    }
};

export default api;