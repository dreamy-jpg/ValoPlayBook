// Panel.tsx (полный код)
import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const Panel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-panel-bg backdrop-blur-sm rounded-md shadow-xl border border-gray-700 p-4',
        className
      )}
      {...props}
    />
  )
);
Panel.displayName = 'Panel';

export { Panel };