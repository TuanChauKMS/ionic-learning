import { Injectable, inject } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Logger } from './logger';

export interface CapturedPhoto {
  base64Data: string;
  format: string;
  dataUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  private readonly logger = inject(Logger);
  private readonly CAMERA_QUALITY = 90;

  public async takePhoto(): Promise<CapturedPhoto> {
    this.logger.log('CameraService: requesting photo capture');
    try {
      const photo: Photo = await Camera.getPhoto({
        quality: this.CAMERA_QUALITY,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
        saveToGallery: true,
      });

      const base64Data = photo.base64String ?? '';
      const format = photo.format;
      const dataUrl = `data:image/${format};base64,${base64Data}`;

      this.logger.log(`CameraService: photo captured (format: ${format})`);
      return { base64Data, format, dataUrl };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`CameraService: capture failed - ${message}`);
      throw error;
    }
  }
}
