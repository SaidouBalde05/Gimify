import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private purchasedMusicIds: Set<number> = new Set<number>();

  purchaseMusic(musicId: number): void {
    this.purchasedMusicIds.add(musicId);
  }

  isPurchased(musicId: number): boolean {
    return this.purchasedMusicIds.has(musicId);
  }
}
