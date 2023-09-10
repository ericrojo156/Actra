import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';

export enum Language {
  ENGLISH,
}

type LanguageDict = Map<string, string>;

const englishDict: LanguageDict = new Map<string, string>([
  ['Add-Subactivity', 'Add Subactivity'],
  ['Back', 'Back'],
  ['Delete-Activity', 'Delete Activity'],
  ['Cancel', 'Cancel'],
  ['Delete', 'Delete'],
  ['History', 'History'],
  ['Join', 'Combine'],
  ['to-Join', 'to Combine'],
  ['Select-Activities', 'Select Activities'],
  ['Combine-Activities', 'Combine Activities'],
]);

const languages = new Map<Language, LanguageDict>([
  [Language.ENGLISH, englishDict],
]);

export function useTranslation() {
  const language = useSelector(
    (state: ApplicationState) => state.internationalization.language,
  );
  const translate = useCallback(
    (phrase: string) => languages.get(language)?.get(phrase) ?? phrase,
    [language],
  );
  return {
    translate,
  };
}