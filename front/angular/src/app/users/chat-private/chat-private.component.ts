import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ChatPrivateService } from './services/chat-private.service';

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
    private chatPrivateService: ChatPrivateService) { }

  // Recibir mensajes
  ngOnInit() {
    //Conectamos siempre, sin hacer clickInChat()
    this.chatPrivateService.connectOnLoad();

    this.chatPrivateService.onMessage().subscribe((msg) => {
      console.log(msg.email1 + ' Te ha enviado un mensaje !')
      console.log('Mensaje recibido:', msg);
      //Clickar en un usuario conectado y crear div en #navbarChatPrivate
      this.createChatPrivate(msg.email2, msg.email1)
      this.messages.push(msg);
      setTimeout(
        this.showCorrespondingMessages,
        250);
    });
  }

  clickMinimize(){
    console.log('clickMinimize()...');
    $('#divChatPrivate').removeClass('open');
  }

  clickClose(){
    console.log('clickClose()...');
  }

  // Al hacer clic en un chat
  clickInChat(event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('chat-private')) {
      console.log('clickInChat()...');
      this.email1 = target.getAttribute('data-email1') || '';
      this.email2 = target.getAttribute('data-email2') || '';
      if (this.email1) {
        const chatBox = document.getElementById('divChatPrivate');
        if (chatBox) {
          chatBox.classList.toggle('open');
          if (chatBox.classList.contains('open')) {
            console.log('this.chatPrivateService.connect... ' + this.email1 + " -> " + this.email2);
            this.chatPrivateService.connect(this.email1, this.email2);
            this.showCorrespondingMessages2(this.email2);
          }
        }
      }
    }
  }

  // Enviar un mensaje
  sendMessage() {
    if (this.message.trim()) {
      this.chatPrivateService.sendMessage(this.email1, this.email2, this.message);
      this.messages.push({ email1: this.email1, email2: this.email2, message: this.message });
      this.message = '';
      setTimeout(
        this.showCorrespondingMessages,
        250);
    }
  }

  //Clickar en un usuario conectado y crear div en #navbarChatPrivate
  createChatPrivate(email1: string, email2: string) {
    //console.log('createChatPrivate: ' + email1 + ' / ' + email2)
    let idChatPrivate = this.mergeEmails(email1, email2);
    if ($('#' + idChatPrivate).length === 0) {
      $('#navbarChatPrivate').append(
        '<div id="' + idChatPrivate + '" class="btn chat-private col-auto card p-2" data-email1="' + email1 + '" data-email2="' + email2 + '"  >' +
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

  /*
  Mostrar solo mensajes de la caja de chat correspondiente al usuario
  igualar #message-header .text() a message-email-{{ msg.email1 }} y a message-email-{{ msg.email2 }}
  */
  showCorrespondingMessages() {
    console.log('showCorrespondingMessages()');

    let email1 = localStorage.getItem('userLoged');
    let email2 = $('#message-header').text();

    if (email1 && email2) {
      email1 = email1.split('@')[0];
      email2 = email2.split('@')[0];
    }
    console.log('... ' + email1 + ', ' + email2);
    $('.message').addClass('d-none');
    $('.message-email-' + email1+'-'+email2).removeClass('d-none');
    $('.message-email-' + email2+'-'+email1).addClass('msg-email2-left');
    $('.message-email-' + email2+'-'+email1).removeClass('d-none');
  }

  showCorrespondingMessages2(email2: string){
    console.log('showCorrespondingMessages2()');
    let email1 = localStorage.getItem('userLoged');
    if (email1 && email2) {
      email1 = email1.split('@')[0];
      email2 = email2.split('@')[0];
    }
    console.log('... ' + email1 + ', ' + email2);
    $('.message').addClass('d-none');
    $('.message-email-' + email1+'-'+email2).removeClass('d-none');
    $('.message-email-' + email2+'-'+email1).addClass('msg-email2-left');
    $('.message-email-' + email2+'-'+email1).removeClass('d-none');
  }
}
