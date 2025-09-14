import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Client, ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
})
export class ClientFormComponent implements OnChanges{
  clientForm: FormGroup;

  @Input() client: Client | null = null;
  @Output() saved = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private clientService: ClientService) {
    this.clientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      phone: ['', Validators.required],
      cin: ['', Validators.required],
      pays: ['', Validators.required],
      ville: ['', Validators.required],
      date_naiss: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['client'] && this.client){
      this.clientForm.patchValue(this.client);
    }
  }

  onSubmit() {
    if (this.client){
      const updated = {...this.client, ...this.clientForm.value };
      this.clientService.updateClient(updated).subscribe(() => {
        this.saved.emit();
        this.clientForm.reset();
      });
    }
    else{
      this.clientService.addClient(this.clientForm.value).subscribe(()=> {
        this.saved.emit();
        this.clientForm.reset();
      });
    }
  }
}
