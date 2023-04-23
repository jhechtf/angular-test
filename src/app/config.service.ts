import { Injectable } from '@angular/core';
import config from '../config/config.json';
import { ReplaySubject } from 'rxjs';

export type Config = typeof config;
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config = new ReplaySubject<typeof config>();
  constructor() {
    this.config.next(config);
  }
}
