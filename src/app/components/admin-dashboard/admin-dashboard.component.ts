import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Music } from '../../models/music.model';
import { HttpClient } from '@angular/common/http';
import { Message } from '../../models/message.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {

  isAdmin: boolean = false;
  users: User[] = [];
  allPublications: Music[] = [];
  musicSales: { music: Music, sales: number }[] = [];
  totalAlbumsSold: number = 0;
  totalRevenue: number = 0;
  personalRevenue: { user: User, revenue: number }[] = [];
  totalPersonalRevenue: number = 0;
  messages: Message[] = [];
  showMessages = false;
  showUsers = false;
  showPublications = false;
  salesUrl = 'http://localhost:3000/sales';
  messageUrl = 'http://localhost:3000/contact';
  chart: Chart | undefined;

  constructor(
    private musicService: MusicService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    if (this.isAdmin) {
      this.initializeAdminData();
    }
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  // Méthode pour charger toutes les données administratives
  initializeAdminData(): void {
    this.loadUsers();
    this.loadAllPublications();
    this.loadMusicSales();
    this.loadMessages();
    this.loadPersonalRevenue();
    this.musicService.getWeeklySales().subscribe(data => {
      this.renderSalesChart(data, 'weeklySalesChart', 'Ventes Hebdomadaires');
    });
  }

  // Fusion des méthodes de toggle
  toggleSection(section: 'users' | 'publications' | 'messages'): void {
    if (section === 'users') this.showUsers = !this.showUsers;
    if (section === 'publications') this.showPublications = !this.showPublications;
    if (section === 'messages') this.showMessages = !this.showMessages;
  }

  // Fusion des méthodes de chargement des données de vente
  loadMusicSales(): void {
    this.totalAlbumsSold = 0;
    this.totalRevenue = 0;
    this.personalRevenue = [];

    this.http.get<any[]>(this.salesUrl).subscribe((salesData) => {
      const salesCount: { [key: string]: number } = {};

      salesData.forEach(sale => {
        salesCount[sale.musicId] = (salesCount[sale.musicId] || 0) + 1;
      });

      this.musicSales = this.allPublications.map(music => {
        const salesForMusic = salesCount[music.id!] || 0;
        const musicPrice = music.price || 0;

        this.totalAlbumsSold += salesForMusic;
        this.totalRevenue += salesForMusic * musicPrice;

        this.updateUserRevenue(salesData, music.id, musicPrice);

        return { music, sales: salesForMusic };
      });
    });
  }

  // Méthode pour mettre à jour les revenus de chaque utilisateur
  updateUserRevenue(salesData: any[], musicId: number | undefined, musicPrice: number): void {
    salesData.filter(sale => sale.musicId === musicId).forEach(sale => {
      const user = this.users.find(user => user.id === sale.userId);
      if (user) {
        let userRevenue = this.personalRevenue.find(pr => pr.user.id === user.id);
        if (!userRevenue) {
          userRevenue = { user, revenue: 0 };
          this.personalRevenue.push(userRevenue);
        }
        userRevenue.revenue += musicPrice;
      }
    });
  }

  // Méthode pour charger les messages
  loadMessages(): void {
    this.http.get<Message[]>(this.messageUrl).subscribe(data => {
      this.messages = data.map(message => ({
        ...message,
        isRead: message.isRead ?? false
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }

  // Méthode pour charger les utilisateurs
  loadUsers(): void {
    this.authService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  // Méthode pour charger toutes les publications
  loadAllPublications(): void {
    this.musicService.getAllMusics().subscribe(musics => {
      this.allPublications = musics;
    });
  }

  // Méthode pour charger le revenu personnel
  loadPersonalRevenue(): void {
    this.musicService.getTotalPersonalRevenue().subscribe(total => {
      this.totalPersonalRevenue = total;
    });
  }

  // Méthode pour créer un graphique
  createChart(): void {
    const canvas = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],  // À mettre à jour avec des mois réels
        datasets: [{
          label: 'Sales',
          data: [10, 20, 30, 40],  // À mettre à jour avec des données réelles
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true }
        }
      }
    });
  }

  // Méthode pour rendre un graphique générique
  renderSalesChart(salesData: any[], chartId: string, label: string): void {
    const canvas = document.getElementById(chartId) as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: salesData.map(sale => sale.week || sale.month),
        datasets: [{
          label,
          data: salesData.map(sale => sale.sales),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Méthode pour supprimer un utilisateur
  deleteUser(userId: number | undefined): void {
    if (userId && confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.authService.deleteUser(userId).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  // Méthode pour supprimer un album
  deleteAlbum(musicId: number | undefined): void {
    if (musicId && confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) {
      this.musicService.deleteMusic(musicId).subscribe(() => {
        this.loadAllPublications();
      });
    }
  }

  // Méthode pour modifier l'état de lecture d'un message
  toggleReadStatus(message: Message): void {
    message.isRead = !message.isRead;
    this.http.put(`${this.messageUrl}/${message.id}`, message).subscribe();
  }

  // Méthode pour supprimer un message
  deleteMessage(messageId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      this.http.delete(`${this.messageUrl}/${messageId}`).subscribe(() => {
        this.messages = this.messages.filter(message => message.id !== messageId);
      });
    }
  }

  // Compter le nombre de messages non lus
  getUnreadMessagesCount(): number {
    return this.messages.filter(message => !message.isRead).length;
  }
}








// import { AfterViewInit, Component, OnInit } from '@angular/core';
// import { MusicService } from '../../services/music.service';
// import { CommonModule, CurrencyPipe } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { User } from '../../models/user.model';
// import { Music } from '../../models/music.model';
// import { HttpClient } from '@angular/common/http';
// import { Message } from '../../models/message.model';
// import Chart from 'chart.js/auto';

// @Component({
//   selector: 'app-admin-dashboard',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.scss']
// })
// export class AdminDashboardComponent implements OnInit, AfterViewInit {

//   isAdmin: boolean = false;
//   users: User[] = [];
//   totalUsers: number = 0;
//   allPublications: Music[] = [];
//   musicSales: { music: Music, sales: number }[] = [];
//   totalAlbumsSold: number = 0;
//   totalRevenue: number = 0;
//   personalRevenue: { user: User, revenue: number }[] = [];
//   totalPersonalRevenue: number = 0;
//   monthlySales: { month: string, sales: number }[] = [];
//   weeklySales: { week: string, sales: number }[] = [];
//   messages: Message[] = [];
//   showMessages: boolean = false;
//   showUsers = false;  // Nouvelle variable pour contrôler l'affichage des utilisateurs
//   showPublications = false;  // Nouvelle variable pour contrôler l'affichage des publications
//   messageUrl = 'http://localhost:3000/contact';
//   salesUrl = 'http://localhost:3000/sales'; 
//   chart: Chart | undefined;

//   constructor(
//     private musicService: MusicService,
//     private authService: AuthService,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     this.isAdmin = this.authService.isAdmin();
//     if (!this.isAdmin) {
//       return;
//     }
//     this.loadUsers();
//     this.loadAllPublications();
//     this.loadMusicSales();
//     this.loadMessages();
//     this.loadTotalPersonalRevenue();

//     // Chargement des ventes hebdomadaires
//     this.musicService.getWeeklySales().subscribe(data => {
//       this.weeklySales = data;
//       this.renderWeeklySalesChart(); 
//     });
//   }
//   // debut 

//   toggleUsers(): void {
//     this.showUsers = !this.showUsers;
//   }

//   togglePublications(): void {
//     this.showPublications = !this.showPublications;
//   }

//   // Calculer le revenu personnel total
//   calculateTotalPersonalRevenue(): void {
//     this.musicService.getPersonalRevenueTotal().subscribe(total => {
//       this.totalPersonalRevenue = total;
//     });
//   }
  
//   // fin 

//   ngAfterViewInit(): void {
//     this.createChart();
//   }

//   createChart(): void {
//     const canvas = document.getElementById('salesChart') as HTMLCanvasElement;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     if (this.chart) this.chart.destroy();

//     this.chart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr'],  // Mettre à jour avec des mois réels
//         datasets: [{
//           label: 'Sales',
//           data: [10, 20, 30, 40],  // Mettre à jour avec des données réelles
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         scales: {
//           x: { beginAtZero: true },
//           y: { beginAtZero: true }
//         }
//       }
//     });
//   }

//   renderWeeklySalesChart(): void {
//     const ctx = document.getElementById('weeklySalesChart') as HTMLCanvasElement;
//     if (!ctx) return;

//     new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: this.weeklySales.map(sale => sale.week),
//         datasets: [{
//           label: 'Ventes Hebdomadaires',
//           data: this.weeklySales.map(sale => sale.sales),
//           borderColor: 'rgb(75, 192, 192)',
//           tension: 0.1
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });
//   }

//   renderMonthlySalesChart(): void {
//     const ctx = document.getElementById('monthlySalesChart') as HTMLCanvasElement;
//     if (!ctx) return;

//     new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: this.monthlySales.map(sale => sale.month),
//         datasets: [{
//           label: 'Ventes Mensuelles',
//           data: this.monthlySales.map(sale => sale.sales),
//           backgroundColor: 'rgba(54, 162, 235, 0.2)',
//           borderColor: 'rgba(54, 162, 235, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         scales: {
//           y: { beginAtZero: true }
//         },
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });
//   }

//   loadTotalPersonalRevenue(): void {
//     this.musicService.getTotalPersonalRevenue().subscribe((total) => {
//       this.totalPersonalRevenue = total;
//     });
//   }

//   loadMessages(): void {
//     this.http.get<Message[]>(`${this.messageUrl}`).subscribe(data => {
//       this.messages = data.map(message => ({
//         ...message,
//         isRead: message.isRead ?? false
//       })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//     });
//   }

//   toggleReadStatus(message: Message): void {
//     message.isRead = !message.isRead;
//     this.http.put(`${this.messageUrl}/${message.id}`, message).subscribe();
//   }

//   deleteMessage(messageId: number): void {
//     if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
//       this.http.delete(`${this.messageUrl}/${messageId}`).subscribe(() => {
//         this.messages = this.messages.filter(message => message.id !== messageId);
//       });
//     }
//   }

//   toggleMessages(): void {
//     this.showMessages = !this.showMessages;
//   }

//   getUnreadMessagesCount(): number {
//     return this.messages.filter(message => !message.isRead).length;
//   }

//   loadAllPublications(): void {
//     this.musicService.getAllMusics().subscribe((musics: Music[]) => {
//       this.allPublications = musics;
//     });
//   }
//   // debut 
//   loadMusicSales(): void {
//     this.totalAlbumsSold = 0;
//     this.totalRevenue = 0;
//     this.personalRevenue = [];
//     this.totalPersonalRevenue = 0;

//     this.http.get<any[]>(this.salesUrl).subscribe((salesData) => {
//       const salesCount: { [key: string]: number } = {};

//       salesData.forEach(sale => {
//         const musicId = sale.musicId;
//         if (!salesCount[musicId]) {
//           salesCount[musicId] = 0;
//         }
//         salesCount[musicId]++;
//       });

//       this.musicSales = this.allPublications.map(music => {
//         const musicId = music.id;
//         const salesForMusic = salesCount[musicId!] || 0;
//         const musicPrice = music.price || 0;

//         this.totalAlbumsSold += salesForMusic;
//         this.totalRevenue += salesForMusic * musicPrice;

//         salesData.filter(sale => sale.musicId === musicId).forEach(sale => {
//           const user = this.users.find(user => user.id === sale.userId);
//           if (user) {
//             let userRevenue = this.personalRevenue.find(pr => pr.user.id === user.id);
//             if (!userRevenue) {
//               userRevenue = { user, revenue: 0 };
//               this.personalRevenue.push(userRevenue);
//             }
//             userRevenue.revenue += musicPrice;
//           }
//         });

//         return { music, sales: salesForMusic };
//       });
//     });
//   }


//   // fin 

//   loadUsers(): void {
//     this.authService.getUsers().subscribe(users => {
//       this.users = users;
//       this.totalUsers = users.length;
//     });
//   }

//   deleteUser(userId: number | undefined): void {
//     if (userId !== undefined) {
//       if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
//         this.authService.deleteUser(userId).subscribe(() => {
//           this.loadUsers();
//         });
//       }
//     } else {
//       alert('ID utilisateur non défini');
//     }
//   }

//   deleteAlbum(musicId: number | undefined): void {
//     if (musicId !== undefined) {
//       if (confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) {
//         this.musicService.deleteMusic(musicId).subscribe(() => {
//           this.loadAllPublications();
//         });
//       }
//     } else {
//       alert('ID de l’album non défini');
//     }
//   }
  
// }





// import { AfterViewInit, Component, OnInit } from '@angular/core';
// import { MusicService } from '../../services/music.service';
// import { CommonModule, CurrencyPipe } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { User } from '../../models/user.model';
// import { Music } from '../../models/music.model';
// import { HttpClient } from '@angular/common/http';
// import { Message } from '../../models/message.model';
// import Chart from 'chart.js/auto';

// @Component({
//   selector: 'app-admin-dashboard',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.scss']
// })
// export class AdminDashboardComponent implements OnInit, AfterViewInit {

//   isAdmin: boolean = false;
//   users: User[] = [];
//   totalUsers: number = 0;
//   allPublications: Music[] = [];
//   musicSales: { music: Music, sales: number }[] = [];
//   totalAlbumsSold: number = 0;
//   totalRevenue: number = 0;
//   personalRevenue: { user: User, revenue: number }[] = [];
//   totalPersonalRevenue: number = 0;  // Nouveau total pour revenu personnel
//   monthlySales: { month: string, sales: number }[] = [];
//   weeklySales: { week: string, sales: number }[] = [];
//   messages: Message[] = [];
//   showMessages: boolean = false;
//   messageUrl = 'http://localhost:3000/contact';
//   salesUrl = 'http://localhost:3000/sales'; 
//   chart: Chart | undefined;

//   constructor(
//     private musicService: MusicService,
//     private authService: AuthService,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     this.isAdmin = this.authService.isAdmin();
//     if (!this.isAdmin) {
//       return;
//     }
//     this.loadUsers();
//     this.loadAllPublications();
//     this.loadMusicSales();
//     this.loadMessages();
//     this.loadTotalPersonalRevenue();  // Chargement du revenu personnel total

//     this.musicService.getWeeklySales().subscribe(data => {
//       this.weeklySales = data;
//       this.renderWeeklySalesChart(); 
//     });
//   }

//   ngAfterViewInit(): void {
//     this.createChart();
//   }

//   createChart(): void {
//     const canvas = document.getElementById('salesChart') as HTMLCanvasElement;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     if (this.chart) this.chart.destroy();

//     this.chart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr'],  // Mettre à jour avec des mois réels
//         datasets: [{
//           label: 'Sales',
//           data: [10, 20, 30, 40],  // Mettre à jour avec des données réelles
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         scales: {
//           x: { beginAtZero: true },
//           y: { beginAtZero: true }
//         }
//       }
//     });
//   }

//   renderWeeklySalesChart(): void {
//     const ctx = document.getElementById('weeklySalesChart') as HTMLCanvasElement;
//     if (!ctx) return;

//     new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: this.weeklySales.map(sale => sale.week),
//         datasets: [{
//           label: 'Ventes Hebdomadaires',
//           data: this.weeklySales.map(sale => sale.sales),
//           borderColor: 'rgb(75, 192, 192)',
//           tension: 0.1
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });
//   }

//   renderMonthlySalesChart(): void {
//     const ctx = document.getElementById('monthlySalesChart') as HTMLCanvasElement;
//     if (!ctx) return;

//     new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: this.monthlySales.map(sale => sale.month),
//         datasets: [{
//           label: 'Ventes Mensuelles',
//           data: this.monthlySales.map(sale => sale.sales),
//           backgroundColor: 'rgba(54, 162, 235, 0.2)',
//           borderColor: 'rgba(54, 162, 235, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         scales: {
//           y: { beginAtZero: true }
//         },
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });
//   }

