import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface PortfolioProject {
  readonly id: string;
  readonly title: string;
  readonly imageSrc: string;
  readonly completionDate: string;
}

@Component({
  selector: 'app-portfolio',
  imports: [TranslatePipe],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portfolio {
  protected readonly projects: readonly PortfolioProject[] = [
    {
      id: 'pokedex',
      title: 'Pokedex',
      imageSrc: '/img/projects/pokedex.png',
      completionDate: '01/04',
    },
    {
      id: 'pollo-loco',
      title: 'Pollo Loco',
      imageSrc: '/img/projects/pollo-loco.png',
      completionDate: '02/04',
    },
    {
      id: 'join',
      title: 'Join',
      imageSrc: '/img/projects/join.png',
      completionDate: '03/04',
    },
  ];
}
