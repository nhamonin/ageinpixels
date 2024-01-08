import { useState, useEffect } from 'react';

export const useHoverTransform = () => {
  const [isTouch, setIsTouch] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouch) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
  };

  const handleMouseEnter = () => isTouch || setIsHovering(true);
  const handleMouseLeave = () => {
    if (isTouch) return;

    setIsHovering(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const transform = isHovering
    ? `translate(${mousePosition.x * 0.06}px, ${mousePosition.y * 0.06}px) scale(1.05)`
    : 'translate(0px, 0px) scale(1)';

  return {
    transform,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
};

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.maxTouchPoints > 0;
}
