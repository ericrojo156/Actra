import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {storeLoadRequested} from './redux/storeActions';

export function useLoadedStore() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(storeLoadRequested());
  }, [dispatch]);
}
