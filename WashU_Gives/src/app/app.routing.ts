import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login";
import { AppFormComponent } from "./app-form";
import { HomeComponent } from "./home";
import { NgModule } from "@angular/core";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "createEntry", component: AppFormComponent },
  { path: "home", component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRountingModule {}
export const RoutingComponents = [
  LoginComponent,
  AppFormComponent,
  HomeComponent,
];
