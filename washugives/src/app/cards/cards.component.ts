import { Component, OnInit, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { first } from 'rxjs/operators';



@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  @Input("card") card: any; 
  
  constructor() { }

  ngOnInit(): void {}
}
