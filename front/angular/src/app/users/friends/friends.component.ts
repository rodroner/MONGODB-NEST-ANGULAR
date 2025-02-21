import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { User } from '../models/user.model';
import { WebSocketUserService } from '../services/websocket-user.service';
import { UsersService } from '../services/users.service';
import { ComponentPortal } from '@angular/cdk/portal';

declare var $: any;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule,
  ]
})
export class FriendsComponent implements OnInit {

  valueInput = '';
  userSearch: User[] = [];

  friendsConnected: User[] = [];
  friendsDesconnected: User[] = [];

  storedUser: any = "";

  constructor(
    private usersService: UsersService,
    private webSocketUserService: WebSocketUserService,
    ) { }

  ngOnInit(): void {
    this.getUserInLocalStorage();

    this.webSocketUserService.onUsersChanged().subscribe((users: User[]) => {

      //this.filterUsers(users);
      this.friendsConnected = users.filter(user => user.isConnected && user.email !== this.storedUser);
      this.friendsDesconnected = users.filter(user => !user.isConnected);
    });
  }

  onInputChange(value: string) {
    this.valueInput = value;
    if(this.valueInput==''){
      this.userSearch = [];
    }else{
      this.usersService.getUsers().subscribe((users: User[]) => {
        this.filterUsers(users); 
      });
    }
  }

  filterUsers(users: User[]) {
    this.userSearch = users.filter(
      (user) =>
        user.name.toLowerCase().includes(this.valueInput.toLowerCase()) ||
        user.email.toLowerCase().includes(this.valueInput.toLowerCase())
    );

    this.friendsConnected = users.filter(
      (user) => user.isConnected && user.email !== this.storedUser
    );

    this.friendsDesconnected = users.filter((user) => !user.isConnected);
  }

  //Enviar peticion de amistad
  sendRequest(user: User){
    console.log('sendRequest...');
  }

  //Clickar en un usuario conectado y crear div en #navbarChatPrivate
  createChatPrivate(email1: string, email2: string) {
    //console.log('createChatPrivate: ' + email1 + ' / ' + email2)
    let idChatPrivate = this.mergeEmails(email1, email2);
    if ($('#' + idChatPrivate).length === 0) {
      $('#navbarChatPrivate').append(
        '<div id="' + idChatPrivate + '" class="chat-private col-auto" data-email1="' + email1 + '" data-email2="' + email2 + '" data-cont-messages="0">' +
        email2 +
        '</div>' +
        '<span class="d-none ' + idChatPrivate + ' data-cont-messages">0</span>'
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
