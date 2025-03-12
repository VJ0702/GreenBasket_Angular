import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5215/'; // Base URL

  constructor(private http: HttpClient) { }

  //Generic GET method
  get<T>(endpoint: string): Observable<T> {
    //console.log(`${this.baseUrl}${endpoint}`);
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  getByFullUrl<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${endpoint}`);
  }

  // Generic POST method
  post<T>(endpoint: string, body: any): Observable<T> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, { headers });
  }

}
