import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/language.service';

interface PortfolioDescription {
  readonly de: string;
  readonly en: string;
}

interface PortfolioProject {
  readonly id: string;
  readonly title: string;
  readonly imageSrc: string;
  readonly completionDate: string;
  readonly technologies: readonly string[];
  readonly description: PortfolioDescription;
  readonly githubUrl: string;
  readonly liveUrl: string;
  readonly showLiveTest: boolean;
}

@Component({
  selector: 'app-portfolio',
  imports: [TranslatePipe],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portfolio {
  private readonly languageService = inject(LanguageService);

  protected readonly language = this.languageService.language;

  protected readonly projects: readonly PortfolioProject[] = [
    {
      id: 'pokedex',
      title: 'Pokédex',
      imageSrc: '/img/projects/pokedex.png',
      completionDate: '01/04',
      technologies: ['JavaScript', 'HTML', 'CSS', 'Api'],
      description: {
        de: 'Basierend auf der PokéAPI – einer einfachen Bibliothek, die Pokémon-Informationen bereitstellt und katalogisiert.',
        en: 'Based on the PokéAPI a simple library that provides and catalogues pokemon information.',
      },
      githubUrl: '',
      liveUrl: '',
      showLiveTest: false,
    },
    {
      id: 'pollo-loco',
      title: 'Pollo Loco',
      imageSrc: '/img/projects/pollo-loco.png',
      completionDate: '02/04',
      technologies: ['JavaScript', 'HTML', 'CSS'],
      description: {
        de: 'Ein objektorientiertes Spiel zum Springen, Laufen und Werfen. Hilf Pepe dabei, Münzen und Tabasco-Salsa zu finden, um gegen das verrückte Huhn zu kämpfen.',
        en: 'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy hen.',
      },
      githubUrl: '',
      liveUrl: '',
      showLiveTest: true,
    },
    {
      id: 'join',
      title: 'Join',
      imageSrc: '/img/projects/join.png',
      completionDate: '03/04',
      technologies: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
      description: {
        de: 'Ein vom Kanban-System inspirierter Aufgabenmanager. Erstelle und organisiere Aufgaben per Drag-and-drop und weise Benutzer sowie Kategorien zu.',
        en: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
      },
      githubUrl: '',
      liveUrl: '',
      showLiveTest: false,
    },
  ];
}