//   // Nouvelle méthode pour charger le revenu personnel total
//   loadTotalPersonalRevenue(): void {
//     this.musicService.getTotalPersonalRevenue().subscribe((total) => {
//       this.totalPersonalRevenue = total;
//     });
//   }

//   loadMessages(): void {
//     this.http.get<Message[]>(`${this.messageUrl}`).subscribe(data => {
//       this.messages = data.map(message => ({
//         ...message,
//         isRead: message.isRead ?? false
//       })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//     });
//   }

//   toggleReadStatus(message: Message): void {
//     message.isRead = !message.isRead;
//     this.http.put(`${this.messageUrl}/${message.id}`, message).subscribe();
//   }

//   deleteMessage(messageId: number): void {
//     if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
//       this.http.delete(`${this.messageUrl}/${messageId}`).subscribe(() => {
//         this.messages = this.messages.filter(message => message.id !== messageId);
//       });
//     }
//   }

//   toggleMessages(): void {
//     this.showMessages = !this.showMessages;
//   }

//   getUnreadMessagesCount(): number {
//     return this.messages.filter(message => !message.isRead).length;
//   }

//   loadAllPublications(): void {
//     this.musicService.getAllMusics().subscribe((musics: Music[]) => {
//       this.allPublications = musics;
//     });
//   }

