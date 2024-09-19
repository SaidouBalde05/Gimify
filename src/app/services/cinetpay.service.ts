import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

declare var CinetPay: any;

@Injectable({
  providedIn: 'root'
})
export class CinetpayService {

  constructor(
   private http: HttpClient
  ) {
    this.loadCinetPayScript();
  }

  private loadCinetPayScript() {
    const script = document.createElement('script');
    script.src = 'https://cdn.cinetpay.com/seamless/main.js';
    script.async = true;
    document.body.appendChild(script);
  }

  checkout(amount: number, description: string) {
    CinetPay.setConfig({
      apikey: '193548841366cf18314b6bd4.67346812', // Votre APIKEY
      site_id: '5878798', // Votre SITE_ID
      mode: 'PRODUCTION'
    });
  
    CinetPay.getCheckout({
      transaction_id: Math.floor(Math.random() * 100000000).toString(), // ID de transaction
      amount: amount,
      currency: 'GNF',
      channels: 'ALL',
      description: description,
    });
  
    CinetPay.waitResponse((data: any) => {
      if (data.status === 'REFUSED') {
        if (confirm('Votre paiement a échoué')) {
          window.location.reload();
        }
      } else if (data.status === 'ACCEPTED') {
        if (confirm('Votre paiement a été effectué avec succès')) {
          window.location.reload();
        }
      }
    });
  
    CinetPay.onError((data: any) => {
      console.error(data);
    });

  }
} 