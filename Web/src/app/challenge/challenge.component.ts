import { Component, OnInit } from "@angular/core";
import { StoreService } from "../store.service";

@Component({
    selector: "app-challenge",
    templateUrl: "./challenge.component.html",
    styleUrls: ["./challenge.component.css"]
})
export class ChallengeComponent implements OnInit {
    title: string = "WELCOME TO THE THUNDERDOME";
    board: Array<object>;
    currentSummoner:object = undefined;
    name:string = "!";
    inchallenge:boolean = true;
    constructor(private store: StoreService) {}

    ngOnInit() {
        this.store.checkClient((data) => {
            console.log(data);
            if(data.error) {
                if(data.error == 404) {
                    alert("Please Log in");
                }
                else if(data.error == 400) {
                    alert("Couldn't find app");
                }
                else {
                    alert("Unknown error");
                }
            }
            else {
                this.currentSummoner = data;
                this.name = data.displayName;
                this.title = `WELCOME TO THE THUNDERDOME ${data.displayName.toUpperCase()}`;
                this.inchallenge = false;
            }
            this.store.getFighters(this.name, fighters => {
                console.log(fighters);
                this.board = fighters;
            });
            
        });
        
    }

    fightPlayer(otherPlayer:object) {
        console.log(otherPlayer);
        this.inchallenge = true;
        // this.store.setupLobby("http://localhost:4800/lol/create-lobby", otherPlayer.)
        
    }

    
}
