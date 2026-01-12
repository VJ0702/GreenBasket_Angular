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

  // POST with FormData (for file uploads)
  postFormData<T>(endpoint: string, formData: FormData): Observable<T> {
    // Don't set Content-Type header - let browser set it with boundary
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData);
  }

  // Generic PUT method
  put<T>(endpoint: string, body: any): Observable<T> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, { headers });
  }

  // Generic DELETE method
  delete<T>(endpoint: string): Observable<T> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, { headers });
  }

  // DELETE by full URL
  deleteByFullUrl<T>(endpoint: string): Observable<T> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<T>(`${endpoint}`, { headers });
  }

}
