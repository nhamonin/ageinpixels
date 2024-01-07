import { createContext, useContext, useRef, useCallback, ReactNode, MutableRefObject } from 'react';
import { Camera } from 'three';

interface CameraContextValue {
  setCamera: (camera: Camera) => void;
  cameraRef: MutableRefObject<Camera | null>;
}

const CameraContext = createContext<CameraContextValue>({
  setCamera: () => {},
  cameraRef: { current: null },
});

export const useCameraContext = () => useContext(CameraContext);

export const CameraProvider = ({ children }: { children: ReactNode }) => {
  const cameraRef = useRef<Camera | null>(null);
  const setCamera = useCallback((camera: Camera) => {
    cameraRef.current = camera;
  }, []);

  return (
    <CameraContext.Provider value={{ cameraRef, setCamera }}>{children}</CameraContext.Provider>
  );
};
