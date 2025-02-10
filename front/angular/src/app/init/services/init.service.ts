import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../users/models/user.model';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterUserDto {
  email: string;
  name: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password });
  }

  register(user: RegisterUserDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, user);
  }

  disconnect(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/disconnect`, { email });
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  getConnectedStatus(): Observable<{ connected: any[]; disconnected: any[] }> {
    return this.http.get<{ connected: any[]; disconnected: any[] }>(`${this.apiUrl}/connection-status`);
  }

  disconnectAll(): Observable<any> {
    return this.http.post(`${this.apiUrl}/disconnect-all`, {});
  }
}
