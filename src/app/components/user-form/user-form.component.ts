// src/app/components/user-form/user-form.component.ts
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
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnChanges {
  /** Si on passe un user, on est en mode édition */
  @Input() user: User | null = null;
  @Output() saved = new EventEmitter<void>();

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      mdp: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      if (this.user) {
        // Patch du username, on ne préremplit pas le mdp pour la sécurité
        this.userForm.patchValue({ username: this.user.username, mdp: '' });
        // En édition, mdp est optionnel (on ne change que si l’utilisateur le renseigne)
        this.userForm.get('username')?.enable();
      } else {
        this.userForm.reset({
          username: '',
          mdp: ''
        });
      }
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value as { username: string; mdp: string };

    if (this.user) {
      // En édition : n’envoyer mdp que si renseigné
      const payload: any = { username: formValue.username };
      if (formValue.mdp) payload.mdp = formValue.mdp;

      this.userService.updateUser(this.user.id, payload).subscribe({
        next: () => {
          alert('Utilisateur mis à jour');
          this.saved.emit();
        },
        error: (err) => console.error(err)
      });
    } else {
      // En création : username + mdp obligatoires
      this.userService.createUser(formValue).subscribe({
        next: () => {
          alert('Utilisateur créé');
          this.saved.emit();
          this.userForm.reset({ username: '', mdp: '' });
        },
        error: (err) => console.error(err)
      });
    }
  }
}
