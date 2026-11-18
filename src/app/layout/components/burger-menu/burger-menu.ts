import { Component, input } from '@angular/core';

export type BurgerLine = readonly [number, number, number, number];

export type BurgerPose = readonly [BurgerLine, BurgerLine, BurgerLine];

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.html',
  styleUrl: './burger-menu.scss',
})
export class BurgerMenu {
  readonly lines = input.required<BurgerPose>();
}
