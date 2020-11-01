import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-passreset',
  templateUrl: './passreset.component.html',
  styleUrls: ['./passreset.component.scss'],
})
export class PassresetComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  resetPassword: FormGroup;

  async ngOnInit(): Promise<void> {
    this.resetPassword = this.formBuilder.group(
      {
        previouspass: ['', [Validators.required]],
        newpass: ['', [Validators.required, Validators.minLength(8)]],
        newpassconfirm: ['', Validators.required],
      },
      { validator: this.Match('newpass', 'newpassconfirm') }
    );
  }

  Match(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.Match) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ Match: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit() {}
}
