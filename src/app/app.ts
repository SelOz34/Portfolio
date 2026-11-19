import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/components/header/header';
import { Hero } from './sections/hero/hero';
import { About } from './sections/about/about';
import { Skills } from './sections/skills/skills';
import { Portfolio } from './sections/portfolio/portfolio';
import { References } from './sections/references/references';
import { Contact } from './sections/contact/contact';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Hero, About, Skills, Portfolio, References, Contact],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
