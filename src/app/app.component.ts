import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'formreactive';
  subscription: Subscription = new Subscription();
  form: FormGroup<any> = new FormGroup({
    nom: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(4),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^225\\s\\d{10}$'),
    ]),
    message: new FormControl('', [Validators.required]),
  });
  get nom() {
    return this.form.get('nom');
  }
  public erreursForm: { [field: string]: string } = {
    nom: '',
    email: '',
    phone: '',
    message: '',
  };
  public messageErreur: { [field: string]: { [field: string]: string } } = {
    nom: {
      required: 'le nom est requis svp',
      minlength:
        'le nom doit avoir un nombre de caractere minimal supérieur a 4',
      maxlength: 'le nom doit avoir un nombre de caractere maximal de 10',
    },
    email: {
      required: ' vous devez saisir un email svp',
      email: 'cet email nest pas valide',
    },
    phone: {
      required: 'Numero de telephone requis',
      pattern: 'format du numero invalide',
    },
    message: {
      required: 'vous devez ecrire un message svp',
    },
  };
  constructor() {}

  nomMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.get('nom')!.value == 'lemuel' ? { nomMatch: true } : null;
    };
  }
  emailsMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let dd = control.get('nom')!.value == 'lemuel' ? { noMatch: true } : null;
      return dd;
    };
  }

  StatusForm() {
    if (!this.form) {
      return;
    }
    const form = this.form;
    for (let field in this.erreursForm) {
      this.erreursForm[field] = '';
      let control: AbstractControl;
      control = form.get(field)!;

      if (control && control.touched && control.invalid) {
        const messages = this.messageErreur[field];
        for (const key in control.errors) {
          this.erreursForm[field] = messages[key] + ' ';
        }
      }
    }
  }
  valider() {
    console.log(this.form);
  }
  ngOnInit(): void {
    this.subscription.add(
      this.form.statusChanges.subscribe(() => {
        this.StatusForm();
      })
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
