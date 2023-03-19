export interface Quantity {
  name: string,
  unit: string,
}

export const quantities: Quantity[] = [
  // Basic Quantities
  { name: 'Temperature', unit: '°C' },
  { name: 'Temperature', unit: '°F' },
  { name: 'Humidity', unit: '%' },

  // Outdoor Pollution
  { name: 'PM10', unit: 'µg/m³' },
  { name: 'PM2.5', unit: 'µg/m³' },
  { name: 'SO2', unit: 'µg/m³' },
  { name: 'NO2', unit: 'µg/m³' },
  { name: 'CO', unit: 'mg/m³' },
  { name: 'O3', unit: 'µg/m³' },
  { name: 'C6H6', unit: 'µg/m³' },

  // Indoor Pollution
  { name: 'CO2', unit: 'ppm' },

  // Car Counters
  { name: 'Cars', unit: 'n/h' },
  { name: 'Speed', unit: 'km/h' },
  { name: 'Interval', unit: 's' },

  // Technical
  { name: 'Battery', unit: '%' }
]
