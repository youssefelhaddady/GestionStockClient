import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgProgressModule, NgProgressInterceptor } from 'ngx-progressbar';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { httpInterceptorProviders } from './auth/auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { SelectComponentComponent } from './formComponents/select-component/select-component.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    HttpClientModule,
    NgProgressModule,
    AppRoutingModule,
    ScrollingModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    SelectComponentComponent


  ],
  providers: [ httpInterceptorProviders,
    { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true }


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
