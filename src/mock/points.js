
import { POINT_TYPES } from '../const.js';

// 1. СТРУКТУРА ПУНКТА НАЗНАЧЕНИЯ (Destination)
const mockDestinations = [
  {
    id: 'dest-1',
    name: 'Chamonix',
    description: 'Chamonix-Mont-Blanc is a resort area...',
    pictures: [{src: 'https://24.objects.htmlacademy.pro/static/destinations/1.jpg', description: 'Chamonix'}]
  },
  {
    id: 'dest-2',
    name: 'Amsterdam',
    description: 'Amsterdam is a city with beautiful canals.',
    pictures: [{src: 'https://24.objects.htmlacademy.pro/static/destinations/2.jpg', description: 'Amsterdam'}]
  },
  {
    id: 'dest-3',
    name: 'Geneva',
    description: 'Geneva is a beautiful city near a big lake.',
    pictures: [{src: 'https://24.objects.htmlacademy.pro/static/destinations/3.jpg', description: 'Geneva view'}]
  }
];

// 2. СТРУКТУРА (Offers)
const mockOffers = [
  {
    type: POINT_TYPES[0], // Можно писать строкой или POINT_TYPES[0]
    offers: [
      {
        id: 'off-taxi-1', // Уникальный префикс гарантирует отсутствие дублей
        title: 'Upgrade to business class',
        price: 120
      },
      {
        id: 'off-taxi-2',
        title: 'Add luggage',
        price: 50
      }
    ]
  },
  {
    type: POINT_TYPES[5], // POINT_TYPES[5]
    offers: [
      {
        id: 'off-flight-1',
        title: 'Choose seats',
        price: 20
      },
      {
        id: 'off-flight-2',
        title: 'Add meal',
        price: 15
      }
    ]
  },
  {
    type: POINT_TYPES[1], // POINT_TYPES[1]
    offers: [
      {
        id: 'off-bus-1',
        title: 'Choose seats',
        price: 5
      },
      {
        id: 'off-bus-2',
        title: 'USB port',
        price: 2
      }
    ]
  }
];

// 3. СТРУКТУРА ТОЧКИ МАРШРУТА (Point)
const mockPoints = [
  {
    id: 'p-1',
    basePrice: 1100,
    dateFrom: '2027-01-24T12:00:00.000Z',
    dateTo: '2027-01-24T13:30:00.000Z',
    destination: 'dest-1',
    isFavorite: false,
    offers: ['off-taxi-1', 'off-taxi-2'],
    type: POINT_TYPES[0] // 'taxi'
  },
  {
    id: 'p-2',
    basePrice: 500,
    dateFrom: '2026-01-25T10:00:00.000Z',
    dateTo: '2026-01-25T12:00:00.000Z',
    destination: 'dest-2',
    isFavorite: true,
    offers: ['off-flight-1', 'off-flight-2'],
    type: POINT_TYPES[5] // 'flight'
  },
  {
    id: 'p-3',
    basePrice: 800,
    dateFrom: '2026-01-25T14:00:00.000Z', // Дата должна быть ПОСЛЕ даты конца p-2
    dateTo: '2026-01-25T16:00:00.000Z',
    destination: 'dest-3',
    isFavorite: false,
    offers: ['off-bus-1', 'off-bus-2'],
    type: POINT_TYPES[1] // 'bus'
  }
];

export {mockPoints, mockDestinations, mockOffers};
