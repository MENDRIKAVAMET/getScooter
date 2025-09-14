// src/app/components/scooter-form/scooter-form.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Scooter, ScooterService } from '../../services/scooter.service';

@Component({
  selector: 'app-scooter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './scooter-form.component.html',
  styleUrls: ['./scooter-form.component.css']
})
export class ScooterFormComponent implements OnChanges {
  @Input() scooter: Scooter | null = null;
  @Output() saved = new EventEmitter<void>();

  scooterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private scooterService: ScooterService
  ) {
    this.scooterForm = this.fb.group({
      ref_scooter: ['', Validators.required],
      marque: ['', Validators.required],
      modele: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      quantite_stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scooter'] && this.scooter) {
      // Si on édite, on remplit le formulaire avec les valeurs existantes
      this.scooterForm.patchValue(this.scooter);
      // On bloque la référence si on est en modification
      this.scooterForm.get('ref_scooter')?.disable();
    } else {
      // Si nouveau, on s'assure que la référence est déverrouillée et formulaire remis à zéro
      this.scooterForm.reset();
      this.scooterForm.get('ref_scooter')?.enable();
    }
  }

  onSubmit(): void {
    if (this.scooterForm.invalid) return;

    // On lit les valeurs (réactives), on reconstruit l’objet
    const formValue = this.scooterForm.getRawValue() as Scooter; 
    if (this.scooter) {
      // Mode édition
      this.scooterService.update(formValue).subscribe({
        next: () => {
          this.saved.emit();
        },
        error: (err) => console.error(err)
      });
    } else {
      // Mode création
      this.scooterService.create(formValue).subscribe({
        next: () => {
          this.saved.emit();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
