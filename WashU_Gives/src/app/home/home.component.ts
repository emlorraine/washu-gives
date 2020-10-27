import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { first } from "rxjs/operators";
import { HeaderComponent } from "../header";

@Component({ selector: "home-component", templateUrl: "home.component.html" })
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
