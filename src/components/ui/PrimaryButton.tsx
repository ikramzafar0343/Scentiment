import type { ReactNode } from 'react';
import { Button, type ButtonProps } from '@/components/ui/Button';

type PrimaryButtonProps = Omit<ButtonProps, 'variant'> & { children: ReactNode };

export function PrimaryButton(props: PrimaryButtonProps) {
  return <Button {...props} variant="primary" />;
}

