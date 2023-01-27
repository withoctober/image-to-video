import { cva, type VariantProps } from 'class-variance-authority';
import React, { forwardRef } from 'react';

export const input = cva('input', {
  variants: {
    size: {
      small: ['text-sm', 'py-1.5', 'px-3', 'rounded-md'],
      medium: ['text-base', 'py-2', 'px-4', 'rounded-lg'],
      large: ['text-lg', 'py-3', 'px-6', 'rounded-xl'],
    },
  },
  compoundVariants: [
    {
      className:
        'border-gray-300 dark:border-gray-700 dark:focus:border-primary-300 focus:ring-primary-500 focus:border-primary-500 focus:ring-opacity-20 focus:ring-2 w-full bg-transparent',
    },
  ],
  defaultVariants: {
    size: 'medium',
  },
});

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof input> & {
    htmlSize?: HTMLInputElement['size'];
  };

// eslint-disable-next-line react/display-name
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, size, htmlSize, ...props }, ref) => (
  <input className={input({ size, className })} size={htmlSize} ref={ref} {...props} />
));
