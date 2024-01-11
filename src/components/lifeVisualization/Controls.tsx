import reset from '@/assets/images/controls/reset.svg';
import zoomIn from '@/assets/images/controls/zoom-in.svg';
import zoomOut from '@/assets/images/controls/zoom-out.svg';
import { useCameraContext } from '@/contexts/CameraContext';
import { basePosition, baseRotation } from '@/constants/cameraSettings';
import { smoothThreeTransition } from '@/lib/utils';

const STEP = 0.2;

export const Controls = () => {
  const { cameraRef } = useCameraContext();

  const handleReset = () => {
    if (!cameraRef.current) return;

    smoothThreeTransition(cameraRef, basePosition, baseRotation);
  };

  const handleZoomIn = () => {
    if (!cameraRef.current) return;

    const targetPosition = cameraRef.current.position.clone().multiplyScalar(1 - STEP);
    smoothThreeTransition(cameraRef, targetPosition);
  };

  const handleZoomOut = () => {
    if (!cameraRef.current) return;

    const targetPosition = cameraRef.current.position.clone().multiplyScalar(1 + STEP);
    smoothThreeTransition(cameraRef, targetPosition);
  };

  return (
    <div className="flex gap-2 absolute bottom-0 right-0 z-[1]">
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
  );
};

export default Controls;
