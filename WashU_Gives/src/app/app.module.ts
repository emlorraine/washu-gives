import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRountingModule, RoutingComponents } from "./app.routing";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header";
import { FilterFormComponent } from "./filter-form";

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from "./environments/environment";
import { AngularFireAuthModule } from "@angular/fire/auth";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRountingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  declarations: [
    AppComponent,
    RoutingComponents,
    HeaderComponent,
    FilterFormComponent,
  ],
  providers: [],
  bootstrap: [
    AppComponent,
    RoutingComponents,
    HeaderComponent,
    FilterFormComponent,
  ],
})
@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
})
export class AppModule {}
