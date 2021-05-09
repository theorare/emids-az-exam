import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { PatientDetail } from './model/patient.model';
import { PatientService } from './service/patient-data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private patientService: PatientService) { }

  title = 'emids-az-exam';
  public patientForm: FormGroup;
  newRecordFound: boolean = false;
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

  viewJson(): any {
    return this.patientForm.value;
  }

  async addPatient(): Promise<void> {
    let formValue = this.patientForm.value;
    let patientDetailRequest = new PatientDetail({
      id: formValue.patientId,
      name: formValue.patientName,
      dateOfBirth: formValue.patientDob,
      emailId: formValue.patientEmail,
      imageUrl: formValue.patientImage
    });
    await this.patientService
      .upsertPatientData(patientDetailRequest)
      .then((response) => {
        console.log(response);
        this.newRecordFound = true;
        alert('Record for patient ' + response.name + ' has been created. Scroll below to view the list');
        this.resetForm();
        
      })
      .catch((errors) => {
        console.log(errors);
      });
  }

  get patient(): any {
    return this.patientForm.controls;
  }

  resetForm() {
    let controlKeys = Object.keys(this.patientForm.controls) || [];
    controlKeys.forEach((c: string) => {
      this.patientForm.controls[c].reset();
      this.patientForm.controls[c].setValue('');
    });
    // this.newRecordFound = false;
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