//   loadMusicSales(): void {
//     this.totalAlbumsSold = 0;
//     this.totalRevenue = 0;
//     this.personalRevenue = [];
//     this.totalPersonalRevenue = 0;

//     this.http.get<any[]>(this.salesUrl).subscribe((salesData) => {
//       const salesCount: { [key: string]: number } = {};

//       salesData.forEach(sale => {
//         const musicId = sale.musicId;
//         if (!salesCount[musicId]) {
//           salesCount[musicId] = 0;
//         }
//         salesCount[musicId]++;
//       });

//       this.musicSales = this.allPublications.map(music => {
//         const musicId = music.id;
//         const salesForMusic = salesCount[musicId!] || 0;
//         const musicPrice = music.price || 0;

//         this.totalAlbumsSold += salesForMusic;
//         this.totalRevenue += salesForMusic * musicPrice;

//         // Calculer les revenus par utilisateur
//         salesData.filter(sale => sale.musicId === musicId).forEach(sale => {
//           const user = this.users.find(user => user.id === sale.userId);
//           if (user) {
//             let userRevenue = this.personalRevenue.find(pr => pr.user.id === user.id);
//             if (!userRevenue) {
//               userRevenue = { user, revenue: 0 };
//               this.personalRevenue.push(userRevenue);
//             }
//             userRevenue.revenue += musicPrice;
//           }
//         });

