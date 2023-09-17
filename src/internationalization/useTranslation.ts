import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';

export type Locale = 'en-US';

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

const languages = new Map<Locale, LanguageDict>([['en-US', englishDict]]);

export function useTranslation() {
  const locale = useSelector(
    (state: ApplicationState) => state.internationalization.locale,
  );
  const translate = useCallback(
    (phrase: string) =>
      languages.get(locale)?.get(phrase) ??
      `untranslated key phrase: ${phrase}`,
    [locale],
  );
  return {
    locale,
    translate,
  };
}
