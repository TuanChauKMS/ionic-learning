import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { FileStorageService } from '../../services/file-storage';
import { StoredFile } from '../../models/file.model';

@Component({
  selector: 'app-files',
  templateUrl: './files.page.html',
  styleUrls: ['./files.page.css'],
  standalone: false,
})
export class FilesPage implements OnInit {
  private readonly fileStorageService = inject(FileStorageService);

  public files$: Observable<StoredFile[]> | null = null;
  public previewDataUrl: string | null = null;
  public previewFileName: string | null = null;
  public loading = false;
  public error: string | null = null;

  public ngOnInit(): void {
    this.files$ = this.fileStorageService.getFiles();
  }

  public async pickFile(): Promise<void> {
    this.error = null;
    this.loading = true;
    try {
      const result = await FilePicker.pickFiles({
        limit: 1,
        readData: true,
      });

      const picked = result.files[0];
      if (!picked) return;

      let base64Data: string;
      if (picked.data) {
        base64Data = picked.data;
      } else if (picked.blob) {
        base64Data = await this.blobToBase64(picked.blob);
      } else {
        throw new Error('No file data returned');
      }

      this.fileStorageService
        .saveFile(picked.name, base64Data, picked.mimeType, picked.size)
        .subscribe({
          next: () => (this.loading = false),
          error: (err: unknown) => {
            this.loading = false;
            this.error =
              err instanceof Error ? err.message : 'Failed to save file';
          },
        });
    } catch (err: unknown) {
      this.loading = false;
      const message = err instanceof Error ? err.message : String(err);
      if (!message.includes('canceled')) {
        this.error = message;
      }
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(blob);
    });
  }

  public async onPreviewFile(storedFile: StoredFile): Promise<void> {
    if (storedFile.category !== 'image') return;
    try {
      const base64 = await this.fileStorageService.readFile(storedFile.path);
      this.previewDataUrl = `data:${storedFile.mimeType};base64,${base64}`;
      this.previewFileName = storedFile.name;
    } catch {
      this.error = 'Failed to load file preview';
    }
  }

  public closePreview(): void {
    this.previewDataUrl = null;
    this.previewFileName = null;
  }

  public onDeleteFile(storedFile: StoredFile): void {
    this.fileStorageService.deleteFile(storedFile.path).subscribe({
      error: (err: unknown) => {
        this.error =
          err instanceof Error ? err.message : 'Failed to delete file';
      },
    });
  }

}