//         return { music, sales: salesForMusic };
//       });
//     });
//   }

//   loadUsers(): void {
//     this.authService.getUsers().subscribe(users => {
//       this.users = users;
//       this.totalUsers = users.length;
//     });
//   }

//   deleteUser(userId: number | undefined): void {
//     if (userId !== undefined) {
//       if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
//         this.authService.deleteUser(userId).subscribe(() => {
//           this.loadUsers();
//         });
//       }
//     } else {
//       alert('ID utilisateur non défini');
//     }
//   }

//   deleteAlbum(musicId: number | undefined): void {
//     if (musicId !== undefined) {
//       if (confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) {
//         this.musicService.deleteMusic(musicId).subscribe(() => {
//           this.loadAllPublications();
//         });
//       }
//     } else {
//       alert('ID de l’album non défini');
//     }
//   }
// }






// import { AfterViewInit, Component, OnInit } from '@angular/core';
// import { MusicService, Sale } from '../../services/music.service';
// import { CommonModule, CurrencyPipe } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { User } from '../../models/user.model';
// import { Music } from '../../models/music.model';
// import { HttpClient } from '@angular/common/http';
// import { Message } from '../../models/message.model';
// import Chart from 'chart.js/auto';

// @Component({
//   selector: 'app-admin-dashboard',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.scss']
// })
// export class AdminDashboardComponent implements OnInit, AfterViewInit {

