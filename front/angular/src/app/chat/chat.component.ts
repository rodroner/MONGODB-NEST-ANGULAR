import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { UsersService } from '../users/services/users.service';
import { ChatService } from './services/chat.service';
import { User } from '../users/models/user.model';
import { AppComponent } from '../core/app.component';

declare var $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ]
})
export class ChatComponent implements OnInit {
  
  clients: User[] = [];
  messages: { userId: string; message: string; name: string }[] = [];
  message = '';
  senderName = '';
  isNameSet = false;

  user = {} as User;

  storedUser: string | null = "";

  constructor(
    private chatService: ChatService,
    private usersService: UsersService,
    private appComponent: AppComponent) { }

  ngOnInit(): void {
    this.getUserInLocalStorage();

    // Solicitar la lista inicial de clientes
    this.chatService.getClients();

    this.getClientsInChat();

    this.getMessagesInChat();
  }

  //Togle para el div de usuarios conectados
  userToggle() {
    $('.userToggle').slideToggle();
    if ($('#userToggleDown').hasClass('d-none')) {
      $('#userToggleDown').removeClass('d-none');
      $('#userToggleUp').addClass('d-none');
    } else {
      $('#userToggleDown').addClass('d-none');
      $('#userToggleUp').removeClass('d-none');
    }
  }

  //Llevar scroll abajo en el chat para mostrar el mensaje mas reciente
  scrollbarMsn() {
    const element = document.getElementById('messages-box');
    if (element) {
      element.scrollTop = 99999999;
    }
  }

  getClientsInChat() {
    // Escuchar cambios en los clientes conectados
    this.chatService.onClientsChanged().subscribe((clients: User[]) => {
      this.clients = clients;
    });
  }

  getMessagesInChat() {
    // Escuchar mensajes entrantes
    this.chatService.onMessage().subscribe((message) => {
      console.log('Mensaje recibido:', message);
      this.messages.push(message);
      setTimeout(
        this.scrollbarMsn, 
        250);
      
    });
  }

  getUserInLocalStorageData(email: string) {
    this.usersService.getUsersByEmail(email).subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (err) => {
        console.error('Error al obtener el usuario:', err);
      }
    });
  }

  getUserInLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.storedUser = localStorage.getItem('userLoged');
      if (this.storedUser) {
        this.getUserInLocalStorageData(this.storedUser);
        this.appComponent.getUserInLocalStorage();
        this.isNameSet = true
      }
    }
  }

  setName(): void {
    if (this.senderName.trim()) {
      this.isNameSet = true;
      console.log('SET NAME: ' + this.senderName);
      this.chatService.setUserName(this.senderName);
    }
  }

  // Enviar un mensaje
  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.message);
      this.message = '';
    }
  }
}
