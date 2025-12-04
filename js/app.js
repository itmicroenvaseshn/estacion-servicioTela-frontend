// Main application logic for Estación de Servicio Tela Dashboard

class DashboardApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.searchQuery = '';
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        this.sidebarOpen = window.innerWidth > 768;
        this.simulationInterval = null;
        this.clockInterval = null;
    }
    
    // Initialize the application
    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.startClock();
        this.startSimulation();
        this.updateKPIs();
        this.renderSection(this.currentSection);
        
        // Initialize charts after a short delay to ensure DOM is ready
        setTimeout(() => {
            chartManager.initializeCharts();
        }, 100);
    }
    
    // Setup all event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });
        
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        }
        
        // Sales chart filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.updateSalesFilter(filter);
            });
        });
        
        // Client search
        const clientSearch = document.getElementById('clientSearch');
        if (clientSearch) {
            clientSearch.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.renderClientsTable();
            });
        }
        
        // Export buttons
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToCSV());
        }
        
        // Window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && !this.sidebarOpen) {
                this.sidebarOpen = true;
                document.body.classList.remove('sidebar-closed');
            }
        });
        
        // Alert actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('alert-close')) {
                const alertId = parseInt(e.target.getAttribute('data-id'));
                this.removeAlert(alertId);
            }
            if (e.target.classList.contains('alert-mark-read')) {
                const alertId = parseInt(e.target.getAttribute('data-id'));
                this.markAlertAsRead(alertId);
            }
        });
    }
    
    // Navigate to a section
    navigateToSection(section) {
        this.currentSection = section;
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === section) {
                link.classList.add('active');
            }
        });
        
        // Render section
        this.renderSection(section);
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            this.toggleSidebar();
        }
    }
    
    // Render the current section
    renderSection(section) {
        // Hide all sections
        document.querySelectorAll('.section-content').forEach(sec => {
            sec.style.display = 'none';
        });
        
        // Show current section
        const currentSec = document.getElementById(`${section}Section`);
        if (currentSec) {
            currentSec.style.display = 'block';
        }
        
        // Render section-specific content
        switch(section) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'ventas':
                this.renderVentas();
                break;
            case 'clientes':
                this.renderClientes();
                break;
            case 'reportes':
                this.renderReportes();
                break;
            case 'alertas':
                this.renderAlertas();
                break;
            case 'cai':
                this.renderCAI();
                break;
            case 'configuracion':
                this.renderConfiguracion();
                break;
        }
    }
    
    // Render dashboard section
    renderDashboard() {
        this.updateKPIs();
        this.renderRecentTransactions();
        this.renderTopClients();
        
        // Reinitialize charts if needed
        setTimeout(() => {
            if (!chartManager.charts.sales) {
                chartManager.initializeCharts();
            }
        }, 100);
    }
    
    // Render ventas section
    renderVentas() {
        this.renderSalesTable();
    }
    
    // Render clientes section
    renderClientes() {
        this.renderClientsTable();
    }
    
    // Render reportes section
    renderReportes() {
        this.renderReportsContent();
    }
    
    // Render alertas section
    renderAlertas() {
        this.renderAllAlerts();
    }
    
    // Render CAI section
    renderCAI() {
        this.renderCAIInfo();
    }
    
    // Render configuracion section
    renderConfiguracion() {
        this.renderSettings();
    }
    
    // Update KPIs
    updateKPIs() {
        // Calculate today's sales
        const today = mockData.salesHistory[mockData.salesHistory.length - 1];
        const yesterday = mockData.salesHistory[mockData.salesHistory.length - 2];
        
        // Total sales today
        const totalSalesToday = today ? today.total : 0;
        const percentChange = yesterday ? ((totalSalesToday - yesterday.total) / yesterday.total * 100).toFixed(1) : 0;
        
        document.getElementById('totalSales').textContent = 'L. ' + totalSalesToday.toLocaleString('es-HN');
        document.getElementById('salesChange').textContent = percentChange + '%';
        document.getElementById('salesChange').className = percentChange >= 0 ? 'positive' : 'negative';
        
        // Transactions
        const totalTransactions = today ? today.transactions : 0;
        document.getElementById('totalTransactions').textContent = totalTransactions;
        
        // Active clients (using visits from clients)
        const activeClients = mockData.clients.length;
        document.getElementById('activeClients').textContent = activeClients;
        
        // Average ticket
        const avgTicket = totalTransactions > 0 ? totalSalesToday / totalTransactions : 0;
        document.getElementById('avgTicket').textContent = 'L. ' + avgTicket.toFixed(2);
    }
    
    // Render recent transactions
    renderRecentTransactions() {
        const container = document.getElementById('recentTransactions');
        if (!container) return;
        
        const transactions = mockData.recentTransactions.slice(0, 10);
        
        let html = '';
        transactions.forEach(tx => {
            const time = tx.timestamp.toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' });
            html += `
                <div class="transaction-item">
                    <div class="transaction-icon ${tx.fuelType.toLowerCase()}">${tx.fuelType.charAt(0)}</div>
                    <div class="transaction-details">
                        <div class="transaction-client">${tx.client}</div>
                        <div class="transaction-info">${tx.gallons} gal - ${tx.paymentMethod}</div>
                    </div>
                    <div class="transaction-amount">
                        <div class="amount">L. ${tx.amount.toLocaleString('es-HN')}</div>
                        <div class="time">${time}</div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    // Render top clients
    renderTopClients() {
        const container = document.getElementById('topClients');
        if (!container) return;
        
        const topClients = mockData.clients.slice(0, 5);
        
        let html = '';
        topClients.forEach((client, index) => {
            html += `
                <div class="client-row">
                    <div class="client-rank">${index + 1}</div>
                    <div class="client-info">
                        <div class="client-name">${client.name}</div>
                        <div class="client-meta">${client.visits} visitas</div>
                    </div>
                    <div class="client-amount">L. ${client.totalPurchases.toLocaleString('es-HN')}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    // Render clients table with pagination
    renderClientsTable() {
        const container = document.getElementById('clientsTableBody');
        if (!container) return;
        
        // Filter clients
        let filteredClients = mockData.clients;
        if (this.searchQuery) {
            filteredClients = mockData.clients.filter(client => 
                client.name.toLowerCase().includes(this.searchQuery) ||
                client.fuelType.toLowerCase().includes(this.searchQuery) ||
                client.status.toLowerCase().includes(this.searchQuery)
            );
        }
        
        // Pagination
        const totalPages = Math.ceil(filteredClients.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageClients = filteredClients.slice(startIndex, endIndex);
        
        // Render table rows
        let html = '';
        pageClients.forEach(client => {
            html += `
                <tr>
                    <td>${client.name}</td>
                    <td>L. ${client.totalPurchases.toLocaleString('es-HN')}</td>
                    <td>${client.lastPurchase}</td>
                    <td>${client.fuelType}</td>
                    <td>${client.visits}</td>
                    <td><span class="badge badge-${client.status.toLowerCase()}">${client.status}</span></td>
                </tr>
            `;
        });
        
        container.innerHTML = html;
        
        // Update pagination
        this.renderPagination(totalPages);
    }
    
    // Render pagination
    renderPagination(totalPages) {
        const container = document.getElementById('pagination');
        if (!container) return;
        
        let html = '';
        
        // Previous button
        html += `<button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                 onclick="app.changePage(${this.currentPage - 1})">Anterior</button>`;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                         onclick="app.changePage(${i})">${i}</button>`;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                html += '<span class="pagination-ellipsis">...</span>';
            }
        }
        
        // Next button
        html += `<button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                 onclick="app.changePage(${this.currentPage + 1})">Siguiente</button>`;
        
        container.innerHTML = html;
    }
    
    // Change page
    changePage(page) {
        this.currentPage = page;
        this.renderClientsTable();
    }
    
    // Render sales table
    renderSalesTable() {
        const container = document.getElementById('salesTableBody');
        if (!container) return;
        
        let html = '';
        mockData.salesHistory.slice(-15).reverse().forEach(sale => {
            const total = sale.total;
            html += `
                <tr>
                    <td>${sale.date}</td>
                    <td>L. ${sale.regular.toLocaleString('es-HN')}</td>
                    <td>L. ${sale.super.toLocaleString('es-HN')}</td>
                    <td>L. ${sale.diesel.toLocaleString('es-HN')}</td>
                    <td>${sale.transactions}</td>
                    <td class="font-semibold">L. ${total.toLocaleString('es-HN')}</td>
                </tr>
            `;
        });
        
        container.innerHTML = html;
    }
    
    // Render all alerts
    renderAllAlerts() {
        const container = document.getElementById('allAlerts');
        if (!container) return;
        
        let html = '';
        mockData.alerts.forEach(alert => {
            const time = alert.timestamp.toLocaleString('es-HN', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            html += `
                <div class="alert-item alert-${alert.type} ${alert.read ? 'read' : ''}">
                    <div class="alert-header">
                        <span class="alert-badge">${this.getAlertTypeLabel(alert.type)}</span>
                        <span class="alert-time">${time}</span>
                    </div>
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-actions">
                        ${!alert.read ? `<button class="alert-mark-read" data-id="${alert.id}">Marcar como leída</button>` : ''}
                        <button class="alert-close" data-id="${alert.id}">Cerrar</button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html || '<p class="text-center text-gray-500">No hay alertas</p>';
        this.updateAlertBadge();
    }
    
    // Get alert type label
    getAlertTypeLabel(type) {
        const labels = {
            critical: 'Crítica',
            high: 'Alta',
            medium: 'Media',
            info: 'Info'
        };
        return labels[type] || type;
    }
    
    // Remove alert
    removeAlert(alertId) {
        const index = mockData.alerts.findIndex(a => a.id === alertId);
        if (index !== -1) {
            mockData.alerts.splice(index, 1);
            this.renderAllAlerts();
            this.showToast('Alerta eliminada', 'info');
        }
    }
    
    // Mark alert as read
    markAlertAsRead(alertId) {
        const alert = mockData.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.read = true;
            this.renderAllAlerts();
        }
    }
    
    // Update alert badge
    updateAlertBadge() {
        const unreadCount = mockData.alerts.filter(a => !a.read).length;
        const badge = document.querySelector('.alert-badge-count');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }
    
    // Render CAI information
    renderCAIInfo() {
        const container = document.getElementById('caiInfo');
        if (!container) return;
        
        const cai = mockData.cai;
        const used = parseInt(cai.currentNumber);
        const total = parseInt(cai.rangeEnd);
        const percentUsed = ((used / total) * 100).toFixed(1);
        
        container.innerHTML = `
            <div class="cai-card">
                <div class="cai-header">
                    <h3>Información del CAI</h3>
                    <span class="badge badge-${cai.status === 'Activo' ? 'success' : 'warning'}">${cai.status}</span>
                </div>
                <div class="cai-details">
                    <div class="cai-row">
                        <span class="label">Número CAI:</span>
                        <span class="value">${cai.caiNumber}</span>
                    </div>
                    <div class="cai-row">
                        <span class="label">Rango:</span>
                        <span class="value">${cai.rangeStart} - ${cai.rangeEnd}</span>
                    </div>
                    <div class="cai-row">
                        <span class="label">Correlativo Actual:</span>
                        <span class="value">${cai.currentNumber}</span>
                    </div>
                    <div class="cai-row">
                        <span class="label">Fecha de Emisión:</span>
                        <span class="value">${cai.issueDate}</span>
                    </div>
                    <div class="cai-row">
                        <span class="label">Fecha de Vencimiento:</span>
                        <span class="value">${cai.expirationDate}</span>
                    </div>
                </div>
                <div class="cai-progress">
                    <div class="progress-label">Uso de Talonario: ${percentUsed}%</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentUsed}%"></div>
                    </div>
                    <div class="progress-info">${used.toLocaleString()} de ${total.toLocaleString()} facturas utilizadas</div>
                </div>
            </div>
        `;
    }
    
    // Render settings
    renderSettings() {
        const container = document.getElementById('settingsContent');
        if (!container) return;
        
        container.innerHTML = `
            <div class="settings-section">
                <h3>Apariencia</h3>
                <div class="setting-item">
                    <label>Modo Oscuro</label>
                    <button class="toggle-btn ${this.darkMode ? 'active' : ''}" onclick="app.toggleDarkMode()">
                        ${this.darkMode ? 'Activado' : 'Desactivado'}
                    </button>
                </div>
            </div>
            <div class="settings-section">
                <h3>Notificaciones</h3>
                <div class="setting-item">
                    <label>Alertas de Inventario</label>
                    <button class="toggle-btn active">Activado</button>
                </div>
                <div class="setting-item">
                    <label>Notificaciones de Ventas</label>
                    <button class="toggle-btn active">Activado</button>
                </div>
            </div>
            <div class="settings-section">
                <h3>Datos</h3>
                <div class="setting-item">
                    <label>Actualización Automática</label>
                    <button class="toggle-btn active">Activado</button>
                </div>
                <div class="setting-item">
                    <label>Intervalo de Actualización</label>
                    <select class="form-select">
                        <option value="10">10 segundos</option>
                        <option value="15" selected>15 segundos</option>
                        <option value="30">30 segundos</option>
                        <option value="60">60 segundos</option>
                    </select>
                </div>
            </div>
        `;
    }
    
    // Render reports content
    renderReportsContent() {
        const container = document.getElementById('reportsContent');
        if (!container) return;
        
        // Calculate some report data
        const totalSalesMonth = mockData.salesHistory.reduce((sum, day) => sum + day.total, 0);
        const avgDailySales = totalSalesMonth / mockData.salesHistory.length;
        const totalTransactions = mockData.salesHistory.reduce((sum, day) => sum + day.transactions, 0);
        
        container.innerHTML = `
            <div class="reports-grid">
                <div class="report-card">
                    <h3>Ventas Totales (30 días)</h3>
                    <div class="report-value">L. ${totalSalesMonth.toLocaleString('es-HN')}</div>
                    <div class="report-subtitle">Promedio diario: L. ${avgDailySales.toFixed(2)}</div>
                </div>
                <div class="report-card">
                    <h3>Transacciones Totales</h3>
                    <div class="report-value">${totalTransactions.toLocaleString('es-HN')}</div>
                    <div class="report-subtitle">Últimos 30 días</div>
                </div>
                <div class="report-card">
                    <h3>Ticket Promedio</h3>
                    <div class="report-value">L. ${(totalSalesMonth / totalTransactions).toFixed(2)}</div>
                    <div class="report-subtitle">Por transacción</div>
                </div>
                <div class="report-card">
                    <h3>Clientes Activos</h3>
                    <div class="report-value">${mockData.clients.length}</div>
                    <div class="report-subtitle">Clientes registrados</div>
                </div>
            </div>
        `;
    }
    
    // Toggle sidebar
    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        document.body.classList.toggle('sidebar-closed');
    }
    
    // Toggle dark mode
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        this.applyTheme();
        
        // Update charts theme
        setTimeout(() => {
            chartManager.updateChartsTheme();
        }, 100);
    }
    
    // Apply theme
    applyTheme() {
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    
    // Update sales filter
    updateSalesFilter(filter) {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            }
        });
        
        // Update chart
        chartManager.updateSalesChart(filter);
    }
    
    // Start real-time clock
    startClock() {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-HN', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            const dateString = now.toLocaleDateString('es-HN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            const clockElement = document.getElementById('currentTime');
            const dateElement = document.getElementById('currentDate');
            
            if (clockElement) clockElement.textContent = timeString;
            if (dateElement) dateElement.textContent = dateString;
        };
        
        updateClock();
        this.clockInterval = setInterval(updateClock, 1000);
    }
    
    // Start simulation of new sales
    startSimulation() {
        this.simulationInterval = setInterval(() => {
            // Generate new transaction
            const newTransaction = generateNewTransaction();
            mockData.recentTransactions.unshift(newTransaction);
            
            // Keep only last 50 transactions
            if (mockData.recentTransactions.length > 50) {
                mockData.recentTransactions.pop();
            }
            
            // Update today's sales
            const today = mockData.salesHistory[mockData.salesHistory.length - 1];
            if (today) {
                today.total += newTransaction.amount;
                today.transactions += 1;
                
                // Update fuel type specific
                if (newTransaction.fuelType === 'Regular') {
                    today.regular += newTransaction.amount;
                } else if (newTransaction.fuelType === 'Super') {
                    today.super += newTransaction.amount;
                } else {
                    today.diesel += newTransaction.amount;
                }
            }
            
            // Update UI if on dashboard
            if (this.currentSection === 'dashboard') {
                this.updateKPIs();
                this.renderRecentTransactions();
            }
            
            // Show toast notification
            this.showToast(`Nueva venta: ${newTransaction.fuelType} - L. ${newTransaction.amount.toFixed(2)}`, 'success');
            
        }, 12000); // Every 12 seconds
    }
    
    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        const container = document.getElementById('toastContainer');
        if (container) {
            container.appendChild(toast);
            
            // Animate in
            setTimeout(() => toast.classList.add('show'), 10);
            
            // Remove after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    }
    
    // Export to CSV
    exportToCSV() {
        let csv = 'Nombre,Total Compras,Última Compra,Tipo Combustible,Visitas,Estado\n';
        
        mockData.clients.forEach(client => {
            csv += `"${client.name}",${client.totalPurchases},${client.lastPurchase},${client.fuelType},${client.visits},${client.status}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'clientes-estacion-tela.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showToast('Datos exportados exitosamente', 'success');
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DashboardApp();
    app.init();
});
