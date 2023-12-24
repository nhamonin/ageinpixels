import { useRef, forwardRef } from 'react';

export const Dashboard = forwardRef<HTMLDivElement>((_props, ref) => {
  const dashboardRef = useRef(null);

  return (
    <div ref={ref} className="h-[var(--content-height)] flex justify-center items-center">
      <div ref={dashboardRef} className="bg-black w-96 h-96"></div>
    </div>
  );
});