//   isAdmin: boolean = false;
//   users: User[] = [];
//   totalUsers: number = 0;
//   allPublications: Music[] = [];
//   musicSales: { music: Music, sales: number }[] = [];
//   totalAlbumsSold: number = 0;
//   totalRevenue: number = 0;
//   personalRevenue: { user: User, revenue: number }[] = [];
//   personalRevenueTotal: number = 0;
//   monthlySales: { month: string, sales: number }[] = [];
//   weeklySales: { week: string, sales: number }[] = [];
//   messages: Message[] = [];
//   showMessages: boolean = false;
//   messageUrl = 'http://localhost:3000/contact';
//   salesUrl = 'http://localhost:3000/sales'; 
//   chart: Chart | undefined;
//   totalPersonalRevenue: number = 0;

//   constructor(
//     private musicService: MusicService,
//     private authService: AuthService,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     this.isAdmin = this.authService.isAdmin();
//     if (!this.isAdmin) {
//       return;
//     }
//     this.loadUsers();
//     this.loadAllPublications();
//     this.loadMusicSales(); // Charger les ventes des musiques
//     this.musicService.getWeeklySales().subscribe(data => {
//       this.weeklySales = data;
//       this.renderWeeklySalesChart(); 
//     });
//     this.loadMessages();
//     this.loadTotalPersonalRevenue();
//   }
//   // debut
//    // Charger le revenu personnel total
//   loadTotalPersonalRevenue(): void {
//     this.musicService.getTotalPersonalRevenue().subscribe((total) => {
//       this.totalPersonalRevenue = total;
//     });
//   }

//   // fin 

//   ngAfterViewInit(): void {
//     this.createChart();
//   }

//   createChart(): void {
//     const canvas = document.getElementById('salesChart') as HTMLCanvasElement;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     if (this.chart) this.chart.destroy();

//     this.chart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr'], // À remplacer par les labels réels
//         datasets: [{
//           label: 'Sales',
//           data: [10, 20, 30, 40], // À remplacer par les données réelles
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         scales: {
//           x: { beginAtZero: true },
//           y: { beginAtZero: true }
//         }
//       }
//     });
//   }

//   renderMonthlySalesChart(): void {
//     const ctx = document.getElementById('monthlySalesChart') as HTMLCanvasElement;
//     if (!ctx) return;

//     new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: this.monthlySales.map(sale => sale.month),
//         datasets: [{
//           label: 'Ventes Mensuelles',
//           data: this.monthlySales.map(sale => sale.sales),
//           backgroundColor: 'rgba(54, 162, 235, 0.2)',
//           borderColor: 'rgba(54, 162, 235, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         scales: {
//           y: {
//             beginAtZero: true
//           }
//         },
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });
//   }

//   renderWeeklySalesChart(): void {
//     const ctx = document.getElementById('weeklySalesChart') as HTMLCanvasElement;
//     if (!ctx) return;

//     new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: this.weeklySales.map(sale => sale.week),
//         datasets: [{
//           label: 'Ventes Hebdomadaires',
//           data: this.weeklySales.map(sale => sale.sales),
//           borderColor: 'rgb(75, 192, 192)',
//           tension: 0.1
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });
//   }

//   loadMessages(): void {
//     this.http.get<Message[]>(`${this.messageUrl}`).subscribe(data => {
//       this.messages = data.map(message => ({
//         ...message,
//         isRead: message.isRead ?? false
//       })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//     });
//   }

//   toggleReadStatus(message: Message): void {
//     message.isRead = !message.isRead;
//     this.http.put(`${this.messageUrl}/${message.id}`, message).subscribe();
//   }

//   deleteMessage(messageId: number): void {
//     if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
//       this.http.delete(`${this.messageUrl}/${messageId}`).subscribe(() => {
//         this.messages = this.messages.filter(message => message.id !== messageId);
//       });
//     }
//   }

//   toggleMessages(): void {
//     this.showMessages = !this.showMessages;
//   }

//   getUnreadMessagesCount(): number {
//     return this.messages.filter(message => !message.isRead).length;
//   }

//   loadAllPublications(): void {
//     this.musicService.getAllMusics().subscribe((musics: Music[]) => {
//       this.allPublications = musics;
//     });
//   }

//   loadMusicSales(): void {
//     // Réinitialiser les compteurs avant de recalculer les ventes
//     this.totalAlbumsSold = 0;
//     this.totalRevenue = 0;
//     this.personalRevenue = [];
//     this.personalRevenueTotal = 0

