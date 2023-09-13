import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test-app';
  birthdate: string;

  serverEmail: string = "test2@test.test"
  enteredEmail = ""

  error: boolean = false
  errorHobby: boolean = false

  technology = [
    {
      name: "angular",
    },
    {
      name: "react",
    },
    {
      name: "vue",
    },
  ]

  hobbies: { name: string, duration: string }[] = [];
  hobbyName: string = '';
  durationName: string = '';

  selectedFramework: string
  selectedVersion: string

  frameworkVersions: { [key: string]: string[] } = {
    angular: ['1.1.1', '1.2.1', '1.3.3'],
    react: ['2.1.2', '3.2.4', '4.3.1'],
    vue: ['3.3.1', '5.2.1', '5.1.3']
  };

  formInfo: FormGroup
  hobbyForm: FormGroup

  constructor(private formBuilder: FormBuilder,) {
    this.hobbyForm = this.formBuilder.group({
      hobby: new FormControl("", [Validators.required]),
      duration: new FormControl("", [Validators.required]),
    })

    this.formInfo = this.formBuilder.group({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      dateOfBirth: new FormControl("", [Validators.required]),
      framework: new FormControl("", [Validators.required]),
      frameworkVersion: new FormControl("", [Validators.required]),
      email: ["", [Validators.required, Validators.email], [this.emailAsyncValidator()]],
      hobbies: new FormControl("", []),
    })

    this.selectedFramework !== 'undefined' ? this.selectedFramework : '';
    this.selectedVersion !== 'undefined' ? this.selectedVersion : '';
  }

  ngOnInit() {
    if (this.selectedFramework === undefined) {
      this.formInfo.get('frameworkVersion')?.disable();
    } else {
      this.formInfo.get('frameworkVersion')?.enable();
    }
  }


  emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;
      return of(null).pipe(
        delay(2000),
        map(() => {
          if (email === 'test@test.test') {
            return { emailTaken: true };
          } else {
            return null;
          }
        }),
        catchError(() => of(null))
      );
    };
  }

  addHobby() {
    if (!this.hobbyName || !this.durationName) {
      return
    }
    this.hobbies.push({ name: this.hobbyName, duration: this.durationName });
    this.hobbyName = '';
    this.durationName = ''
  }

  onFrameworkChange() {
    console.log(this.selectedFramework);
    if (this.selectedFramework === undefined) {
      this.formInfo.get('frameworkVersion')?.disable();
    } else {
      this.formInfo.get('frameworkVersion')?.enable();
    }
  }

  emailValid(email: any): Observable<any> {
    if (email === 'test@test.test') {
      const error = { emailExists: true };
      const emailControl = this.formInfo.get('email');

      if (emailControl) {
        emailControl.setErrors(error)
      }
      return of(error);
    } else {
      return of(null);
    }
  }


  get firstName(): FormControl {
    return this.formInfo.get("firstName") as FormControl;
  }

  get lastName(): FormControl {
    return this.formInfo.get("lastName") as FormControl;
  }

  get dateOfBirth(): FormControl {
    return this.formInfo.get("dateOfBirth") as FormControl;
  }

  get framework(): FormControl {
    return this.formInfo.get("framework") as FormControl;
  }

  get frameworkVersion(): FormControl {
    return this.formInfo.get("frameworkVersion") as FormControl;
  }

  get email(): FormControl {
    return this.formInfo.get("email") as FormControl;
  }


  get duration(): FormControl {
    return this.hobbyForm.get("duration") as FormControl;
  }

  get hobby(): FormControl {
    return this.hobbyForm.get("hobby") as FormControl;
  }


  postForm() {
    if (this.formInfo.valid && this.hobbies.length > 0) {
      this.formInfo.patchValue({
        hobbies: this.hobbies
      });
      this.errorHobby = false
      this.hobbyName = '';
      this.durationName = '';
    } else {
      this.errorHobby = true
      this.markFormGroupTouched(this.formInfo);
      return
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

