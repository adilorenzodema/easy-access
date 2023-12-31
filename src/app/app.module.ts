import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfigInitService, LibMaterialModule, LibPipesModule, LibTemplateModule, getPropertyFromConfig } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TableIncidentsComponent } from './components/dashboard/table-incidents/table-incidents.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TableIncidentsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    LibMaterialModule,
    LibTemplateModule,
    LibPipesModule,
    HttpClientModule,
    NgScrollbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
     { provide: 'domain', useValue: 'domain' },
    {
      provide: 'domainValue',
      useFactory: getPropertyFromConfig, multi: false, deps: ['domain', ConfigInitService]
    },
    { provide: 'headerValue', useValue: 'headerValue' },
    {
      provide: 'headerTitle',
      useFactory: getPropertyFromConfig, multi: false, deps: ['headerValue', ConfigInitService]
    },
    { provide: 'loginHeader', useValue: 'loginHeader' },
    {
      provide: 'loginTitle',
      useFactory: getPropertyFromConfig, multi: false, deps: ['loginHeader', ConfigInitService]
    },
    { provide: 'header', useValue: environment.header },
    { provide: 'footer', useValue: environment.footer },
    { provide: 'env', useValue: environment },
    { provide: 'login', useValue: environment.login },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
