import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ngModel
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { InitService } from './services/init.service';

import { User } from '../users/models/user.model';
import { UsersService } from '../users/services/users.service';
import { AppComponent } from '../core/app.component';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ]
})
export class InitComponent {

  user = {} as User

  userRegister = {
    name: "",
    email: "",
    password: "",
    password_2: "",
  }

  storedUser: string | null = "";

  constructor(
    private initService: InitService,
    private usersService: UsersService,
    private appComponent: AppComponent
  ) { }

  ngOnInit(): void {
    // Reiniciar el formulario
    this.user = {
      id: "",
      name: "",
      email: "",
      password: "",
    } as User;

    // Reiniciar el formulario
    this.userRegister = {
      name: "",
      email: "",
      password: "",
      password_2: ""
    };

    this.getUserInLocalStorage();
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
        console.log('this.getUserInLocalStorageData(' + this.storedUser + ');')
        this.getUserInLocalStorageData(this.storedUser);
        this.appComponent.getUserInLocalStorage();
      }
    }
  }

  disconnect() {
    if (typeof window !== 'undefined' && window.localStorage) {
      Swal.fire({
        title: this.storedUser + ' ha sido desconectado',
        icon: 'warning',
        customClass: {
          popup: 'alert alert-danger',
        },
        timer: 2000,
        timerProgressBar: true,
      }).then(async () => { // Usa async para manejar correctamente la promesa
        if (this.storedUser) {
          this.initService.disconnect(this.storedUser).subscribe({
            next: (response) => {
              //console.log('Desconectado:', response);
              localStorage.removeItem('userLoged');
              window.location.reload();
            },
            error: (err) => console.error('Error al desconectar:', err)
          });
        }
      });
    }
    // Reiniciar el formulario
    this.user = {
      id: "",
      name: "",
      email: "",
      password: "",
    } as User;

    this.userRegister = {
      name: "",
      email: "",
      password: "",
      password_2: ""
    };
  }

  onLoginSubmit() {
    if (!this.user.email || !this.user.password) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos',
        icon: 'error',
      });
      return;
    }

    this.initService.login(this.user.email, this.user.password).subscribe({
      next: (response) => {
        localStorage.setItem('userLoged', response.user.email);
        Swal.fire({
          title: 'Bienvenido',
          text: `Hola, ${response.user.name} / ${response.user.email}`,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
        });
        this.getUserInLocalStorage();
      },
      error: (err) => {
        Swal.fire({
          title: 'Error de inicio de sesión',
          text: err.error.message || 'Credenciales inválidas',
          icon: 'error',
        });
      },
    });
  }

  passwordsMatch(): boolean {
    return this.userRegister.password === this.userRegister.password_2;
  }

  onRegisterSubmit() {
    if (!this.userRegister.name || !this.userRegister.email || !this.userRegister.password || !this.userRegister.password_2) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos',
        icon: 'error',
      });
      return;
    }

    if (!this.passwordsMatch()) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        icon: 'error',
      });
      return;
    }

    this.initService.register({
      name: this.userRegister.name,
      email: this.userRegister.email,
      password: this.userRegister.password,
    }).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Registro exitoso',
          text: `Usuario ${response.user.name} / ${response.user.email} registrado correctamente`,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
        });

        //LocalStorage
        console.log('userLoged (response.user.email): ' + response.user.email)
        localStorage.setItem('userLoged', response.user.email);
        this.storedUser = response.user.email;
        this.getUserInLocalStorage();
      },
      error: (err) => {
        Swal.fire({
          title: 'Error de registro',
          text: err.error.message || 'Hubo un error durante el registro',
          icon: 'error',
        });
      },
    });

    // Reiniciar el formulario
    this.userRegister = {
      name: "",
      email: "",
      password: "",
      password_2: ""
    };
  }
}
