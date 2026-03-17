import { Injectable, inject } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { BehaviorSubject, Observable, from, map, tap } from 'rxjs';
import { StoredFile, enrichStoredFile } from '../models/file.model';
import { Logger } from './logger';

const FILES_DIR = 'stored-files';

@Injectable({
  providedIn: 'root',
})
export class FileStorageService {
  private readonly logger = inject(Logger);
  private readonly filesSubject = new BehaviorSubject<StoredFile[]>([]);

  constructor() {
    this.logger.log('FileStorageService: initialized with empty list');
  }

  public getFiles(): Observable<StoredFile[]> {
    return this.filesSubject.asObservable();
  }

  public saveFile(
    name: string,
    base64Data: string,
    mimeType: string,
    size: number
  ): Observable<StoredFile> {
    const timestamp = Date.now();
    const safeName = `${timestamp}_${name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const path = `${FILES_DIR}/${safeName}`;

    return from(
      Filesystem.writeFile({
        path,
        data: base64Data,
        directory: Directory.Data,
        recursive: true
      })
    ).pipe(
      map(() => enrichStoredFile({
          name,
          path,
          mimeType,
          size,
          savedAt: new Date(),
        })
      ),
      tap((storedFile) => {
        const files = [...this.filesSubject.value, storedFile];
        this.filesSubject.next(files);
        this.logger.log(`FileStorageService: saved file "${name}" (${size} bytes)`);
      })
    );
  }

  public async readFile(path: string): Promise<string> {
    this.logger.log(`FileStorageService: reading file at ${path}`);
    const result = await Filesystem.readFile({
      path,
      directory: Directory.Data,
    });
    return result.data as string;
  }

  public deleteFile(path: string): Observable<void> {
    return from(
      Filesystem.deleteFile({
        path,
        directory: Directory.Data,
      })
    ).pipe(
      tap(() => {
        const files = this.filesSubject.value.filter((f) => f.path !== path);
        this.filesSubject.next(files);
        this.logger.log(`FileStorageService: deleted file at ${path}`);
      })
    );
  }

}
