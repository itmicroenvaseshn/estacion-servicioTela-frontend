// Chart.js configuration and management for Estación de Servicio Tela

class ChartManager {
    constructor() {
        this.charts = {};
        this.currentFilter = 'daily';
    }
    
    // Initialize all charts
    initializeCharts() {
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded. Charts will not be displayed.');
            this.displayChartPlaceholders();
            return;
        }
        
        this.createSalesChart();
        this.createProductMixChart();
        this.createPeakHoursHeatmap();
    }
    
    // Display placeholders when Chart.js is not available
    displayChartPlaceholders() {
        const salesChart = document.getElementById('salesChart');
        const productMixChart = document.getElementById('productMixChart');
        
        if (salesChart && salesChart.parentElement) {
            salesChart.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 300px; color: var(--text-secondary); text-align: center;"><p>Gráfico de ventas<br/><small>Chart.js no disponible</small></p></div>';
        }
        
        if (productMixChart && productMixChart.parentElement) {
            productMixChart.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 300px; color: var(--text-secondary); text-align: center;"><p>Gráfico de productos<br/><small>Chart.js no disponible</small></p></div>';
        }
    }
    
    // Sales chart with filter support
    createSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;
        
        const data = this.getSalesChartData(this.currentFilter);
        
        this.charts.sales = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Total Ventas',
                    data: data.totals,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-primary').trim()
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += 'L. ' + context.parsed.y.toLocaleString('es-HN');
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-secondary').trim(),
                            callback: function(value) {
                                return 'L. ' + value.toLocaleString('es-HN');
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-secondary').trim()
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Product mix donut chart
    createProductMixChart() {
        const ctx = document.getElementById('productMixChart');
        if (!ctx) return;
        
        this.charts.productMix = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Regular', 'Super', 'Diesel'],
                datasets: [{
                    data: [
                        mockData.productMix.regular,
                        mockData.productMix.super,
                        mockData.productMix.diesel
                    ],
                    backgroundColor: [
                        'rgb(34, 197, 94)',
                        'rgb(59, 130, 246)',
                        'rgb(251, 146, 60)'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-primary').trim(),
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return label + ': ' + value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Peak hours heatmap
    createPeakHoursHeatmap() {
        const container = document.getElementById('peakHoursHeatmap');
        if (!container) return;
        
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const hours = Array.from({length: 24}, (_, i) => i);
        
        let html = '<div class="heatmap-grid">';
        
        // Header row with hours
        html += '<div class="heatmap-header"><div class="heatmap-cell"></div>';
        hours.forEach(hour => {
            html += `<div class="heatmap-cell hour-label">${hour}</div>`;
        });
        html += '</div>';
        
        // Data rows
        days.forEach((day, dayIndex) => {
            html += '<div class="heatmap-row">';
            html += `<div class="heatmap-cell day-label">${day}</div>`;
            
            hours.forEach(hour => {
                const dataPoint = mockData.peakHours.find(p => p.day === dayIndex && p.hour === hour);
                const intensity = dataPoint ? dataPoint.value : 0;
                const color = this.getHeatmapColor(intensity);
                
                html += `<div class="heatmap-cell heatmap-data" 
                         style="background-color: ${color}" 
                         data-day="${dayIndex}" 
                         data-hour="${hour}" 
                         data-value="${intensity}"
                         title="${day} ${hour}:00 - ${intensity}% actividad">
                      </div>`;
            });
            html += '</div>';
        });
        
        html += '</div>';
        html += '<div class="heatmap-legend">';
        html += '<span>Baja</span>';
        html += '<div class="legend-gradient"></div>';
        html += '<span>Alta</span>';
        html += '</div>';
        
        container.innerHTML = html;
    }
    
    // Get color for heatmap based on intensity
    getHeatmapColor(intensity) {
        if (intensity < 20) return 'rgba(59, 130, 246, 0.1)';
        if (intensity < 40) return 'rgba(59, 130, 246, 0.3)';
        if (intensity < 60) return 'rgba(59, 130, 246, 0.5)';
        if (intensity < 80) return 'rgba(59, 130, 246, 0.7)';
        return 'rgba(59, 130, 246, 0.9)';
    }
    
    // Get sales chart data based on filter
    getSalesChartData(filter) {
        const history = mockData.salesHistory;
        let labels = [];
        let totals = [];
        
        if (filter === 'daily') {
            // Last 7 days
            const lastWeek = history.slice(-7);
            labels = lastWeek.map(d => {
                const date = new Date(d.date);
                return date.toLocaleDateString('es-HN', { weekday: 'short', day: 'numeric' });
            });
            totals = lastWeek.map(d => d.total);
        } else if (filter === 'weekly') {
            // Last 4 weeks
            for (let i = 3; i >= 0; i--) {
                const weekEnd = history.length - 1 - (i * 7);
                const weekStart = weekEnd - 6;
                if (weekStart >= 0) {
                    const weekData = history.slice(weekStart, weekEnd + 1);
                    const weekTotal = weekData.reduce((sum, d) => sum + d.total, 0);
                    labels.push(`Semana ${4 - i}`);
                    totals.push(weekTotal);
                }
            }
        } else if (filter === 'monthly') {
            // Last 30 days aggregated by week
            for (let i = 0; i < 4; i++) {
                const weekEnd = history.length - 1 - (i * 7);
                const weekStart = weekEnd - 6;
                if (weekStart >= 0) {
                    const weekData = history.slice(weekStart, weekEnd + 1);
                    const weekTotal = weekData.reduce((sum, d) => sum + d.total, 0);
                    totals.unshift(weekTotal);
                    labels.unshift(`Sem ${i + 1}`);
                }
            }
        }
        
        return { labels, totals };
    }
    
    // Update sales chart with new filter
    updateSalesChart(filter) {
        if (typeof Chart === 'undefined' || !this.charts.sales) {
            return;
        }
        
        this.currentFilter = filter;
        const data = this.getSalesChartData(filter);
        
        if (this.charts.sales) {
            this.charts.sales.data.labels = data.labels;
            this.charts.sales.data.datasets[0].data = data.totals;
            this.charts.sales.update();
        }
    }
    
    // Update all charts for theme change
    updateChartsTheme() {
        if (typeof Chart === 'undefined') {
            return;
        }
        
        Object.values(this.charts).forEach(chart => {
            if (chart.options && chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = getComputedStyle(document.documentElement)
                    .getPropertyValue('--text-primary').trim();
            }
            if (chart.options && chart.options.scales) {
                if (chart.options.scales.y && chart.options.scales.y.ticks) {
                    chart.options.scales.y.ticks.color = getComputedStyle(document.documentElement)
                        .getPropertyValue('--text-secondary').trim();
                }
                if (chart.options.scales.x && chart.options.scales.x.ticks) {
                    chart.options.scales.x.ticks.color = getComputedStyle(document.documentElement)
                        .getPropertyValue('--text-secondary').trim();
                }
            }
            chart.update();
        });
    }
    
    // Destroy all charts (for cleanup)
    destroyCharts() {
        Object.values(this.charts).forEach(chart => chart.destroy());
        this.charts = {};
    }
}

// Export chart manager
const chartManager = new ChartManager();
