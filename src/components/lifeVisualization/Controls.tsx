import { useEffect, useState } from 'react';

import { useCameraContext } from '@/contexts/CameraContext';
import { basePosition, baseRotation } from '@/constants/cameraSettings';
import { smoothThreeTransition } from '@/lib/utils';
import reset from '@/assets/images/controls/reset.svg';
import zoomIn from '@/assets/images/controls/zoom-in.svg';
import zoomOut from '@/assets/images/controls/zoom-out.svg';
import openFullScreen from '@/assets/images/controls/open-full-screen.svg';
import closeFullScreen from '@/assets/images/controls/close-full-screen.svg';

const ZOOM_STEP_DISTANCE = 1;

export const Controls = () => {
  const { cameraRef } = useCameraContext();
  const [zoomLevel, setZoomLevel] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleReset = () => {
    setZoomLevel(0);
    smoothThreeTransition(cameraRef, basePosition, baseRotation);
  };

  const handleZoomIn = () => {
    const newZoomLevel = zoomLevel - 1;
    setZoomLevel(newZoomLevel);
    const targetPosition = calculateZoomPosition(newZoomLevel);
    smoothThreeTransition(cameraRef, targetPosition);
  };

  const handleZoomOut = () => {
    const newZoomLevel = zoomLevel + 1;
    setZoomLevel(newZoomLevel);
    const targetPosition = calculateZoomPosition(newZoomLevel);
    smoothThreeTransition(cameraRef, targetPosition);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullScreen(true);
        })
        .catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => {
            setIsFullScreen(false);
          })
          .catch((err) => {
            console.error(`Error attempting to exit full-screen mode: ${err.message}`);
          });
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const calculateZoomPosition = (zoomLevel: number) => {
    const direction = basePosition.clone().normalize();
    const distance = ZOOM_STEP_DISTANCE * zoomLevel;

    return basePosition.clone().add(direction.multiplyScalar(distance));
  };

  return (
    <>
      <div className="flex gap-2 absolute bottom-0 left-0 md:right-0 md:left-auto z-[1]">
        <button
          className="flex justify-center items-center rounded-full border w-[26px] h-[26px] bg-background hover:bg-accent"
          onClick={handleReset}
          aria-label="Reset Icon"
        >
          <img src={reset} alt="Reset" />
        </button>
        <button
          className="flex justify-center items-center rounded-full border w-[26px] h-[26px] bg-background hover:bg-accent"
          onClick={handleZoomIn}
          aria-label="Zoom In Icon"
        >
          <img src={zoomIn} alt="Zoom In" />
        </button>
        <button
          className="flex justify-center items-center rounded-full border w-[26px] h-[26px] bg-background hover:bg-accent"
          onClick={handleZoomOut}
          aria-label="Zoom Out Icon"
        >
          <img src={zoomOut} alt="Zoom Out" />
        </button>
      </div>
      <div className="flex gap-2 absolute bottom-0 right-0 md:hidden z-[1]">
        <button
          className="flex justify-center items-center rounded-full border w-[26px] h-[26px] bg-background hover:bg-accent"
          onClick={toggleFullScreen}
          aria-label={isFullScreen ? 'Exit Full Screen Icon' : 'Open Full Screen Icon'}
        >
          <img
            src={isFullScreen ? closeFullScreen : openFullScreen}
            alt={isFullScreen ? 'Open full screen' : 'Close full screen'}
          />
        </button>
      </div>
    </>
  );
};

export default Controls;
