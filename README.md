# Estación de Servicio Tela - Dashboard

Dashboard moderno y completo para la gestión de la Estación de Servicio Tela.

## Características

### ✨ Funcionalidades Principales

- **Dashboard Interactivo**: KPIs en tiempo real con ventas del día, transacciones, clientes activos y ticket promedio
- **Navegación Completa**: 7 secciones principales (Dashboard, Ventas, Clientes, Reportes, Alertas, CAI/Talonarios, Configuración)
- **Modo Oscuro/Claro**: Toggle persistente con localStorage
- **Sidebar Responsive**: Colapsable en dispositivos móviles con botón hamburguesa
- **Datos en Tiempo Real**: Simulación de nuevas ventas cada 12 segundos
- **Reloj en Vivo**: Fecha y hora actualizándose en tiempo real
- **Indicador "En Vivo"**: Animación pulsante

### 📊 Gráficos y Visualizaciones

- **Gráfico de Ventas**: Con filtros Diario/Semanal/Mensual (requiere Chart.js)
- **Mix de Productos**: Gráfico tipo donut (requiere Chart.js)
- **Heatmap de Horas Pico**: Visualización de actividad por día y hora

### 📋 Tablas y Listas

- **Tabla de Clientes**: Con paginación, búsqueda y filtrado
- **Tabla de Ventas**: Historial de los últimos 15 días
- **Top Clientes**: Top 5 clientes por volumen de compras
- **Últimas Ventas**: Lista en tiempo real con scroll

### 🔔 Sistema de Alertas

- **4 Niveles**: Crítica, Alta, Media, Info
- **Acciones**: Marcar como leída, cerrar alertas
- **Contador**: Badge con número de alertas sin leer
- **Toast Notifications**: Notificaciones emergentes para nuevas ventas

### 💾 Funcionalidades Adicionales

- **Exportar a CSV**: Descarga de datos de clientes
- **CAI/Talonarios**: Información completa con barra de progreso
- **Reportes**: Métricas agregadas de 30 días
- **Configuración**: Panel de preferencias del sistema

### 📱 Diseño Responsive

- **Mobile**: < 768px - Sidebar colapsable, grid de 1 columna
- **Tablet**: 768px - 1024px - Grid adaptativo de 2 columnas
- **Desktop**: > 1024px - Experiencia completa

## Estructura de Archivos

```
/
├── index.html           # HTML principal con estructura semántica
├── css/
│   └── styles.css      # Estilos personalizados y variables CSS
├── js/
│   ├── app.js          # Lógica principal de la aplicación
│   ├── charts.js       # Configuración de Chart.js
│   └── data.js         # Datos mock para demostración
└── mockup/
    └── dashboard-preview.html  # Preview básico anterior
```

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica con roles ARIA
- **CSS3**: Variables CSS, Flexbox, Grid, transiciones suaves
- **JavaScript (ES6+)**: Vanilla JS moderno
- **Chart.js**: Gráficos interactivos (opcional, con fallback)

## Instalación y Uso

### Opción 1: Abrir Directamente
Simplemente abre `index.html` en tu navegador moderno.

### Opción 2: Servidor Local
```bash
# Python 3
python3 -m http.server 8080

# Node.js (con http-server)
npx http-server -p 8080

# PHP
php -S localhost:8080
```

Luego visita: `http://localhost:8080`

## Datos Mock

El dashboard incluye datos de demostración:
- 30 días de historial de ventas
- 12 clientes con datos completos
- 20 transacciones recientes
- 5 alertas de diferentes niveles
- Información de CAI y talonarios
- Niveles de inventario de combustible

## Características de Accesibilidad

- Roles ARIA en navegación
- Labels descriptivos en botones
- Contraste de colores WCAG AA
- Navegación por teclado
- Toast notifications con aria-live

## Compatibilidad

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Notas Técnicas

### Chart.js
Los gráficos requieren Chart.js desde CDN. Si no está disponible, se muestran placeholders informativos.

### LocalStorage
El modo oscuro se guarda en localStorage para persistencia entre sesiones.

### Simulación en Tiempo Real
Las nuevas ventas se generan automáticamente cada 12 segundos para demostrar la actualización en vivo.

## Próximas Mejoras

- [ ] Integración con backend real
- [ ] Autenticación de usuarios
- [ ] Descarga local de Chart.js para funcionamiento offline
- [ ] Filtros avanzados en reportes
- [ ] Exportar reportes a PDF
- [ ] Gráficos adicionales de inventario
- [ ] Notificaciones push del navegador

## Capturas de Pantalla

### Vista Principal (Modo Claro)
![Dashboard Light Mode](https://github.com/user-attachments/assets/2992eac0-92b3-43b7-a975-0f505bba0da2)

### Vista Principal (Modo Oscuro)
![Dashboard Dark Mode](https://github.com/user-attachments/assets/cb99d2a8-41dd-4b7f-b163-c5aea118c6fb)

### Gestión de Clientes
![Clientes](https://github.com/user-attachments/assets/32bf9ec9-5a99-44b0-913b-5ee867a744fe)

### Centro de Alertas
![Alertas](https://github.com/user-attachments/assets/39d0105d-5817-4bf1-bd84-5a027b22a090)

### CAI/Talonarios
![CAI](https://github.com/user-attachments/assets/2ecc5f85-3cf0-4efe-a3b6-a30226cd5a3d)

## Licencia

© 2024 Estación de Servicio Tela. Todos los derechos reservados.
