import { Injectable, inject } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { BehaviorSubject, Observable, from, map, tap } from 'rxjs';
import { StoredFile, enrichStoredFile } from '../models/file.model';
import { Logger } from './logger';

const FILES_DIR = 'stored-files';
const INDEX_FILE = 'stored-files/index.json';

@Injectable({
  providedIn: 'root',
})
export class FileStorageService {
  private readonly logger = inject(Logger);
  private readonly filesSubject = new BehaviorSubject<StoredFile[]>([]);

  constructor() {
    this.loadIndex();
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
        this.persistIndex(files);
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
        this.persistIndex(files);
        this.logger.log(`FileStorageService: deleted file at ${path}`);
      })
    );
  }

  private async loadIndex(): Promise<void> {
    try {
      const result = await Filesystem.readFile({
        path: INDEX_FILE,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      const files: StoredFile[] = JSON.parse(result.data as string).map(
        (f: StoredFile) => enrichStoredFile({ ...f, savedAt: new Date(f.savedAt) })
      );
      this.filesSubject.next(files);
      this.logger.log(`FileStorageService: loaded ${files.length} files from index`);
    } catch {
      this.logger.log('FileStorageService: no existing index found, starting fresh');
      this.filesSubject.next([]);
    }
  }

  private async persistIndex(files: StoredFile[]): Promise<void> {
    try {
      await Filesystem.writeFile({
        path: INDEX_FILE,
        data: JSON.stringify(files),
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`FileStorageService: failed to persist index - ${message}`);
    }
  }
}
