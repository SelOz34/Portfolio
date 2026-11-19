import { ChangeDetectionStrategy, Component } from '@angular/core';

interface PortfolioProject {
  readonly id: string;
  readonly title: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly completionDate: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portfolio {
  protected readonly title = 'Portfolio';

  protected readonly description =
    'Explore a selection of my work here - Interact with projects to see my skills in action.';

  protected readonly projects: readonly PortfolioProject[] = [
    {
      id: 'pokedex',
      title: 'Pokedex',
      imageSrc: '/img/projects/pokedex.png',
      imageAlt: 'Preview of the Pokedex project',
      completionDate: '01/04',
    },
    {
      id: 'pollo-loco',
      title: 'Pollo Loco',
      imageSrc: '/img/projects/pollo-loco.png',
      imageAlt: 'Preview of the Pollo Loco project',
      completionDate: '02/04',
    },
    {
      id: 'join',
      title: 'Join',
      imageSrc: '/img/projects/join.png',
      imageAlt: 'Preview of the Join project',
      completionDate: '03/04',
    },
  ];
}
