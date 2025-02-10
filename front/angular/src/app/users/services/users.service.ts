import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getUsersByEmail(email: string): Observable<any> {
    // Codificamos el email para evitar problemas con caracteres especiales
    const encodedEmail = encodeURIComponent(email);
    const url = `${this.apiUrl}/find-by-email?email=${encodedEmail}`;
    return this.http.get<any>(url);
  }

  // Obtener usuarios conectados
  getUsersConnected(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?isConnected=true`);
  }

  // Obtener usuarios desconectados
  getUsersDesconnected(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?isConnected=false`);
  }
}
