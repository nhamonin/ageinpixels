import { useState } from 'react';

export const useHoverTransform = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
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
