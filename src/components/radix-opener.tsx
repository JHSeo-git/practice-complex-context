import * as React from 'react';
import { createContext, createContextScope, Scope } from '@/hooks/createContext';
import { cn } from '@/lib/utils';

type ScopedProps<P> = P & { __scopeOpener?: Scope };

/////

const OPENER_NAME = 'Opener';

const [createOpenerContext, createOpenerScope] = createContextScope(OPENER_NAME);

interface OpenerContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const [OpenerProvider, useOpenerContext] = createOpenerContext<OpenerContextValue>(OPENER_NAME);

interface OpenerProps {
  children: React.ReactNode;
  className?: string;
}

const Opener: React.FC<OpenerProps> = ({
  __scopeOpener,
  className,
  children,
}: ScopedProps<OpenerProps>) => {
  const [open, setOpen] = React.useState(false);

  return (
    <OpenerProvider scope={__scopeOpener} open={open} setOpen={setOpen}>
      <div className={cn('relative', className)}>{children}</div>
    </OpenerProvider>
  );
};

/////

const TRIGGER_NAME = 'OpenerTrigger';

const OpenerTrigger: React.FC<OpenerProps> = ({
  __scopeOpener,
  className,
  children,
}: ScopedProps<OpenerProps>) => {
  const { setOpen } = useOpenerContext(TRIGGER_NAME, __scopeOpener);

  return (
    <button
      className={cn('p-2 rounded-md bg-gray-700 text-white', className)}
      onClick={() => setOpen((prev) => !prev)}
    >
      {children}
    </button>
  );
};

/////

const CONTENT_NAME = 'OpenerContent';

const OpenerContent = React.forwardRef<HTMLDivElement, OpenerProps>(
  ({ __scopeOpener, className, children }: ScopedProps<OpenerProps>, forwardedRef) => {
    const { open } = useOpenerContext(CONTENT_NAME, __scopeOpener);

    if (!open) {
      return null;
    }

    return (
      <div
        ref={forwardedRef}
        className={cn(
          'absolute py-4 px-2 mt-2 round-lg shadow-sm border bg-white text-black',
          className
        )}
      >
        {children}
      </div>
    );
  }
);
OpenerContent.displayName = CONTENT_NAME;

export {
  //
  Opener as Root,
  OpenerTrigger as Trigger,
  OpenerContent as Content,
  //
  createOpenerScope,
};
