import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'header-component',
  templateUrl: 'header.component.html',
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
