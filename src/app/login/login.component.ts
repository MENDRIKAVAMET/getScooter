import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  f!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.f = this.fb.group({
      username: ['', Validators.required],
      mdp: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.f.invalid) {
      this.f.markAllAsTouched();
      return;
    }

    const { username, mdp } = this.f.value;
    this.auth.login(username!, mdp!).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('Échec login :', err);
        alert('Identifiants incorrects');
      }
    });
  }
}
