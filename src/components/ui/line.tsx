import { CSSProperties } from 'react';

export type LineProps = {
  orientation: 'horizontal' | 'vertical';
  position: string;
  customClass?: string;
  initialAnimation?: boolean;
};

const Line = ({ orientation, position, customClass, initialAnimation }: LineProps) => {
  const lineStyle: CSSProperties = {
    position: 'absolute',
  };

  const animationClass = initialAnimation ? 'animate-expand-width origin-left overflow-hidden' : '';
  const customClasses = customClass || 'hidden sm:block';

  if (orientation === 'vertical') {
    lineStyle.width = '1px';
    lineStyle.height = '100%';
    lineStyle.left = position;
  } else {
    lineStyle.height = '1px';
    lineStyle.width = '100%';
    lineStyle.top = position;
  }

  return <div style={lineStyle} className={`line bg-border ${customClasses} ${animationClass}`} />;
};

export default Line;
