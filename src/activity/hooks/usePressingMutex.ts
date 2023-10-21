import {useState, useRef, useEffect} from 'react';
import {IdType} from '../../types';

export function usePressingMutex(): {
  currentlyPressingIdRef: React.MutableRefObject<IdType>;
  setCurrentlyPressingId: (id: IdType) => void;
} {
  const [currentlyPressingId, setCurrentlyPressingId] = useState<IdType>(null);
  const currentlyPressingIdRef: React.MutableRefObject<IdType> =
    useRef(currentlyPressingId);
  useEffect(() => {
    currentlyPressingIdRef.current = currentlyPressingId;
  }, [currentlyPressingIdRef, currentlyPressingId]);
  return {
    currentlyPressingIdRef,
    setCurrentlyPressingId,
  };
}
