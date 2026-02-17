import ApiService from './framework/api-service.js';
import {Method} from './const.js';

export default class PointsApiService extends ApiService {
  // 1. Получаем список точек
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  // 2. Получаем справочник направлений (городов)
  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  // 3. Получаем справочник всех доступных офферов
  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST, // Для создания — POST
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  async deletePoint(point) {
    return await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    }); // При DELETE сервер обычно возвращает пустой ответ, parseResponse не нужен
  }

  // 4. Метод для обновления точки на сервере
  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }
}
