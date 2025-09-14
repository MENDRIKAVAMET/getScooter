// src/app/components/user-list/user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error(err)
    });
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
  }

  deleteUser(id: number): void {
    if (!confirm(`Supprimer l’utilisateur ${id} ?`)) return;
    this.userService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error(err)
    });
  }

  onSaved(): void {
    this.selectedUser = null;
    this.loadUsers();
  }
}
