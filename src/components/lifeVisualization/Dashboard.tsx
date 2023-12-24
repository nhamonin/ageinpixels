import { useRef, forwardRef } from 'react';

export const Dashboard = forwardRef<HTMLDivElement>((_props, ref) => {
  const dashboardRef = useRef(null);

  return (
    <div ref={ref} className="h-[var(--content-height)] flex justify-center items-center">
      <div ref={dashboardRef} className="bg-black w-64 h-64 md:w-96 md:h-96"></div>
    </div>
  );
});
