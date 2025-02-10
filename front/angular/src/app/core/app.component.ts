import { Component } from '@angular/core';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/services/users.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'NEST ANGULAR MONGODB APP';

  user = {} as User;

  storedUser: string | null = "";

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.getUserInLocalStorage();
  }

  slideNavbar(){
    $('#navbarResponsive').slideToggle();
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
      if(this.storedUser){
        this.getUserInLocalStorageData(this.storedUser);
      }
    }
  }

  /*
  changeLang(event: Event) {
    const target = event.target as HTMLElement;
    const lang = target.getAttribute('valueLang');

    if (lang) {
      this.translate.use(lang);
    }
  }
  */


}
