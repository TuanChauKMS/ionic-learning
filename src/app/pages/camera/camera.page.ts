import { Component, inject } from '@angular/core';
import { CameraService, CapturedPhoto } from '../../services/camera';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.css'],
  standalone: false,
})
export class CameraPage {
  private readonly cameraService = inject(CameraService);

  public photo: CapturedPhoto | null = null;
  public error: string | null = null;
  public loading = false;

  public async takePhoto(): Promise<void> {
    this.error = null;
    this.loading = true;
    try {
      this.photo = await this.cameraService.takePhoto();
    } catch (err: unknown) {
      this.photo = null;
      this.error = err instanceof Error ? err.message : 'Failed to capture photo';
    } finally {
      this.loading = false;
    }
  }
}