//     // Charger toutes les ventes depuis le serveur
//     this.http.get<any[]>(this.salesUrl).subscribe((salesData) => {
//       const salesCount: { [key: string]: number } = {};
  
//       // Parcourir chaque vente et compter le nombre de fois où chaque album est acheté
//       salesData.forEach(sale => {
//         const musicId = sale.musicId;
//         if (!salesCount[musicId]) {
//           salesCount[musicId] = 0;
//         }
//         salesCount[musicId]++;
//       });
  
//       // Mettre à jour les informations de vente pour chaque album
//       this.musicSales = this.allPublications.map(music => {
//         const musicId = music.id;
//         const salesForMusic = salesCount[musicId!] || 0;
//         const musicPrice = music.price || 0;
  
//         // Mise à jour du nombre total d'albums vendus et des revenus
//         this.totalAlbumsSold += salesForMusic;
//         this.totalRevenue += salesForMusic * musicPrice;

//         // Calculer le revenu personnel pour chaque utilisateur
//         const userRevenue = salesData
//           .filter(sale => sale.musicId === musicId)
//           .reduce((acc, sale) => {
//             const user = this.users.find(user => user.id === sale.userId);
//             if (user) {
//               if (!this.personalRevenue.find(pr => pr.user.id === user.id)) {
//                 this.personalRevenue.push({ user, revenue: 0 });
//               }
//               const userRevenue = this.personalRevenue.find(pr => pr.user.id === user.id);
//               if (userRevenue) {
//                 userRevenue.revenue += musicPrice;
//               }
//             }
//             return acc;
//           }, 0);

//         return { music, sales: salesForMusic };
//       });
//     });
//   }

//   loadUsers(): void {
//     this.authService.getUsers().subscribe(users => {
//       this.users = users;
//       this.totalUsers = users.length;
//     });
//   }

//   deleteUser(userId: number | undefined): void {
//     if (userId !== undefined) {
//       if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
//         this.authService.deleteUser(userId).subscribe(() => {
//           this.loadUsers();
//         });
//       }
//     } else {
//       alert('ID utilisateur non défini');
//     }
//   }

//   deleteAlbum(musicId: number | undefined): void {
//     if (musicId !== undefined) {
//       if (confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) {
//         this.musicService.deleteMusic(musicId).subscribe(() => {
//           this.loadAllPublications();
//         });
//       }
//     } else {
//       alert('ID de l’album non défini');
//     }
//   }
// }





// import { AfterViewInit, Component, OnInit } from '@angular/core';
// import { MusicService, Sale } from '../../services/music.service';
// import { CommonModule, CurrencyPipe } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { User } from '../../models/user.model';
// import { Music } from '../../models/music.model';
// import { HttpClient } from '@angular/common/http';
// import { Message } from '../../models/message.model';
// import Chart from 'chart.js/auto';

// @Component({
//   selector: 'app-admin-dashboard',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.scss']
// })
// export class AdminDashboardComponent implements OnInit, AfterViewInit {

//   isAdmin: boolean = false;
//   users: User[] = [];
//   totalUsers: number = 0;
//   allPublications: Music[] = [];
//   musicSales: { music: Music, sales: number }[] = [];
//   totalAlbumsSold: number = 0;
//   totalRevenue: number = 0;
//   monthlySales: { month: string, sales: number }[] = [];
//   weeklySales: { week: string, sales: number }[] = [];
//   messages: Message[] = [];
//   showMessages: boolean = false;
//   messageUrl = 'http://localhost:3000/contact';
//   salesUrl = 'http://localhost:3000/sales'; 
//   chart: Chart | undefined;

//   constructor(
//     private musicService: MusicService,
//     private authService: AuthService,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     this.isAdmin = this.authService.isAdmin();
//     if (!this.isAdmin) {
//       return;
//     }
//     this.loadUsers();
//     this.loadAllPublications();
//     this.loadMusicSales(); // Charger les ventes des musiques seulement ici
//     this.musicService.getWeeklySales().subscribe(data => {
//       this.weeklySales = data;
//       this.renderWeeklySalesChart(); 
//     });
//     this.loadMessages();
//   }

//   ngAfterViewInit(): void {
//     this.createChart();
//   }

//   createChart(): void {
//     const canvas = document.getElementById('salesChart') as HTMLCanvasElement;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     if (this.chart) this.chart.destroy();

//     this.chart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr'], // À remplacer par les labels réels
//         datasets: [{
//           label: 'Sales',
//           data: [10, 20, 30, 40], // À remplacer par les données réelles
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         scales: {
//           x: { beginAtZero: true },
//           y: { beginAtZero: true }
//         }
//       }
//     });
//   }

//   renderMonthlySalesChart(): void {
//     const ctx = document.getElementById('monthlySalesChart') as HTMLCanvasElement;
//     if (!ctx) return;

//     new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: this.monthlySales.map(sale => sale.month),
//         datasets: [{
//           label: 'Ventes Mensuelles',
//           data: this.monthlySales.map(sale => sale.sales),
//           backgroundColor: 'rgba(54, 162, 235, 0.2)',
//           borderColor: 'rgba(54, 162, 235, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         scales: {
//           y: {
//             beginAtZero: true
//           }
//         },
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });
//   }

