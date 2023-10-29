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
  ['Create-Activity', 'Create Activity'],
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
  ['Create', 'Create'],
  ['Now', 'Now'],
  ['Create-Subactivity', 'Create Subactivity'],
  ['Subtrackable-Removed-From-Project', 'Subtrackable Removed From Project'],
  ['Press-Here-To-Undo', 'Press Here To Undo'],
  ['Deleted-Interval', 'Deleted Interval'],
  ['Edit-Interval', 'Edit Interval'],
  ['Start', 'Start'],
  ['End', 'End'],
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
