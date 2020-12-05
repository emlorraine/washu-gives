import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { AuthGuardService } from './services/auth.service';

import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { MailboxComponent } from './mailbox/mailbox.component';
import { PassresetComponent } from './passreset/passreset.component';
import { AppFormComponent } from './app-form/app-form.component';
import { CardsComponent } from './cards/cards.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['home']);

const routes: Routes = [

  { path: '', 
    component: LoginComponent,
  },
  { path: 'home', 
    component: HomeComponent, 
    canActivate : [AuthGuardService]
  },
  { path: 'register', 
    component: RegistrationComponent,
  },
  { path: 'forgotPassword',
    component: ForgotpasswordComponent
  },
  { path: 'profile', 
    component: ProfileComponent,
    canActivate : [AuthGuardService]

  },
  { path: 'mailbox', 
    component: MailboxComponent,
    canActivate : [AuthGuardService]

  },
  { path: 'passreset',
    component: PassresetComponent,
    canActivate : [AuthGuardService]

  },
  { path: 'addListing', 
    component: AppFormComponent,
    canActivate : [AuthGuardService]

  },
  { path: 'cards', 
    component: CardsComponent,
    canActivate : [AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
