import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LibTemplateModule } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpConfigInterceptor } from './core/interceptor';
import { MaterialModule } from './shared/modules/material.module';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    LibTemplateModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
    {
      provide: 'header',
      useValue: environment.header
    },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
