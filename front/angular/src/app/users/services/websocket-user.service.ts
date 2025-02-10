import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

import { User } from 'src/app/users/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class WebSocketUserService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000/users'); 

    this.socket.on('connect', () => {
      //console.log('WEBSOCKET USUARIO CONECTADO');
    });

    this.socket.on('disconnect', () => {
      //console.log('WESOCKET USUARIO DESCONECTADO');
    });
  }

  //Escuchar la lista de usuarios en tiempo real
  onUsersChanged(): Observable<any[]> {
    return new Observable((observer) => {
      this.socket.on('on-users-changed', (users: any[]) => {
        observer.next(users);
      });
    });
  }
}