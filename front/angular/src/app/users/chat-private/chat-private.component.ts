import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ChatPrivateService } from './services/chat-private.service';

import { Message } from './models/message.model';
import { MessagesPrivateService } from './services/messages-private.service';

declare var $: any;

@Component({
  selector: 'app-chat-private',
  templateUrl: './chat-private.component.html',
  styleUrls: ['./chat-private.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, MatInputModule, MatButtonModule],
  encapsulation: ViewEncapsulation.None
})

/*
  Interacción con el Chat: El método clickInChat() obtiene email1 y email2 cuando un usuario hace clic en 
  un chat y se conecta al WebSocket.

  Enviar Mensajes: Cuando el usuario escribe y hace clic en enviar, el mensaje se envía al servidor a 
  través del método sendMessage().

  Recibir Mensajes: Los mensajes recibidos se agregan a la lista messages y se muestran en el chat.
*/

export class ChatPrivateComponent {
  email1: string = '';
  email2: string = '';
  message: string = '';
  messages: any[] = [];

  constructor(
    private chatPrivateService: ChatPrivateService,
    private messagesPrivateService: MessagesPrivateService) { }

  //AUDIOS
  audioGetMessage = new Audio("../../../assets/audio/getmessage.mp3");

  // Recibir mensajes
  ngOnInit() {
    //Conectamos siempre, sin hacer clickInChat()
    this.chatPrivateService.connectOnLoad();

    this.chatPrivateService.onMessage().subscribe((msg) => {
      console.log(msg.email1 + ' Te ha enviado un mensaje !');
      console.log('Mensaje recibido:', msg);
      //Clickar en un usuario conectado y crear div en #navbarChatPrivate
      this.createChatPrivate(msg.email2, msg.email1);
      this.getContMessages(msg);
      if ($('#divChatPrivate').hasClass('open')) {
        this.showCorrespondingMessages1(msg.email1);
        setTimeout(
          this.scrollbarMsn,
          250);
      }
    });
  }

  //Pintar el numero de mensajes no leídos de un chat
  getContMessages(msg: Message) {
    let id = this.mergeEmails(msg.email2, msg.email1);
    if ($('#divChatPrivate').hasClass('open') && $('#message-header').text() == msg.email1) {
      $('#' + id).attr('data-cont-messages', '0');
      $('.' + id + '.data-cont-messages').text('0');
      $('.' + id + '.data-cont-messages').addClass('d-none');
    } else {
      let getContMessages = parseInt($('#' + id).attr('data-cont-messages')) + 1;
      $('#' + id).attr('data-cont-messages', getContMessages);
      if ($('#' + id).attr('data-cont-messages') > 0) {
        $('.' + id + '.data-cont-messages').text(getContMessages);
        $('.' + id + '.data-cont-messages').removeClass('d-none');
        this.audioGetMessage.play();
      }
    }
  }

  clickMinimize() {
    $('#divChatPrivate').removeClass('open');
  }

  clickClose(email1Close: string, email2Close: string) {
    $('#divChatPrivate').removeClass('open');
    let idChatPrivate = this.mergeEmails(email1Close, email2Close);
    $('#' + idChatPrivate).remove();
  }

  // Al hacer clic en un chat
  clickInChat(event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('chat-private')) {
      this.email1 = target.getAttribute('data-email1') || '';
      this.email2 = target.getAttribute('data-email2') || '';
      if (this.email1) {
        const chatBox = document.getElementById('divChatPrivate');
        if (chatBox) {
          chatBox.classList.toggle('open');
          if (chatBox.classList.contains('open')) {
            this.chatPrivateService.connect(this.email1, this.email2);
            this.showCorrespondingMessages1(this.email2);
            //Ocultar cont messages correspondiente
            let id = this.mergeEmails(this.email1, this.email2);
            $('#' + id).attr('data-cont-messages', '0');
            $('.' + id + '.data-cont-messages').text('0');
            $('.' + id + '.data-cont-messages').addClass('d-none');
          }
        }
      }
    }
    setTimeout(
      this.scrollbarMsn,
      250);
  }

  // Enviar un mensaje
  sendMessage() {
    if (this.message.trim()) {
      this.chatPrivateService.sendMessage(this.email1, this.email2, this.message);
      // this.messages.push({ email1: this.email1, email2: this.email2, message: this.message });
      this.message = '';
      this.showCorrespondingMessages1(this.email2);
      setTimeout(
        this.scrollbarMsn,
        250);
    }
  }

  //Clickar en un usuario conectado y crear div en #navbarChatPrivate
  createChatPrivate(email1: string, email2: string) {
    let idChatPrivate = this.mergeEmails(email1, email2);
    if ($('#' + idChatPrivate).length === 0) {
      $('#navbarChatPrivate').append(
        '<div id="' + idChatPrivate + '" class="btn chat-private col-auto card p-2" data-email1="' + email1 + '" data-email2="' + email2 + '" data-cont-messages="0">' +
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

  /*
  Mostrar solo mensajes de la caja de chat correspondiente al usuario
  igualar #message-header .text() a message-email-{{ msg.email1 }} y a message-email-{{ msg.email2 }}
  */
  showCorrespondingMessages1(email2: string) {
    let email1 = localStorage.getItem('userLoged');
    if (email1 && email2) {
      this.messagesPrivateService.getMessages(this.email1, email2).subscribe({
        next: (messages) => {
          this.messages = messages;
          console.log('Mensajes obtenidos:', this.messages);
        },
        error: (error) => {
          console.error('Error al obtener los mensajes:', error);
        }
      });
    }
  }

  //Llevar scroll abajo en el chat para mostrar el mensaje mas reciente
  scrollbarMsn() {
    const element = document.getElementById('messages-box');
    if (element) {
      element.scrollTop = 99999999;
    }
  }
}
