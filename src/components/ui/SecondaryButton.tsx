import type { ReactNode } from 'react';
import { Button, type ButtonProps } from '@/components/ui/Button';

type SecondaryButtonProps = Omit<ButtonProps, 'variant'> & { children: ReactNode };

export function SecondaryButton(props: SecondaryButtonProps) {
  return <Button {...props} variant="secondary" />;
}

