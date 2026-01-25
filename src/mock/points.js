
import { POINT_TYPES } from '../const.js';

// 1. СТРУКТУРА ПУНКТА НАЗНАЧЕНИЯ (Destination)
const mockDestinations = [
  {
    id: 'dest-1',
    name: 'Chamonix',
    description: 'Chamonix-Mont-Blanc is a resort area...',
    pictures: [{src: 'https://22.objects.htmlacademy.pro/static/destinations/1.jpg', description: 'Chamonix'}]
  },
  {
    id: 'dest-2',
    name: 'Amsterdam',
    description: 'Amsterdam is a city with beautiful canals.',
    pictures: [{src: 'https://22.objects.htmlacademy.pro/static/destinations/2.jpg', description: 'Amsterdam'}]
  }
];

// 2. СТРУКТУРА (Offers)
const mockOffers = [
  {
    type: POINT_TYPES[0], // Используем константу 'taxi'
    offers: [
      {id: 'off-1', title: 'Upgrade to business', price: 120},
      {id: 'off-2', title: 'Add luggage', price: 50}
    ]
  },
  {
    type: POINT_TYPES[5], // Используем константу 'flight'
    offers: [
      {id: 'off-3', title: 'Choose seats', price: 20}
    ]
  }
];

// 3. СТРУКТУРА ТОЧКИ МАРШРУТА (Point)
const mockPoints = [
  {
    id: 'p-1',
    basePrice: 1100,
    dateFrom: '2026-01-24T12:00:00.000Z',
    dateTo: '2026-01-24T13:30:00.000Z',
    destination: 'dest-1',
    isFavorite: false,
    offers: ['off-1'],
    type: POINT_TYPES[0] // 'taxi'
  },
  {
    id: 'p-2',
    basePrice: 500,
    dateFrom: '2026-01-25T10:00:00.000Z',
    dateTo: '2026-01-25T12:00:00.000Z',
    destination: 'dest-2',
    isFavorite: true,
    offers: [],
    type: POINT_TYPES[5] // 'flight'
  }
];

export {mockPoints, mockDestinations, mockOffers};
