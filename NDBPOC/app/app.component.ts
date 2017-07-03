import { Component } from "@angular/core"
@Component({
    selector: "user-app",
    template: `
                
<nav class="navbar navbar-inverse navbar-fixed-left">
  <a class="navbar-brand" [routerLink]="['home']">NDB POC</a>
  <ul class="nav navbar-nav">
    <li><a [routerLink]="['home']">Home</a></li>
    <li><a [routerLink]="['samplefile']">Sample File</a></li>
  </ul>
</nav>
<div class="container">
 <router-outlet></router-outlet>
</div>
`,

    styles: [`
    .navbar-fixed-left {
  width: 140px;
  position: fixed;
  border-radius: 0;
  height: 100%;
}

.navbar-fixed-left .navbar-nav > li {
  float: none;  / Cancel default li float: left /
  width: 139px;
}

.navbar-fixed-left + .container {
  padding-left: 160px;
}

/ On using dropdown menu (To right shift popuped) /
.navbar-fixed-left .navbar-nav > li > .dropdown-menu {
  margin-top: -50px;
  margin-left: 140px;
}
  `],

})

export class AppComponent {

}