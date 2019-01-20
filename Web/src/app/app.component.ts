import { Component, OnInit } from "@angular/core";
import { Router } from '../../node_modules/@angular/router';

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit{
    title = "Web";
    constructor(private router:Router) {

    }
    ngOnInit() { }

    toPlayer() {
        this.router.navigate(["/player"]);
    }

    toClan() {
        this.router.navigate(["/clan"]);
    }

    toHome() {
        this.router.navigate(["/"]);
    }
}
