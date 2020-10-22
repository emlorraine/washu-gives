import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { AppFormComponent } from './app-form/app-form.component';
import { FilterFormComponent } from './filter-form/filter-form.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent, HeaderComponent, AppFormComponent, FilterFormComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, AngularFireModule.initializeApp(environment.firebase),
 	AngularFirestoreModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
