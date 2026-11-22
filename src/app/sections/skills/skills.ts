import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface SkillItem {
  readonly name: string;
  readonly icon: string;
}

@Component({
  selector: 'app-skills',
  imports: [TranslatePipe],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  protected readonly skills: readonly SkillItem[] = [
    { name: 'Angular', icon: '/icons/skills/angular-logo.svg' },
    { name: 'TypeScript', icon: '/icons/skills/typescript-logo.svg' },
    { name: 'JavaScript', icon: '/icons/skills/javascript-logo.svg' },
    { name: 'HTML', icon: '/icons/skills/html-logo.svg' },
    { name: 'CSS', icon: '/icons/skills/css-logo.svg' },
    { name: 'Supabase', icon: '/icons/skills/supabase-logo.svg' },
    { name: 'Git', icon: '/icons/skills/git-logo.svg' },
    { name: 'Scrum', icon: '/icons/skills/scrum-logo.svg' },
    { name: 'REST-API', icon: '/icons/skills/rest-api-logo.svg' },
    {
      name: 'Material Design',
      icon: '/icons/skills/material-design-logo.svg',
    },
  ];

  protected readonly learningIcon = '/icons/skills/learn-more-logo.svg';
  protected readonly contactEmail = 's.oezbek@soz-studio.de';
}
