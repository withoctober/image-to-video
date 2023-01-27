import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const button = cva('button', {
  variants: {
    intent: {
      primary: [
        'bg-primary-500',
        'text-white',
        'border-transparent',
        'hover:bg-primary-600',
        'ring-primary-500',
        'border-transparent',
      ],
      'primary-outline': [
        'bg-transparent',
        'text-primary-800 dark:text-white',
        'border-2',
        'border-primary-500 border-opacity-50',
        'hover:bg-primary-500 hover:bg-opacity-10',
        'ring-primary-500',
      ],
      'primary-ghost': [
        'bg-primary-500 bg-opacity-10',
        'text-primary-800 dark:text-primary-200',
        'hover:bg-primary-500 hover:bg-opacity-20',
        'ring-primary-500',
      ],
      secondary: ['bg-white', 'text-gray-800', 'border-gray-400', 'hover:bg-gray-100'],
      github: ['bg-gray-900', 'text-white', 'border-transparent', 'hover:bg-gray-800'],
      discord: ['bg-[#7289DA]', 'text-white', 'border-transparent', 'hover:bg-[#5E74C0]'],
      google: ['bg-[#4285F4]', 'text-white', 'border-transparent', 'hover:bg-[#357AE8]'],
      apple: ['bg-black', 'text-white', 'border-transparent', 'hover:bg-[#1E1E1E]', 'ring-black'],
    },
    size: {
      small: ['text-sm', 'py-1.5', 'px-3', 'rounded-md'],
      medium: ['text-base', 'py-2', 'px-4', 'rounded-lg'],
      large: ['text-lg', 'py-3', 'px-6', 'rounded-xl'],
    },
  },
  compoundVariants: [
    {
      className:
        'font-semibold border-2 flex items-center justify-center transition-colors duration-150 ease-in-out focus:ring-2 ring-opacity-30 outline-none whitespace-nowrap',
    },
  ],
  defaultVariants: {
    intent: 'primary',
    size: 'medium',
  },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {}

export const Button: React.FC<ButtonProps> = ({ className, intent, size, ...props }) => (
  <button className={button({ intent, size, className })} {...props} />
);
