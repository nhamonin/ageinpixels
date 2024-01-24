import { CSSProperties } from 'react';

export type LineProps = {
  orientation: 'horizontal' | 'vertical';
  position: string;
  customClass?: string;
};

const Line = ({ orientation, position, customClass }: LineProps) => {
  const lineStyle: CSSProperties = {
    position: 'absolute',
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

  return <div style={lineStyle} className={`line bg-border hidden ${customClass || 'sm:block'}`} />;
};

export default Line;
