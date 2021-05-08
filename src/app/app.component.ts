import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) { }

  title = 'emids-az-exam';
  public patientForm: FormGroup;

  ngOnInit(): void {
    this.patientForm = this.formBuilder.group({
      patientId: [''],
      patientName: ['', [Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)]],
      patientDob: [''],
      patientEmail: ['', [Validators.required]],
      patientImage: ['', this.urlValidator]
    });

  }

  addPatient(): any {
    return this.patientForm;
  }

  get patient(): any {
    return this.patientForm.controls;
  }

  urlValidator: ValidatorFn = (control: AbstractControl) => {
    let validUrl = true;

    try {
      if (control.value === '')
        return null;
      validUrl = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?').test(control.value);
    } catch {
      validUrl = false;
    }

    return validUrl ? null : { invalidUrl: true };
  }

}
