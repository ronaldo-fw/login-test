import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { Component, OnInit } from '@angular/core';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs';

const MY_API_ENDPOINT = `${environment.API_URL}/api/report`;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  report!: Object;
  loginDisplay = false;

  constructor(private msalService: MsalService, private msalBroadcastService: MsalBroadcastService, private httpClient: HttpClient) { }

  ngOnInit(): void {

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
      )
      .subscribe((result: EventMessage) => console.log(result))

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => this.setLoginDisplay())
  }

  setLoginDisplay() {
    this.loginDisplay = this.msalService.instance.getAllAccounts().length > 0;
  }

  consumeAPI() {
    this.httpClient.get(MY_API_ENDPOINT, {responseType: 'text'})
      .subscribe((res) => this.report = JSON.stringify(res));
  }
}
