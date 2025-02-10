import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';  

import { User } from 'src/app/users/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  
  private socket: Socket;
  private userName: string = ''; 

  storedUser: string | null = "";

  constructor() {
    this.getUserInLocalStorage();
    // Conexión al servidor WebSocket
    this.socket = io('http://localhost:3000/chat', {
      auth: { name: this.userName, token: 'token123' },
    });

    // Verificar si la conexión se establece
    this.socket.on('connect', () => {
      console.log('Conectado al servidor WebSocket CHAT');
    });

    // Verificar si la conexión se desconecta
    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor WebSocket CHAT');
    });
  }

  getClients(): void {
    this.socket.emit('get-clients');
  }

  // Método para establecer el nombre del usuario
  setUserName(name: string): void {
    this.userName = name; // Guardar el nombre del usuario
    this.socket.emit('set-name', name); // Enviar el nombre al servidor WebSocket si lo deseas
  }

  // Método para enviar un mensaje
  sendMessage(message: string): void {
    if (message) {
      this.socket.emit('send-message', message);
    }
  }

  // Método para recibir mensajes
  onMessage() {
    return new Observable<any>((observer) => {
      this.socket.on('on-message', (message: any) => {
        observer.next(message);
      });
    });
  }

  // Método para escuchar cambios en los clientes conectados
  onClientsChanged(): Observable<User[]> {
    return new Observable((observer) => {
      this.socket.on('on-clients-changed', (clients: User[]) => {
        observer.next(clients);
      });
    });
  }

  getUserInLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.storedUser = localStorage.getItem('userLoged');
      if (this.storedUser) {
        this.userName = this.storedUser;
      }
    }
  }
}
