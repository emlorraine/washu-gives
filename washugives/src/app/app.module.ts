import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { AppFormComponent } from './app-form/app-form.component';
import { MatCardModule } from '@angular/material/card';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FirebaseService } from './services/firebase.service';
import { environment } from '../environments/environment';
import { CardsComponent } from './cards/cards.component';
import { StickyNavModule } from 'ng2-sticky-nav';
import { ProfileComponent } from './profile/profile.component';
import { MailboxComponent } from './mailbox/mailbox.component';
import { PassresetComponent } from './passreset/passreset.component';
import { ProfilePicComponent } from './profile-pic/profile-pic.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    AppFormComponent,
    CardsComponent,
    ProfileComponent,
    MailboxComponent,
    PassresetComponent,
    ProfilePicComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyDk9DOq-MEltxUk_wUCU1vCVdx6irwAZIw',
      authDomain: 'washu-gives-e891d.firebaseapp.com',
      databaseURL: 'https://washu-gives-e891d.firebaseio.com',
      projectId: 'washu-gives-e891d',
      storageBucket: 'washu-gives-e891d.appspot.com',
      messagingSenderId: '659039917754',
      appId: '1:659039917754:web:4b9f05951a3c00177e1483',
      measurementId: 'G-CDX36MBBPY',
    }),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    MatCardModule,
    StickyNavModule,
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent],
})
export class AppModule {}
