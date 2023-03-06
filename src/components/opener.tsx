import { cn } from '@/lib/utils';
import * as React from 'react';

interface OpenerContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const OpenerContext = React.createContext<OpenerContextValue | null>(null);
const useOpener = () => {
  const context = React.useContext(OpenerContext);
  if (context === null) {
    throw new Error('useOpener must be used within a Opener');
  }
  return context;
};

interface OpenerProps {
  children: React.ReactNode;
  className?: string;
}

function Opener({ className, children }: OpenerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <OpenerContext.Provider value={{ open, setOpen }}>
      <div className={cn('relative', className)}>{children}</div>
    </OpenerContext.Provider>
  );
}

function OpenerTrigger({ className, children }: OpenerProps) {
  const { setOpen } = useOpener();

  return (
    <button
      className={cn('p-2 rounded-md bg-gray-700 text-white', className)}
      onClick={() => setOpen((prev) => !prev)}
    >
      {children}
    </button>
  );
}

interface OpenerContentProps {
  children: React.ReactNode;
  className?: string;
}
function OpenerContent({ className, children }: OpenerContentProps) {
  const { open } = useOpener();

  if (!open) {
    return null;
  }

  return (
    <div className={cn('absolute py-4 px-2 mt-2 round-lg shadow-sm border', className)}>
      {children}
    </div>
  );
}

export {
  //
  Opener as Root,
  OpenerTrigger as Trigger,
  OpenerContent as Content,
};
