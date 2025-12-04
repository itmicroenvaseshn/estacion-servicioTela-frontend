// Mock data for Estación de Servicio Tela Dashboard

const mockData = {
    // Sales data for the last 30 days
    salesHistory: [],
    
    // Top clients with complete data
    clients: [
        { id: 1, name: 'Transportes del Norte S.A.', totalPurchases: 125000, lastPurchase: '2024-12-03', fuelType: 'Diesel', visits: 45, status: 'VIP' },
        { id: 2, name: 'Distribuidora La Ceiba', totalPurchases: 98500, lastPurchase: '2024-12-04', fuelType: 'Regular', visits: 38, status: 'VIP' },
        { id: 3, name: 'Agroindustrias del Valle', totalPurchases: 87300, lastPurchase: '2024-12-02', fuelType: 'Diesel', visits: 32, status: 'Premium' },
        { id: 4, name: 'Construcciones Modernas', totalPurchases: 76200, lastPurchase: '2024-12-04', fuelType: 'Diesel', visits: 28, status: 'Premium' },
        { id: 5, name: 'Supermercados La Economía', totalPurchases: 65400, lastPurchase: '2024-12-01', fuelType: 'Super', visits: 25, status: 'Regular' },
        { id: 6, name: 'Taxi Express Tela', totalPurchases: 54800, lastPurchase: '2024-12-04', fuelType: 'Regular', visits: 89, status: 'Regular' },
        { id: 7, name: 'Hotel Playa Dorada', totalPurchases: 48900, lastPurchase: '2024-12-03', fuelType: 'Super', visits: 22, status: 'Regular' },
        { id: 8, name: 'Panadería San José', totalPurchases: 42300, lastPurchase: '2024-12-04', fuelType: 'Regular', visits: 67, status: 'Regular' },
        { id: 9, name: 'Farmacia Popular', totalPurchases: 38700, lastPurchase: '2024-11-30', fuelType: 'Regular', visits: 18, status: 'Regular' },
        { id: 10, name: 'Inversiones Caribeñas', totalPurchases: 35600, lastPurchase: '2024-12-02', fuelType: 'Diesel', visits: 15, status: 'Regular' },
        { id: 11, name: 'Pescadería El Muelle', totalPurchases: 29800, lastPurchase: '2024-12-03', fuelType: 'Diesel', visits: 21, status: 'Regular' },
        { id: 12, name: 'Escuela Técnica Nacional', totalPurchases: 24500, lastPurchase: '2024-12-01', fuelType: 'Regular', visits: 12, status: 'Regular' }
    ],
    
    // Recent transactions
    recentTransactions: [],
    
    // CAI and talonarios information
    cai: {
        caiNumber: 'A1B2C3-D4E5F6-789012',
        rangeStart: '000001',
        rangeEnd: '050000',
        currentNumber: '012847',
        expirationDate: '2025-06-30',
        issueDate: '2024-06-30',
        status: 'Activo'
    },
    
    // Fuel inventory levels
    fuelInventory: {
        regular: { current: 8500, capacity: 10000, unit: 'galones', lastUpdate: new Date() },
        super: { current: 6200, capacity: 8000, unit: 'galones', lastUpdate: new Date() },
        diesel: { current: 9800, capacity: 12000, unit: 'galones', lastUpdate: new Date() }
    },
    
    // Product mix percentages
    productMix: {
        regular: 45,
        super: 25,
        diesel: 30
    },
    
    // Peak hours heatmap data (hours 0-23, days 0-6)
    peakHours: [],
    
    // Alerts
    alerts: [
        { id: 1, type: 'critical', title: 'Inventario Bajo', message: 'Combustible Super por debajo del 80% de capacidad', timestamp: new Date(Date.now() - 1000 * 60 * 30), read: false },
        { id: 2, type: 'high', title: 'CAI Próximo a Vencer', message: 'El CAI actual vencerá en 6 meses', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), read: false },
        { id: 3, type: 'medium', title: 'Factura Pendiente', message: 'Cliente Transportes del Norte tiene factura pendiente', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), read: true },
        { id: 4, type: 'info', title: 'Actualización Disponible', message: 'Nueva versión del sistema disponible', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), read: true },
        { id: 5, type: 'high', title: 'Meta Mensual', message: 'Se ha alcanzado el 95% de la meta mensual', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), read: false }
    ]
};

// Initialize sales history for last 30 days
function initializeSalesHistory() {
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Random sales between 80,000 and 150,000
        const dailySales = Math.floor(Math.random() * 70000) + 80000;
        
        mockData.salesHistory.push({
            date: date.toISOString().split('T')[0],
            total: dailySales,
            regular: Math.floor(dailySales * 0.45),
            super: Math.floor(dailySales * 0.25),
            diesel: Math.floor(dailySales * 0.30),
            transactions: Math.floor(Math.random() * 50) + 100
        });
    }
}

// Initialize peak hours heatmap
function initializePeakHours() {
    for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
            let intensity;
            // Morning peak (6-9)
            if (hour >= 6 && hour <= 9) {
                intensity = Math.floor(Math.random() * 30) + 70;
            }
            // Evening peak (16-19)
            else if (hour >= 16 && hour <= 19) {
                intensity = Math.floor(Math.random() * 25) + 65;
            }
            // Night (22-5)
            else if (hour >= 22 || hour <= 5) {
                intensity = Math.floor(Math.random() * 20) + 10;
            }
            // Regular hours
            else {
                intensity = Math.floor(Math.random() * 30) + 40;
            }
            
            mockData.peakHours.push({ day, hour, value: intensity });
        }
    }
}

// Initialize recent transactions
function initializeTransactions() {
    const fuelTypes = ['Regular', 'Super', 'Diesel'];
    const now = new Date();
    
    for (let i = 0; i < 20; i++) {
        const timestamp = new Date(now - Math.random() * 1000 * 60 * 60 * 24);
        const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
        const gallons = (Math.random() * 50 + 10).toFixed(2);
        const pricePerGallon = fuelType === 'Regular' ? 95 : fuelType === 'Super' ? 105 : 98;
        const amount = (gallons * pricePerGallon).toFixed(2);
        
        mockData.recentTransactions.push({
            id: 1000 + i,
            timestamp,
            fuelType,
            gallons: parseFloat(gallons),
            amount: parseFloat(amount),
            client: mockData.clients[Math.floor(Math.random() * mockData.clients.length)].name,
            paymentMethod: Math.random() > 0.5 ? 'Efectivo' : 'Tarjeta'
        });
    }
    
    // Sort by timestamp descending
    mockData.recentTransactions.sort((a, b) => b.timestamp - a.timestamp);
}

// Generate a new random transaction
function generateNewTransaction() {
    const fuelTypes = ['Regular', 'Super', 'Diesel'];
    const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
    const gallons = (Math.random() * 50 + 10).toFixed(2);
    const pricePerGallon = fuelType === 'Regular' ? 95 : fuelType === 'Super' ? 105 : 98;
    const amount = (gallons * pricePerGallon).toFixed(2);
    
    return {
        id: Date.now(),
        timestamp: new Date(),
        fuelType,
        gallons: parseFloat(gallons),
        amount: parseFloat(amount),
        client: mockData.clients[Math.floor(Math.random() * mockData.clients.length)].name,
        paymentMethod: Math.random() > 0.5 ? 'Efectivo' : 'Tarjeta'
    };
}

// Initialize all data
initializeSalesHistory();
initializePeakHours();
initializeTransactions();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mockData, generateNewTransaction };
}
