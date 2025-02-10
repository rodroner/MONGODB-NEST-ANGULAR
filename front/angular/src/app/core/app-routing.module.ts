import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from '../users/users.component';
import { InitComponent } from '../init/init.component';
import { ChatComponent } from '../chat/chat.component';

const routes: Routes = [
  { path: '', component: InitComponent},
  { path: 'users', component: UsersComponent},
  { path: 'chat', component: ChatComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
