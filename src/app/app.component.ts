import { environment } from './../environments/environment.prod';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MsalService, MsalBroadcastService, MsalGuardConfiguration, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'Home';
  isIframe = false;
  loginDisplay = false;
  private readonly __destroying$ = new Subject<void>();

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfiguration: MsalGuardConfiguration,private msalService: MsalService, private msalBroadcastService: MsalBroadcastService){
  }

  ngOnInit(){
    this.isIframe = window !== window.parent && !window.opener;

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.__destroying$)
      )
      .subscribe( () => {
        this.setLoginDisplay();
      })
  }

  login(){
    if(this.msalGuardConfiguration.authRequest){
      this.msalService.loginRedirect({...this.msalGuardConfiguration.authRequest} as RedirectRequest)
    } else{
      this.msalService.loginRedirect()
    }
  }

  setLoginDisplay() {
    this.loginDisplay = this.msalService.instance.getAllAccounts().length > 0;
  }

  logout() {
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: environment.BASE_URL
    });
  }

  ngOnDestroy(): void {
      this.__destroying$.next(undefined);
      this.__destroying$.complete();
  }

}
