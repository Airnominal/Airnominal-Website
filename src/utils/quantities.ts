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
  { name: 'PM10.0', unit: 'μg/m3' },
  { name: 'PM12.5', unit: 'μg/m3' },
  { name: 'SO2', unit: 'μg/m3' },
  { name: 'NO2', unit: 'μg/m3' },
  { name: 'CO', unit: 'μg/m3' },
  { name: 'O3', unit: 'μg/m3' },
  { name: 'C6H6', unit: 'μg/m3' },

  // Indoor Pollution
  { name: 'CO2', unit: 'ppm' },

  // Car Counters
  { name: 'Cars', unit: 'n/h' },
  { name: 'Speed', unit: 'km/h' },
  { name: 'Speed', unit: 'm/s' },
  { name: 'Interval', unit: 's' },

  // Technical
  { name: 'Battery', unit: '%' }
]
