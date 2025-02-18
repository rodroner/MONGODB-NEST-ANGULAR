import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatPrivateService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  connectOnLoad() {
    const email1 = localStorage.getItem('userLoged'); 
    if (email1) {
      // No hay email2 aún (NO SE HA HECHO CLICK IN CHAT)
      this.socket.emit('connect-client', { email1, email2: '' }); 
      console.log(`🔗 Usuario conectado al WebSocket: ${email1}`);
    }
  }

  connect(email1: string, email2: string) {
    this.socket.emit('connect-client', { email1, email2 });
  }

  // Enviar mensaje
  sendMessage(email1: string, email2: string, message: string) {
    console.log('MENSAJE ENVIADO !');
    console.log(message);
    this.socket.emit('send-message', { email1, email2, message });
  }

  // Recibir mensaje (con filtro por usuario)
  onMessage(): Observable<Message> {
    return new Observable<Message>((observer) => {
      this.socket.on('receive-message', (data) => {
        // Usuario actual
        const emailLoged = localStorage.getItem('userLoged') || ''; 

        // Solo si el mensaje es para el usuario logueado
        if (data.email2 === emailLoged) {  
          observer.next(data);
        }
      });
    });
  }


  disconnect() {
    const email1 = localStorage.getItem('userLoged') || '';
    this.socket.emit('disconnect-client', email1);
    this.socket.disconnect();
  }
}
