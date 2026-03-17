import { Component, inject } from '@angular/core';
import { CameraService, CapturedPhoto } from '../../services/camera';
import { FileStorageService } from '../../services/file-storage';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.css'],
  standalone: false,
})
export class CameraPage {
  private static readonly BASE64_SIZE_RATIO = 3 / 4;

  private readonly cameraService = inject(CameraService);
  private readonly fileStorageService = inject(FileStorageService);

  public photo: CapturedPhoto | null = null;
  public error: string | null = null;
  public loading = false;
  public saved = false;
  public saving = false;

  public async takePhoto(): Promise<void> {
    this.error = null;
    this.loading = true;
    this.saved = false;
    try {
      this.photo = await this.cameraService.takePhoto();
    } catch (err: unknown) {
      this.photo = null;
      this.error = err instanceof Error ? err.message : 'Failed to capture photo';
    } finally {
      this.loading = false;
    }
  }

  public savePhoto(): void {
    if (!this.photo || this.saved) { return; }

    this.saving = true;
    this.error = null;
    const name = `photo_${Date.now()}.${this.photo.format}`;
    const mimeType = `image/${this.photo.format}`;
    const sizeInBytes = Math.ceil(this.photo.base64Data.length * CameraPage.BASE64_SIZE_RATIO);

    this.fileStorageService
      .saveFile(name, this.photo.base64Data, mimeType, sizeInBytes)
      .subscribe({
        next: () => {
          this.saved = true;
          this.saving = false;
        },
        error: (err: unknown) => {
          this.saving = false;
          this.error = err instanceof Error ? err.message : 'Failed to save photo';
        },
      });
  }
}
