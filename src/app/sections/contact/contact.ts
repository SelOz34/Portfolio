import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

type ContactField = 'name' | 'email' | 'message';

interface ContactResponse {
  success?: boolean;
  simulated?: boolean;
}

@Component({
  selector: 'app-contact',
  imports: [FormsModule, RouterLink, TranslatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  protected name = '';
  protected email = '';
  protected message = '';
  protected privacyAccepted = false;

  protected readonly focused: Record<ContactField, boolean> = {
    name: false,
    email: false,
    message: false,
  };

  protected readonly touched: Record<ContactField, boolean> = {
    name: false,
    email: false,
    message: false,
  };

  protected privacyTouched = false;
  protected readonly submissionNotice = signal('');
  protected readonly isSubmitting = signal(false);

  protected get nameValid(): boolean {
    return this.name.trim().length > 0;
  }

  protected get emailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
  }

  protected get messageValid(): boolean {
    return this.message.trim().length > 0;
  }

  protected get canSubmit(): boolean {
    return this.nameValid && this.emailValid && this.messageValid && this.privacyAccepted;
  }

  protected focusField(field: ContactField): void {
    this.focused[field] = true;
  }

  protected blurField(field: ContactField): void {
    this.focused[field] = false;
    this.touched[field] = true;
  }

  protected get nameError(): string {
    return this.touched.name && !this.nameValid ? 'contact.errors.nameRequired' : '';
  }

  protected get emailError(): string {
    if (!this.touched.email || this.emailValid) {
      return '';
    }

    return this.email.trim() ? 'contact.errors.emailInvalid' : 'contact.errors.emailRequired';
  }

  protected get messageError(): string {
    return this.touched.message && !this.messageValid ? 'contact.errors.messageRequired' : '';
  }

  protected get privacyError(): string {
    return this.privacyTouched && !this.privacyAccepted ? 'contact.errors.privacyRequired' : '';
  }

  protected async onSubmit(): Promise<void> {
    if (!this.canSubmit || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.submissionNotice.set('contact.submissionSending');

    try {
      const response = await fetch('/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.name.trim(),
          email: this.email.trim(),
          message: this.message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Contact request failed');
      }

      const result: ContactResponse = await response.json();

      if (result.success !== true) {
        throw new Error('Contact request was not successful');
      }

      if (result.simulated === true) {
        this.submissionNotice.set('contact.submissionSimulated');
        return;
      }

      if (result.simulated !== false) {
        throw new Error('Unknown delivery status');
      }

      this.submissionNotice.set('contact.submissionSuccess');

      this.name = '';
      this.email = '';
      this.message = '';
      this.privacyAccepted = false;

      this.touched.name = false;
      this.touched.email = false;
      this.touched.message = false;
      this.privacyTouched = false;
    } catch {
      this.submissionNotice.set('contact.submissionFailed');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
