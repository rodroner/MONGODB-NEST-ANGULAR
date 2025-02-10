import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { User } from '../users/models/user.model';
//import { UsersService } from './services/users.service';
import { WebSocketUserService } from './services/websocket-user.service';
import { AppComponent } from '../core/app.component';

declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [
    CommonModule,
  ]
})
export class UsersComponent implements OnInit {

  usersConnected: User[] = [];
  usersDesconnected: User[] = [];

  storedUser: any = ""; //email in localstorage

  constructor(
    private webSocketUserService: WebSocketUserService) { }

  ngOnInit(): void {
    this.getUserInLocalStorage();
    this.webSocketUserService.onUsersChanged().subscribe((users: User[]) => {
      //console.log('Lista de usuarios actualizada:', users);
      this.usersConnected = users.filter(user => user.isConnected && user.email !== this.storedUser);
      this.usersDesconnected = users.filter(user => !user.isConnected);
    });
  }

  //Clickar en un usuario conectado y crear div en #navbarChatPrivate
  createChatPrivate(email1: string, email2: string) {
    //console.log('createChatPrivate: ' + email1 + ' / ' + email2)
    let idChatPrivate = this.mergeEmails(email1, email2);
    if ($('#' + idChatPrivate).length === 0) {
      $('#navbarChatPrivate').append(
        '<div id="' + idChatPrivate + '" class="chat-private col-auto" data-email1="' + email1 + '" data-email2="' + email2 + '"  >' +
        email2 + 
        '</div>'
      );
    }
  }

  //Generar id para div chat (unico)
  mergeEmails(email1: string, email2: string) {
    let part1 = email1.split('@')[0];
    let part2 = email2.split('@')[0];
    return part1 + part2 + '_chat';
  }

  getUserInLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (this.storedUser != null) {
        this.storedUser = localStorage.getItem('userLoged');
      }
    }
  }
}