//   renderWeeklySalesChart(): void {
//     const ctx = document.getElementById('weeklySalesChart') as HTMLCanvasElement;
//     if (!ctx) return;

//     new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: this.weeklySales.map(sale => sale.week),
//         datasets: [{
//           label: 'Ventes Hebdomadaires',
//           data: this.weeklySales.map(sale => sale.sales),
//           borderColor: 'rgb(75, 192, 192)',
//           tension: 0.1
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });
//   }

//   loadMessages(): void {
//     this.http.get<Message[]>(`${this.messageUrl}`).subscribe(data => {
//       this.messages = data.map(message => ({
//         ...message,
//         isRead: message.isRead ?? false
//       })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//     });
//   }

//   toggleReadStatus(message: Message): void {
//     message.isRead = !message.isRead;
//     this.http.put(`${this.messageUrl}/${message.id}`, message).subscribe();
//   }

//   deleteMessage(messageId: number): void {
//     if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
//       this.http.delete(`${this.messageUrl}/${messageId}`).subscribe(() => {
//         this.messages = this.messages.filter(message => message.id !== messageId);
//       });
//     }
//   }

//   toggleMessages(): void {
//     this.showMessages = !this.showMessages;
//   }

//   getUnreadMessagesCount(): number {
//     return this.messages.filter(message => !message.isRead).length;
//   }

//   loadAllPublications(): void {
//     this.musicService.getAllMusics().subscribe((musics: Music[]) => {
//       this.allPublications = musics;
//     });
//   }

//   loadMusicSales(): void {
//     // Réinitialiser les compteurs avant de recalculer les ventes
//     this.totalAlbumsSold = 0;
//     this.totalRevenue = 0;

//     // Charger toutes les ventes depuis le serveur
//     this.http.get<any[]>(this.salesUrl).subscribe((salesData) => {
//       const salesCount: { [key: string]: number } = {};
  
//       // Parcourir chaque vente et compter le nombre de fois où chaque album est acheté
//       salesData.forEach(sale => {
//         const musicId = sale.musicId;
//         if (!salesCount[musicId]) {
//           salesCount[musicId] = 0;
//         }
//         salesCount[musicId]++;
//       });
  
//       // Mettre à jour les informations de vente pour chaque album
//       this.musicSales = this.allPublications.map(music => {
//         const musicId = music.id;
//         const salesForMusic = salesCount[musicId!] || 0;
//         const musicPrice = music.price || 0;
  
//         // Mise à jour du nombre total d'albums vendus et des revenus
//         this.totalAlbumsSold += salesForMusic;
//         this.totalRevenue += salesForMusic * musicPrice;
  
//         return { music, sales: salesForMusic };
//       });
//     });
//   }

//   loadUsers(): void {
//     this.authService.getUsers().subscribe(users => {
//       this.users = users;
//       this.totalUsers = users.length;
//     });
//   }

//   deleteUser(userId: number | undefined): void {
//     if (userId !== undefined) {
//       if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
//         this.authService.deleteUser(userId).subscribe(() => {
//           this.loadUsers();
//         });
//       }
//     } else {
//       alert('ID utilisateur non défini');
//     }
//   }

//   deleteAlbum(musicId: number | undefined): void {
//     if (musicId !== undefined) {
//       if (confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) {
//         this.musicService.deleteMusic(musicId).subscribe(() => {
//           this.loadAllPublications();
//           this.loadMusicSales(); // Recharger les ventes après suppression d'un album
//         });
//       }
//     } else {
//       alert("ID de l'album non défini");
//     }
//   }
// }





// import { AfterViewInit, Component, OnInit } from '@angular/core';
// import { MusicService, Sale } from '../../services/music.service';
// import { CommonModule, CurrencyPipe } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { User } from '../../models/user.model';
// import { Music } from '../../models/music.model';
// import { HttpClient } from '@angular/common/http';
// import { Message } from '../../models/message.model';
// import Chart from 'chart.js/auto';

// @Component({
//   selector: 'app-admin-dashboard',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.scss']
// })
// export class AdminDashboardComponent implements OnInit, AfterViewInit {

//   isAdmin: boolean = false;
//   users: User[] = [];
//   totalUsers: number = 0;
//   allPublications: Music[] = [];
//   musicSales: { music: Music, sales: number }[] = [];
//   totalAlbumsSold: number = 0;
//   personalRevenueTotal: number = 0;
//   totalRevenue: number = 0;
//   monthlySales: { month: string, sales: number }[] = [];
//   WeeklySales: { week: string, sales: number }[] = [];
//   messages: Message[] = [];
//   showMessages: boolean = false;
//   messageUrl = 'http://localhost:3000/contact';
//   salesUrl = 'http://localhost:3000/sales'; 
//   // sales: Sale[] = []; 
//   chart: Chart | undefined;

