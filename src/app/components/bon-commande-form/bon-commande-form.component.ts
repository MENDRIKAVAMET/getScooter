// src/app/components/bon-commande-form/bon-commande-form.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { BonCommande, Contenir, BonCommandeService } from '../../services/bon-commande.service';
import { ClientService, Client } from '../../services/client.service';
import { ScooterService, Scooter } from '../../services/scooter.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bon-commande-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bon-commande-form.component.html',
  styleUrls: ['./bon-commande-form.component.css']
})
export class BonCommandeFormComponent implements OnInit, OnChanges {
  /** Si on passe un objet BonCommande existant, on est en mode édition */
  @Input() bonCommande: BonCommande | null = null;

  /** Émis lorsqu’un bon + sa ligne sont créés/modifiés */
  @Output() saved = new EventEmitter<void>();

  bonForm: FormGroup;

  // Listes pour combos
  clients$!: Observable<Client[]>;
  scooters$!: Observable<Scooter[]>;

  // Prix courant du scooter sélectionné
  prixScooter = 0;

  constructor(
    private fb: FormBuilder,
    private bonService: BonCommandeService,
    private clientService: ClientService,
    private scooterService: ScooterService
  ) {
    this.bonForm = this.fb.group({
      id_client: [null, Validators.required],
      ref_scooter: [null, Validators.required],
      quantite_cmd: [1, [Validators.required, Validators.min(1)]],
      date_cmd: [new Date().toISOString().substring(0, 10), Validators.required],
      remise: [0, [Validators.required, Validators.min(0), Validators.max(100)]],  // % modifiable
      prix_unitaire: [{ value: 0, disabled: true }],
      total_ht: [{ value: 0, disabled: true }],
      tva: [{ value: 20, disabled: true }],  // % fixe
      total_ttc: [{ value: 0, disabled: true }]
    });
  }

