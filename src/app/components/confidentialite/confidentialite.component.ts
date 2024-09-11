import { Component } from '@angular/core';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-confidentialite',
  standalone: true,
  imports: [ContactFormComponent, RouterModule],
  templateUrl: './confidentialite.component.html',
  styleUrl: './confidentialite.component.scss'
})
export class ConfidentialiteComponent {

}
