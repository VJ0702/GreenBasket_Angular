import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public readonly baseAPIUrl: string = 'http://localhost:5215/';
  public readonly baseImageUrl: string = 'http://localhost:5215/';
  constructor() { }
}
