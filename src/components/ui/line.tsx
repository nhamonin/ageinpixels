import { useState, useEffect, CSSProperties } from 'react';

export type LineProps = {
  orientation: 'horizontal' | 'vertical';
  position: string;
};

const Line = ({ orientation, position }: LineProps) => {
  const [isHovered, setIsHovered] = useState(false);
  let hoverTimeout: NodeJS.Timeout;

  const lineStyle: CSSProperties = {
    position: 'absolute',
    backgroundColor: isHovered ? 'hsl(var(--foreground))' : 'hsl(var(--border))',
    transition: 'background-color 0.3s',
  };

  if (orientation === 'vertical') {
    lineStyle.width = '1px';
    lineStyle.height = '100%';
    lineStyle.left = position;
  } else {
    lineStyle.height = '1px';
    lineStyle.width = '100%';
    lineStyle.top = position;
  }

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    hoverTimeout = setTimeout(() => setIsHovered(false), 1000);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, []);

  return (
    <div
      style={lineStyle}
      className="line"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    />
  );
};

export default Line;
