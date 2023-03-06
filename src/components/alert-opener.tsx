import { cn } from '@/lib/utils';
import * as React from 'react';
import * as Opener from './opener';

interface AlertOpenerProps extends React.ComponentProps<typeof Opener.Root> {}
function AlertOpener(props: AlertOpenerProps) {
  return <Opener.Root {...props} />;
}

interface AlertOpenerTriggerProps extends React.ComponentProps<typeof Opener.Trigger> {}
function AlertOpenerTrigger({ className, ...props }: AlertOpenerTriggerProps) {
  return <Opener.Trigger {...props} className={cn('bg-red-900', className)} />;
}

interface AlertOpenerContentProps extends React.ComponentProps<typeof Opener.Content> {}
function AlertOpenerContent({ className, ...props }: AlertOpenerContentProps) {
  return <Opener.Content {...props} className={cn('bg-red-500 text-white', className)} />;
}

export {
  //
  AlertOpener as Root,
  AlertOpenerTrigger as Trigger,
  AlertOpenerContent as Content,
};
