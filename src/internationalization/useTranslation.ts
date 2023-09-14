import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';

export enum Language {
  ENGLISH,
}

type LanguageDict = Map<string, string>;

const englishDict: LanguageDict = new Map<string, string>([
  ['Activities', 'Activities'],
  ['Add-Subactivity', 'Add Subactivity'],
  ['Back', 'Back'],
  ['Delete-Activity', 'Delete Activity'],
  ['Cancel', 'Cancel'],
  ['Delete', 'Delete'],
  ['Edit', 'Edit'],
  ['History', 'History'],
  ['Join', 'Combine'],
  ['to-Join', 'to Combine'],
  ['Select-Activities', 'Select Activities'],
  ['Combine-Activities-with', 'Combine Activities with'],
  ['Save', 'Save'],
  ['Edit-Activity', 'Edit Activity'],
  ['day', 'day'],
  ['days', 'days'],
  ['hour', 'hr'],
  ['hours', 'hrs'],
  ['minute', 'min'],
  ['minutes', 'mins'],
  ['second', 'sec'],
  ['seconds', 'secs'],
  ['to-Add', 'to Add'],
  ['Add-to', 'Add to'],
]);

const languages = new Map<Language, LanguageDict>([
  [Language.ENGLISH, englishDict],
]);

export function useTranslation() {
  const language = useSelector(
    (state: ApplicationState) => state.internationalization.language,
  );
  const translate = useCallback(
    (phrase: string) =>
      languages.get(language)?.get(phrase) ??
      `untranslated key phrase: ${phrase}`,
    [language],
  );
  return {
    translate,
  };
}
