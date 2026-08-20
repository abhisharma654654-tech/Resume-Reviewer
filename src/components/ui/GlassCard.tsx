import type { ReactNode, HTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
