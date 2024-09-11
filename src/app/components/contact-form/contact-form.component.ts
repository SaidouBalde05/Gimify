import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  private apiUrl = 'http://localhost:3000/contact';

  name: string = '';
  email: string = '';
  message: string = '';
  texte = 'veiller remplire ce formulaire'

  constructor(private http: HttpClient) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const contactData = {
      name: this.name,
      email: this.email,
      message: this.message,
      date: new Date().toISOString() 
    };

    this.http.post(this.apiUrl, contactData).subscribe({
      next: (response) => {
        console.log('Message envoyé avec succès', response);
        this.name = '';
        this.email = '';
        this.message = '';
        form.resetForm();
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi du message', error);
      }
    });
  }
}
