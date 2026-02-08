import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const CardComponent: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className,
  ...props
}) => {
  const variantClasses = clsx({
    'bg-white shadow-elevation': variant === 'elevated',
    'bg-white border border-gray-200': variant === 'outlined',
    'bg-white': variant === 'default',
  });

  const paddingClasses = clsx({
    'p-0': padding === 'none',
    'p-3': padding === 'sm',
    'p-4': padding === 'md',
    'p-6': padding === 'lg',
  });

  const classes = clsx('rounded-lg', variantClasses, paddingClasses, className);

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

interface CardComposition {
  (props: CardProps): JSX.Element;
  Header: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Body: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Footer: React.FC<React.HTMLAttributes<HTMLDivElement>>;
}

const Card = CardComponent as CardComposition;

Card.Header = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx('pb-3', className)} {...props}>
    {children}
  </div>
);
Card.Header.displayName = 'Card.Header';

Card.Body = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(className)} {...props}>
    {children}
  </div>
);
Card.Body.displayName = 'Card.Body';

Card.Footer = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx('pt-3 border-t border-gray-200', className)} {...props}>
    {children}
  </div>
);
Card.Footer.displayName = 'Card.Footer';

export default Card;