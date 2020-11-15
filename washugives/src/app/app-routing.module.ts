import { NgModule } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, RouterModule } from '@angular/router';
import { Injectable } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { MailboxComponent } from './mailbox/mailbox.component';
import { PassresetComponent } from './passreset/passreset.component';
import { AppFormComponent } from './app-form/app-form.component';
import { CardsComponent } from './cards/cards.component';


const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'mailbox', component: MailboxComponent },
  { path: 'passreset', component: PassresetComponent },
  { path: 'addListing', component: AppFormComponent },
  { path: 'cards', component: CardsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
