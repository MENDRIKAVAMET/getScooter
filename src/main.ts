// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent }       from './app/app.component';
import { provideRouter }      from '@angular/router';
import { routes }             from './app/app.routes';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { HTTP_INTERCEPTORS }  from '@angular/common/http';

import { LoadingInterceptor } from './app/interceptors/loading.interceptor';
import { JwtInterceptor }     from './app/interceptors/jwt.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    // 1. Active le router avec tes routes
    provideRouter(routes),

    // 2. Active le HttpClient et autorise les interceptors
    provideHttpClient(withInterceptorsFromDi()),

    // 3. Interceptors : loading puis JWT
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor,   multi: true },
  ]
})
.catch(err => console.error('Error bootstrapping application:', err));
