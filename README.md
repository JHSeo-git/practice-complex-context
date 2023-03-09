# practice-complex-context

Practice for React context when using nested contexts.

## why

최근에 UI 컴포넌트를 만드는 경험을 많이 했습니다. 주로 headless 컴포넌트 라이브러리를 가져와 개발을 많이 했었는데, 리액트 Context API를 사용하는 케이스가 많았습니다.
Props Drilling을 피하고, 리액트 트리 내 Context를 공유하는 것이 더 효율적이라고 생각했기 때문일 것 같습니다. 리액트는 peer로 설정해두기에 별도 전역 상태 관리 라이브러리를 사용하지 않고도 리액트 Context API를 사용하면서 상태를 공유할 수 있기 때문이기도 했습니다.

그러던 와중에 복잡한 컴포넌트들을 개발하게 되면서 리액트 Context API를 사용하는 도중 예기치 않은 문제가 발생했습니다. 그 얘기와 관련되어 이 글과 Practice 코드를 작성하게 되었습니다.

## issue

컴포넌트(간단하게 `A` 컴포넌트라고 지칭하겠습니다)를 재사용한 또 다른 컴포넌트(`B` 컴포넌트)를 만들면서 동일 Context를 사용하게 되었는데, Context가 의도한 대로 동작하지 않았습니다.
다시 말해서, consumer에서 의도한 Context를 가져오지 못하는 문제가 발생했습니다.

예를 들어, `children`을 트리거를 통해 자식 컴포넌트를 보여주거나 숨기는 간단한 컴포넌트(`<Opener />`)가 있습니다.

```tsx
interface OpenerContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
// Opener Context
const OpenerContext = React.createContext<OpenerContextValue | null>(null);

// Opener
function Opener({ className, children }: OpenerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <OpenerContext.Provider value={{ open, setOpen }}>
      <div className={cn('relative', className)}>{children}</div>
    </OpenerContext.Provider>
  );
}
```

`<Opener />` 컴포넌트는 `children`(consumer)에서 `OpenerContext`를 사용할 수 있습니다.

Compound 컴포넌트 형태로 제공하는 `<OpenerTrigger />`와 `<OpenerContent />`도 제공됩니다.

```tsx
function OpenerTrigger({ children }: OpenerProps) {
  const { setOpen } = React.useContext(OpenerContext);

  return <button onClick={() => setOpen((prev) => !prev)}>{children}</button>;
}

function OpenerContent({ children }: OpenerContentProps) {
  const { open } = React.useContext(OpenerContext);

  if (!open) {
    return null;
  }

  return <div>{children}</div>;
}
```

`<Opener />` 컴포넌트는 문제없이 동작합니다.

```tsx
function App() {
  return (
    <Opener>
      <OpenerTrigger>Open</OpenerTrigger>
      <OpenerContent>Content</OpenerContent>
    </Opener>
  );
}
```

그러나 만약 여러 중첩된 컴포넌트에서 `<Opener />`를 사용하게 된다면, `<Opener />` 컴포넌트를 사용하는 컴포넌트의 Context가 `<Opener />` 컴포넌트의 Context를 덮어쓰게 됩니다.

**[정확하게 consumer는 가장 가까운 Provider의 Context를 가져오게 되는데, 중첩되고 복잡한 컴포넌트 트리에서는 의도하지 않은 Context를 가져오게 될 수 있습니다.](https://beta.reactjs.org/reference/react/useContext#passing-data-deeply-into-the-tree)**

좀 더 구체적으로 예를 들어보겠습니다.

`<Opener />`를 사용하여 `<AlertOpener />` 컴포넌트를 만들어 보겠습니다.

```tsx
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
```

마찬가지로 `<AlertOpener />`는 단독으로 사용 시 문제없이 정상 동작합니다.

```tsx
function App() {
  return (
    <AlertOpener>
      <AlertOpenerTrigger>Open</AlertOpenerTrigger>
      <AlertOpenerContent>Content</AlertOpenerContent>
    </AlertOpener>
  );
}
```

만약 `<AlertOpener />` 컴포넌트 내에서 `<Opener />` 컴포넌트를 다음과 같이 사용할 경우는 어떻게 될까요?

```tsx
function App() {
  return (
    <AlertOpener>
      <Opener>
        <OpenerTrigger>Opener Open</OpenerTrigger>
        <OpenerContent>
          Opener Content
          <AlertOpenerTrigger>AlertOpener Open</AlertOpenerTrigger>
          <AlertOpenerContent>AlertOpener Content</AlertOpenerContent>
        </OpenerContent>
      </Opener>
    </AlertOpener>
  );
}
```

![wrong-case-1](./docs/images/wrong-case-1.png)

렌더링은 문제 없이 동작합니다. 그러나 `AlertOpenerTrigger`를 클릭하면 의도했던 `AlertOpenerContent`가 렌더링되는 대신 `OpenerContent`가 닫히게 됩니다.

그 이유는 컴포넌트 트리에서 볼 수 있습니다.

![wrong-case-2](./docs/images/wrong-case-2.png)

`AlertOpenerTrigger` 위치를 코드에서 보게 되면 가장 가까운 Context Provider는
`<AlertOpener />`에서 제공되는 Provider가 아닌 `<Opener />`에서 제공되는 Provider입니다.

위 `consumer는 가장 가까운 Provider의 Context를 가져온다`는 원칙에 따라 `AlertOpenerTrigger`는 `<Opener />`에서 제공되는 Context를 가져오게 됩니다.
따라서 `AlertOpenerTrigger`를 클릭하면 `AlertOpenerContent`가 렌더링되는 대신 `OpenerContent`가 닫히게 됩니다.

이런 구조를 피해 코드를 작성할 수도 있지만, 이런 구조를 사용해야 하는 경우가 있을 수도 있습니다.
그런 경우라면 어떻게 해야할까요?

radix-ui 코드를 통해 _중첩 동일 Scope Context내에서 의도한 Scope Context 가져오기_ 의 해결 방법 중 하나가 있어서 알아보았습니다.
그 전에 _brute-force_ 방법을 먼저 접근해보았습니다.