//   constructor(
//     private musicService: MusicService,
//     private authService: AuthService,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     this.isAdmin = this.authService.isAdmin();
//     if (!this.isAdmin) {
//       return;
//     }
//     this.loadUsers();
//     this.loadAllPublications();
//     this.loadMusicSales(); // Charger les ventes des musiques
//     this.musicService.getWeeklySales().subscribe(data => {
//       this.WeeklySales = data;
//       this.renderWeeklySalesChart(); 
//     });
//     this.loadMessages();
//   }


//   ngAfterViewInit(): void {
//     this.createChart();
//   }

//   createChart(): void {
//     const canvas = document.getElementById('salesChart') as HTMLCanvasElement;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     if (this.chart) this.chart.destroy();

//     this.chart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr'],
//         datasets: [{
//           label: 'Sales',
//           data: [10, 20, 30, 40],
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         scales: {
//           x: { beginAtZero: true },
//           y: { beginAtZero: true }
//         }
//       }
//     });
//   }

//   renderMonthlySalesChart(): void {
//     const ctx = document.getElementById('monthlySalesChart') as HTMLCanvasElement;
//     new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: this.monthlySales.map(sale => sale.month),
//         datasets: [{
//           label: 'Ventes Mensuelles',
//           data: this.monthlySales.map(sale => sale.sales),
//           backgroundColor: 'rgba(54, 162, 235, 0.2)',
//           borderColor: 'rgba(54, 162, 235, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         scales: {
//           y: {
//             beginAtZero: true
//           }
//         },
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });
//   }

//   renderWeeklySalesChart(): void {
//     const ctx = document.getElementById('weeklySalesChart') as HTMLCanvasElement;
//     new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: this.WeeklySales.map(sale => sale.week),
//         datasets: [{
//           label: 'Ventes Hebdomadaires',
//           data: this.WeeklySales.map(sale => sale.sales),
//           borderColor: 'rgb(75, 192, 192)',
//           tension: 0.1
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });
//   }

//   loadMessages(): void {
//     this.http.get<Message[]>(`${this.messageUrl}`).subscribe(data => {
//       this.messages = data.map(message => ({
//         ...message,
//         isRead: message.isRead ?? false
//       })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//     });
//   }

//   toggleReadStatus(message: Message): void {
//     message.isRead = !message.isRead;
//     this.http.put(`${this.messageUrl}/${message.id}`, message).subscribe();
//   }

//   deleteMessage(messageId: number): void {
//     if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
//       this.http.delete(`${this.messageUrl}/${messageId}`).subscribe(() => {
//         this.messages = this.messages.filter(message => message.id !== messageId);
//       });
//     }
//   }

//   toggleMessages(): void {
//     this.showMessages = !this.showMessages;
//   }

//   getUnreadMessagesCount(): number {
//     return this.messages.filter(message => !message.isRead).length;
//   }

//   loadAllPublications(): void {
//     this.musicService.getAllMusics().subscribe((musics: Music[]) => {
//       this.allPublications = musics;
//       this.loadMusicSales(); 
//     });
//   }

//   loadMusicSales(): void {
//     // Charger toutes les ventes depuis le serveur
//     this.http.get<any[]>('http://localhost:3000/sales').subscribe((salesData) => {
//       const salesCount: { [key: string]: number } = {};
  
//       // Parcourir chaque vente et compter le nombre de fois où chaque album est acheté
//       salesData.forEach(sale => {
//         const musicId = sale.musicId;
//         if (!salesCount[musicId]) {
//           salesCount[musicId] = 0;
//         }
//         salesCount[musicId]++;
//       });
  
//       // Mettre à jour les informations de vente pour chaque album
//       this.musicSales = this.allPublications.map(music => {
//         const musicId = music.id;
//         const salesForMusic = salesCount[musicId!] || 0;
//         const musicPrice = music.price || 0;
  
//         // Mise à jour du nombre total d'albums vendus et des revenus
//         this.totalAlbumsSold += salesForMusic;
//         this.totalRevenue += salesForMusic * musicPrice;
  
//         return { music, sales: salesForMusic };
//       });
//     });
//   }
  


//   loadUsers(): void {
//     this.authService.getUsers().subscribe(users => {
//       this.users = users;
//       this.totalUsers = users.length;
//     });
//   }

//   deleteUser(userId: number | undefined): void {
//     if (userId !== undefined) {
//       if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
//         this.authService.deleteUser(userId).subscribe(() => {
//           this.loadUsers();
//         });
//       }
//     } else {
//       alert('ID utilisateur non défini');
//     }
//   }

//   deleteAlbum(musicId: number | undefined): void {
//     if (musicId !== undefined) {
//       if (confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) {
//         this.musicService.deleteMusic(musicId).subscribe(() => {
//           this.loadAllPublications();
//           // this.loadMusicSales()
//         });
//       }
//     } else {
//       alert("ID de l'album non défini");
//     }
//   }
// }