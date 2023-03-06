import { cn } from '@/lib/utils';
import * as React from 'react';
import * as Opener from './advanced-opener';

const AlertOpenerContext = Opener.createOpenerContext();

interface AlertOpenerProps extends React.ComponentProps<typeof Opener.Root> {}

function AlertOpener(props: AlertOpenerProps) {
  return <Opener.Root {...props} DefaultContext={AlertOpenerContext} />;
}

interface AlertOpenerTriggerProps extends React.ComponentProps<typeof Opener.Trigger> {}
function AlertOpenerTrigger({ className, ...props }: AlertOpenerTriggerProps) {
  return (
    <Opener.Trigger
      {...props}
      className={cn('bg-red-900', className)}
      DefaultContext={AlertOpenerContext}
    />
  );
}

interface AlertOpenerContentProps extends React.ComponentProps<typeof Opener.Content> {}
function AlertOpenerContent({ className, ...props }: AlertOpenerContentProps) {
  return (
    <Opener.Content
      {...props}
      className={cn('bg-red-500 text-white', className)}
      DefaultContext={AlertOpenerContext}
    />
  );
}

export {
  //
  AlertOpener as Root,
  AlertOpenerTrigger as Trigger,
  AlertOpenerContent as Content,
};
