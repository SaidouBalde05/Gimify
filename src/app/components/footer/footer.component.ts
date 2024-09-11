import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { ConditionItulisationComponent } from '../condition-itulisation/condition-itulisation.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    ContactFormComponent,
    ConditionItulisationComponent,
    RouterLink,
    ContactFormComponent
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  showContactForm = false;

  @ViewChild('contactForm', { static: false }) contactForm: ElementRef<any> | undefined;

  toggleContactForm(event: Event) {
    event.preventDefault(); // Empêche le comportement par défaut du lien

    this.showContactForm = !this.showContactForm;

    if (this.showContactForm) {
      // Utiliser setTimeout pour s'assurer que l'élément est rendu avant le défilement
      setTimeout(() => {
        this.contactForm?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }
}
