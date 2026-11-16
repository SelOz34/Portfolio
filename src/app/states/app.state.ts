/** Defines the global application state. */
export interface AppState {
  language: 'de' | 'en';
}

export const initialAppState: AppState = {
  language: 'de',
};
