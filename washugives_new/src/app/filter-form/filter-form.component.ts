import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'filter-form',
  templateUrl: 'filter-form.component.html',
})
export class FilterFormComponent implements OnInit {
  filterForm: FormGroup;
  submitted = false;
  riskLevels: any = ['None', 'Low', 'Medium', 'High'];
  categories: any = [
    'Employment',
    'Food',
    'Housing',
    'Transportation',
    'Storage',
    'Support',
    'Other',
  ];
  affiliationOptions: String[] = [
    'Undergraduate',
    'Graduate',
    'Faculty or Staff',
  ];
  affiliation: String;
  undergraduateSchools: String[] = [
    'Arts & Sciences',
    'Engineering',
    'Olin',
    'Sam Fox',
  ];
  graduateSchools: String[] = this.undergraduateSchools.concat([
    'Law',
    'Medicine',
    'Brown',
  ]);
  yesOrNo: String[] = ['Yes', 'No'];
  limitation: String;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      //Required fields:
      category: [''],
      covidRisk: [''],
      affiliation: [''],
      limitations: [''],
      //Optional fields
      school: [''],
    });
  }

  displayAffiliationOptions() {
    this.affiliation = this.filterForm.getRawValue().affiliation;
  }

  get f() {
    return this.filterForm.controls;
  }

  onSubmit() {
    this.submitted = true;
  }
}
