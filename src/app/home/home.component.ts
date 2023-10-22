import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { Backdrop } from "../shared/backdrop/backdrop";
import { UVColorCycleBackground } from "../shared/backdrop/UVColorCycleBackground";

const HELLOS: string[] = ["hello", "hi", "howdy", "hey"];

const GREETING_MESSAGES: string[] = [
  "thanks for visiting",
  "enjoy your stay",
  "how'd you end up here?",
  "welcome to my site",
  "take off your coat and stay a while",
  "thanks for checking in",
  "congratulations, you've made it",
  "welcome to the other side",
  "do you come here often?",
  "there is nothing suspicious here",
  "now that you're here, you can never leave",
];

@Component({
  selector: "x-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  public bgAnimation: Backdrop = new UVColorCycleBackground();
  public hello: string;
  public greeting: string;

  constructor() {}

  ngOnInit(): void {
    function randomRangeFloor(min: number, max: number) {
      return Math.floor(min + Math.random() * (max - min));
    }
    function getRandomIndex(arr: any[]) {
      return arr[randomRangeFloor(0, arr.length)];
    }
    this.hello = getRandomIndex(HELLOS);
    this.greeting = getRandomIndex(GREETING_MESSAGES);
  }
}