  ngOnInit(): void {
    // Charger la liste des clients et scooters pour les combos
    this.clients$ = this.clientService.getClients();
    this.scooters$ = this.scooterService.getAll();

    // Recalculer chaque fois qu’on change ref_scooter, quantite_cmd ou remise
    this.bonForm.get('ref_scooter')!.valueChanges.subscribe((ref: string) => {
      if (ref) {
        // Récupérer le prix du scooter choisi
        this.scooterService.getOne(ref).subscribe({
          next: (scooter) => {
            this.prixScooter = scooter.prix;
            this.bonForm.get('prix_unitaire')!.setValue(this.prixScooter);
            this.recalculerSousTotaux();
          },
          error: (err) => {
            console.error(err);
            this.prixScooter = 0;
            this.bonForm.get('prix_unitaire')!.setValue(0);
            this.recalculerSousTotaux();
          }
        });
      } else {
        this.prixScooter = 0;
        this.bonForm.get('prix_unitaire')!.setValue(0);
        this.recalculerSousTotaux();
      }
    });

    // Quand quantité change
    this.bonForm.get('quantite_cmd')!.valueChanges.subscribe(() => {
      this.recalculerSousTotaux();
    });

    // Quand remise change
    this.bonForm.get('remise')!.valueChanges.subscribe(() => {
      this.recalculerSousTotaux();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bonCommande']) {
      if (this.bonCommande) {
        // ► Mode édition : pré-remplir champs
        this.bonForm.patchValue({
          id_client: this.bonCommande.id_client,
          // On n’édite pas ref_scooter ou quantite dans ce composant,
          // mais si on veut le remplir, on peut :
          ref_scooter: this.bonCommande.contenirs?.[0]?.ref_scooter || null,
          quantite_cmd: this.bonCommande.contenirs?.[0]?.quantite_cmd || 1,
          date_cmd: this.bonCommande.contenirs?.[0]?.date_cmd || new Date().toISOString().substring(0, 10),
          remise: this.bonCommande.contenirs?.[0]?.remise || 0
        });

        // Récupérer prix et recalculer
        const selectedRef = this.bonCommande.contenirs?.[0]?.ref_scooter;
        if (selectedRef) {
          this.scooterService.getOne(selectedRef).subscribe({
            next: (scooter) => {
              this.prixScooter = scooter.prix;
              this.bonForm.get('prix_unitaire')!.setValue(this.prixScooter);
              this.recalculerSousTotaux();
            },
            error: () => {
              this.prixScooter = 0;
              this.bonForm.get('prix_unitaire')!.setValue(0);
              this.recalculerSousTotaux();
            }
          });
        }
        // Bloquer champ id_client en édition
        this.bonForm.get('id_client')!.disable();
        // Bloquer ref_scooter si on ne veut pas le changer
        this.bonForm.get('ref_scooter')!.disable();
      } else {
        // ► Mode création : réinitialiser tout
        this.bonForm.reset({
          id_client: null,
          ref_scooter: null,
          quantite_cmd: 1,
          date_cmd: new Date().toISOString().substring(0, 10),
          remise: 0,
          prix_unitaire: 0,
          total_ht: 0,
          tva: 0,
          total_ttc: 0
        });
        this.prixScooter = 0;
        this.bonForm.get('id_client')!.enable();
        this.bonForm.get('ref_scooter')!.enable();
      }
    }
  }

  /** Recalcule total_ht, tva et total_ttc */
  private recalculerSousTotaux(): void {
    const qty = this.bonForm.get('quantite_cmd')!.value || 0;
    const remisePourcent = this.bonForm.get('remise')!.value || 0;
    const tvaPourcent = 20;  // fixe, à ne pas modifier

    const prixTotalBrut = this.prixScooter * qty;
    const remiseMontant = prixTotalBrut * (remisePourcent / 100);
    const totalHT = prixTotalBrut - remiseMontant;
    const tvaMontant = totalHT * (tvaPourcent / 100);
    const totalTTC = totalHT + tvaMontant;

    this.bonForm.get('total_ht')!.setValue(totalHT.toFixed(2), { emitEvent: false });
    this.bonForm.get('tva')!.setValue(tvaPourcent, { emitEvent: false }); // % affiché
    this.bonForm.get('total_ttc')!.setValue(totalTTC.toFixed(2), { emitEvent: false });
  }


  onSubmit(): void {
    console.log('onSubmit appelé, bonForm.valid=', this.bonForm.valid, this.bonForm.value);

    if (this.bonForm.invalid) {
      return;
    }

    // Construire l’objet BonCommande avec une seule ligne
    const formValue = this.bonForm.getRawValue();
    const ligne: Contenir = {
      ref_scooter: formValue.ref_scooter,
      quantite_cmd: Number(formValue.quantite_cmd),
      date_cmd: formValue.date_cmd,
      remise: Number(formValue.remise), // en pourcentage
      total_prix: parseFloat(formValue.total_ht)
    };

    const payload: Partial<BonCommande> = {
      id_client: Number(formValue.id_client),
      total_ht: parseFloat(formValue.total_ht),
      tva: 20,  // pourcentage fixe
      total_ttc: parseFloat(formValue.total_ttc),
      contenirs: [ligne]
    };

    console.log('payload crée');

    if (this.bonCommande) {
      // ► Mode édition (on met à jour les totaux, et éventuellement on ne change pas la ligne)
      // 1) on met à jour d’abord les totaux
      this.bonService.update(this.bonCommande.id_bon, {
        total_ht: parseFloat(formValue.total_ht),
        tva: 20,
        total_ttc: parseFloat(formValue.total_ttc)
      }).subscribe({
        next: () => {
          // 2) puis on met à jour la ligne existante
          this.bonService.updateLigne(
            this.bonCommande!.id_bon,
            this.bonCommande!.contenirs![0].ref_scooter,
            {
              quantite_cmd: Number(formValue.quantite_cmd),
              date_cmd: formValue.date_cmd,
              remise: Number(formValue.remise),
              total_prix: parseFloat(formValue.total_ht)
            }
          ).subscribe({
            next: () => { alert('Commande modifiée'); this.saved.emit(); this.bonForm.reset(); },
            error: err => console.error('Erreur update ligne', err)
          });
        },
        error: err => console.error('Erreur update totaux', err)
      });

    } else {
      // ► Mode création
      this.bonService.create(payload).subscribe({
        next: () => {
          alert('Commande créée');
          this.saved.emit();
          this.bonForm.reset({
            id_client: null,
            ref_scooter: null,
            quantite_cmd: 1,
            date_cmd: new Date().toISOString().substring(0, 10),
            remise: 0,
            prix_unitaire: 0,
            total_ht: 0,
            tva: 20,
            total_ttc: 0
          });
          this.bonForm.reset();
        },
        error: (err) => {
          console.error('Erreur create : ', err);
          alert(JSON.stringify(err.error.message, null, 2));
        }
      });
    }
  }
}
