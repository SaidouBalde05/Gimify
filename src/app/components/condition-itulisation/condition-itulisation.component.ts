import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfidentialiteComponent } from '../confidentialite/confidentialite.component';
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
  selector: 'app-condition-itulisation',
  standalone: true,
  imports: [RouterLink, ConfidentialiteComponent, ContactFormComponent],
  templateUrl: './condition-itulisation.component.html',
  styleUrl: './condition-itulisation.component.scss'
})
export class ConditionItulisationComponent {

}
