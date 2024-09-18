import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MusicService } from '../../../services/music.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { Music } from '../../../models/music.model';
import { HttpClient } from '@angular/common/http';
import { Message } from '../../../models/message.model';
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

  fullText: string = '';
  animatedText: string = '';
  letterIndex: number = 0;

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

  toggleSection(section: 'users' | 'publications' | 'messages'): void {
    if (section === 'users') this.showUsers = !this.showUsers;
    if (section === 'publications') this.showPublications = !this.showPublications;
    if (section === 'messages') this.showMessages = !this.showMessages;
  }

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

  loadMessages(): void {
    this.http.get<Message[]>(this.messageUrl).subscribe(data => {
      this.messages = data.map(message => ({
        ...message,
        isRead: message.isRead ?? false
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  loadAllPublications(): void {
    this.musicService.getAllMusics().subscribe(musics => {
      this.allPublications = musics;
    });
  }

  loadPersonalRevenue(): void {
    this.musicService.getTotalPersonalRevenue().subscribe(total => {
      this.totalPersonalRevenue = total;
    });
  }

  createChart(): void {
    const canvas = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],  
        datasets: [{
          label: 'Sales',
          data: [10, 20, 30, 40],  
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

  deleteUser(userId: number | undefined): void {
    if (userId && confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.authService.deleteUser(userId).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  deleteAlbum(musicId: number | undefined): void {
    if (musicId && confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) {
      this.musicService.deleteMusic(musicId).subscribe(() => {
        this.loadAllPublications();
      });
    }
  }

  toggleReadStatus(message: Message): void {
    message.isRead = !message.isRead;
    this.http.put(`${this.messageUrl}/${message.id}`, message).subscribe();
  }

  deleteMessage(messageId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      this.http.delete(`${this.messageUrl}/${messageId}`).subscribe(() => {
        this.messages = this.messages.filter(message => message.id !== messageId);
      });
    }
  }

  getUnreadMessagesCount(): number {
    return this.messages.filter(message => !message.isRead).length;
  }
  resetSales(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser les ventes et les revenus ?')) {
      this.musicService.resetSales().subscribe(
        () => {
          alert('Ventes réinitialisées avec succès');
          this.loadMusicSales();
        },
        (error) => {
          console.error('Erreur lors de la réinitialisation des ventes :', error);
        }
      );
    }
  }

  resetSalesForAlbum(musicId: number | undefined): void {
    if (!musicId) {
      console.error('ID de l\'album manquant');
      return;
    }
  
    if (confirm('Êtes-vous sûr de vouloir réinitialiser les ventes de cet album ?')) {
      this.musicService.resetSalesForAlbum(musicId).subscribe(
        () => {
          this.loadMusicSales(); 
          alert('Ventes de l\'album réinitialisées avec succès');
        },
        (error) => {
          console.error('Erreur lors de la réinitialisation des ventes :', error);
          alert('Erreur lors de la réinitialisation des ventes');
        }
      );
    }
  }
  
  
}