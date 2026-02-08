import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  count?: number;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  count = 1,
  variant = 'text',
  width,
  height,
  ...props
}) => {
  const baseClasses = 'animate-pulse bg-gray-200';

  const variantClasses = clsx({
    'rounded-md': variant === 'rectangular' || variant === 'text',
    'rounded-full': variant === 'circular',
    'h-4': variant === 'text',
    'h-10': variant === 'rectangular' && !height,
    'h-10 w-10': variant === 'circular' && !width && !height,
  });

  const style = {
    width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={clsx(baseClasses, variantClasses, className)}
      style={style}
      {...props}
    />
  ));

  return <>{skeletons}</>;
};

export default Skeleton;