import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessagesPrivateService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  // Método para obtener los mensajes entre dos usuarios
  getMessages(email1: string, email2: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages`, {
      params: { email1, email2 }
    });
  }
}