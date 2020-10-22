import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { AppFormComponent } from './app-form/app-form.component';
import { FilterFormComponent } from './filter-form/filter-form.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent, HeaderComponent, AppFormComponent, FilterFormComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule,   AngularFireModule.initializeApp(environment.firebase),
  AngularFirestoreModule, AngularFireAuthModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
