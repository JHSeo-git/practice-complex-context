import * as React from 'react';
import { createContextScope, Scope } from '@/hooks/createContext';
import { createOpenerScope } from './radix-opener';
import * as Opener from './radix-opener';
import { cn } from '@/lib/utils';

const ALERTOPENER_NAME = 'AlertOpener';

type ScopedProps<P> = P & { __scopeAlertOpener?: Scope };

const [createAlertOpenerContext, createAlertOpenerScope] = createContextScope(ALERTOPENER_NAME, [
  createOpenerScope,
]);

const useOpenerScope = createOpenerScope();

interface AlertOpenerProps extends React.ComponentProps<typeof Opener.Root> {}

const AlertOpener: React.FC<AlertOpenerProps> = ({
  __scopeAlertOpener,
  ...props
}: ScopedProps<AlertOpenerProps>) => {
  const openerScope = useOpenerScope(__scopeAlertOpener);
  return <Opener.Root {...openerScope} {...props} />;
};

//////

interface AlertOpenerTriggerProps extends React.ComponentProps<typeof Opener.Trigger> {}
const AlertOpenerTrigger: React.FC<AlertOpenerTriggerProps> = ({
  __scopeAlertOpener,
  className,
  ...props
}: ScopedProps<AlertOpenerTriggerProps>) => {
  const openerScope = useOpenerScope(__scopeAlertOpener);
  return <Opener.Trigger {...openerScope} {...props} className={cn('bg-red-900', className)} />;
};

//////

const CONTENT_NAME = 'AlertOpenerContent';

interface AlertOpenerContentContextValue {
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
}

const [AlertOpenerContentProvider, useAlertOpenerContentContext] =
  createAlertOpenerContext<AlertOpenerContentContextValue>(CONTENT_NAME);

interface AlertOpenerContentProps extends React.ComponentProps<typeof Opener.Content> {}
const AlertOpenerContent: React.FC<AlertOpenerContentProps> = ({
  __scopeAlertOpener,
  className,
  ...props
}: ScopedProps<AlertOpenerContentProps>) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const openerScope = useOpenerScope(__scopeAlertOpener);
  return (
    <AlertOpenerContentProvider scope={__scopeAlertOpener} contentRef={contentRef}>
      <Opener.Content
        {...openerScope}
        {...props}
        ref={contentRef}
        className={cn('bg-red-500 text-white', className)}
      />
    </AlertOpenerContentProvider>
  );
};

//////

const CONTENTSIZE_NAME = 'AlertOpenerContentSize';

interface AlertOpenerContentSizeProps extends React.HTMLAttributes<HTMLDivElement> {}

const AlertOpenerContentSize: React.FC<AlertOpenerContentSizeProps> = ({
  __scopeAlertOpener,
  className,
  ...props
}: ScopedProps<AlertOpenerContentSizeProps>) => {
  const { contentRef } = useAlertOpenerContentContext(CONTENTSIZE_NAME, __scopeAlertOpener);
  const [size, setSize] = React.useState<{ width: string; height: string }>({
    width: '',
    height: '',
  });

  React.useEffect(() => {
    if (contentRef?.current) {
      const { width, height } = contentRef.current.getBoundingClientRect();
      setSize({ width: width.toFixed(2), height: height.toFixed(2) });
    }
  }, [contentRef]);

  return (
    <div {...props} className={cn('flex items-center', className)}>
      <strong className="shrink-0">size(w / h): </strong>
      <span className="ml-1 shrink-0">
        {size.width} / {size.height}
      </span>
    </div>
  );
};

export {
  //
  AlertOpener as Root,
  AlertOpenerTrigger as Trigger,
  AlertOpenerContent as Content,
  AlertOpenerContentSize as ContentSize,
  //
  createAlertOpenerScope,
};
