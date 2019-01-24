import { Component, OnInit } from "@angular/core";
import { StoreService } from '../store.service';

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
    status:number = 0;
    constructor(private store:StoreService) {}

    ngOnInit() {
        this.store.checkStatus((status) => {
            console.log(status);
            this.status = status;
        });
    }

    register() {
        this.store.registerForClanWar(() => {
            this.status = 3;
        });
    }
}
