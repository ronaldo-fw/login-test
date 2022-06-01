import { environment } from './../environments/environment';
import { MsalGuard } from './guards/msal.guard';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MsalModule, MSAL_INSTANCE, MsalService, MsalRedirectComponent, MsalInterceptor } from '@azure/msal-angular'
import { InteractionType, IPublicClientApplication, PublicClientApplication} from '@azure/msal-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

export function MSALInstanceFactory(): IPublicClientApplication {

  return new PublicClientApplication({
    auth: {
      clientId: environment.CLIENT_ID, //Client ID
      authority: `${environment.CLOUD_INSTANCE_ID}/${environment.TENANT_ID}`, //Tenant ID(Se especifica la propiedad authority para aplicaciones de un solo inquilino)
      redirectUri: environment.REDIRECT_URL
    }
  });
}

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MsalModule.forRoot(MSALInstanceFactory(),
    {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ['user.read']
      }
    },
    {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map([
        ['https://graph.microsoft.com/v1.0/me/', ['user.read'],],
        [`${environment.API_URL}/api/report`, [environment.SCOPES_API]]
      ])
    })
  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard,
    MsalService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
