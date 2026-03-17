import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE = 'https://jsonplaceholder.typicode.com';

export interface PostBody {
  title: string;
  body: string;
  userId: number;
}

export interface Post extends PostBody {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiDemoService {
  private readonly http = inject(HttpClient);

  public getList(): Observable<Post[]> {
    return this.http.get<Post[]>(`${API_BASE}/posts`);
  }

  public getOne(id: string): Observable<Post> {
    return this.http.get<Post>(`${API_BASE}/posts/${id}`);
  }

  public post(body: PostBody): Observable<Post> {
    return this.http.post<Post>(`${API_BASE}/posts`, body);
  }

  public put(id: string, body: PostBody & { id: number }): Observable<Post> {
    return this.http.put<Post>(`${API_BASE}/posts/${id}`, body);
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/posts/${id}`);
  }
}
