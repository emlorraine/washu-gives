import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login";

const routes: Routes = [{ path: "login", component: LoginComponent }];

export const appRoutingModule = RouterModule.forRoot(routes);
