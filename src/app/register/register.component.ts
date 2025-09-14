import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { RouterModule, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { RegisterDto } from '../models/register.dto';

@Component({
  selector: 'app-register',
  imports: [RouterModule, NgIf, ReactiveFormsModule, FormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  message: string ="";

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      plainPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if(this.registerForm.invalid)
    {
      this.message = 'Tous les champs sont requis';
      return;
    }
    const data: RegisterDto = this.registerForm.value;
    this.userService.register(data).subscribe({
      next: () => console.log('Inscription réussie'),
      error: err => console.error('Erreur :', err)
    });
  }
}
