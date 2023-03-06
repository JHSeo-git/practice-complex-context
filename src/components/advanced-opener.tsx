import { cn } from '@/lib/utils';
import * as React from 'react';

interface OpenerContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const OpenerContext = React.createContext<OpenerContextValue | null>(null);

type OpenerContextType = typeof OpenerContext;

const createOpenerContext = () => React.createContext<OpenerContextValue | null>(null);

const useOpener = (defaultContext: OpenerContextType) => {
  const context = React.useContext(defaultContext);
  if (context === null) {
    throw new Error('useOpener must be used within a Opener');
  }
  return context;
};

interface OpenerProps {
  children: React.ReactNode;
  className?: string;
  DefaultContext?: OpenerContextType;
}

function Opener({ className, children, DefaultContext = OpenerContext }: OpenerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DefaultContext.Provider value={{ open, setOpen }}>
      <div className={cn('relative', className)}>{children}</div>
    </DefaultContext.Provider>
  );
}

function OpenerTrigger({ className, children, DefaultContext = OpenerContext }: OpenerProps) {
  const { setOpen } = useOpener(DefaultContext);

  return (
    <button
      className={cn('p-2 rounded-md bg-gray-700 text-white', className)}
      onClick={() => setOpen((prev) => !prev)}
    >
      {children}
    </button>
  );
}

function OpenerContent({ className, children, DefaultContext = OpenerContext }: OpenerProps) {
  const { open } = useOpener(DefaultContext);

  if (!open) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute py-4 px-2 mt-2 round-lg shadow-sm border bg-white text-black',
        className
      )}
    >
      {children}
    </div>
  );
}

export {
  //
  Opener as Root,
  OpenerTrigger as Trigger,
  OpenerContent as Content,
  createOpenerContext,
};
export type { OpenerContextType };
