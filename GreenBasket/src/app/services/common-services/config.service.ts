import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public readonly baseAPIUrl: string = 'http://localhost:5215/';
  public readonly baseImageUrl: string = 'https://localhost:44339';
  constructor() { }
}
