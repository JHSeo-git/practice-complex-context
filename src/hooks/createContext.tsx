import * as React from 'react';

/* -------------------------------------------------------------------------------------------------
 * createContext
 * -----------------------------------------------------------------------------------------------*/

/**
 * `React.createContext`를 한 번 감싸서 좀 더 편하게 사용할 수 있도록 만든 함수입니다.
 *
 * `rootComponentName`은 `Provider`의 `displayName`으로 사용됩니다.
 * `defaultContext`는 `useContext`의 initial context로 사용됩니다.
 */
function createContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType
) {
  const Context = React.createContext<ContextValueType | undefined>(defaultContext);

  function Provider(props: ContextValueType & { children: React.ReactNode }) {
    const { children, ...context } = props;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = React.useMemo(() => context, Object.values(context)) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContext(consumerName: string) {
    const context = React.useContext(Context);
    if (context) return context;
    if (defaultContext !== undefined) return defaultContext;

    // defaultContext가 지정되지 않았다면, provider에 내에 사용되어야 하는 context입니다.
    // 따라서, context를 사용하는 컴포넌트가 `Provider`를 사용하지 않았다면, 에러를 발생시킵니다.
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
  }

  Provider.displayName = rootComponentName + 'Provider';

  return [Provider, useContext] as const;
}

/* -------------------------------------------------------------------------------------------------
 * createContextScope
 * -----------------------------------------------------------------------------------------------*/

/**
 * Scope 타입은 key가 `scopeName`이고 value는 generic으로 받은 타입을 가진 `React.Context`의 배열인 Record입니다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Scope<C = any> = { [scopeName: string]: React.Context<C>[] } | undefined;
/**
 * ScopeHook 타입은 `Scope`를 인자로 받고, `__scopeProp`라는 key와 `Scope` value를 가진 Record를 반환합니다.
 */
type ScopeHook = (scope: Scope) => { [__scopeProp: string]: Scope };
/**
 * CreateScope 타입은 `ScopeHook`타입의 함수입니다. 추가로 `scopeName`속성을 가진 객체 형태의 함수입니다.
 */
interface CreateScope {
  scopeName: string;
  (): ScopeHook;
}

/**
 * `createContextScope`는 `createContext`과 `createScope`를 반환합니다.
 * `createContext`는 인자로 받은 scopeName을 기반으로 context를 생성합니다.
 * `createScope`는 인자로 받은 scopeName을 기반으로 scope를 생성하고 인자로 받은 `createContextScopeDeps`와 합쳐서 반환합니다.
 */
function createContextScope(scopeName: string, createContextScopeDeps: CreateScope[] = []) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let defaultContexts: any[] = [];

  /* -----------------------------------------------------------------------------------------------
   * createContextScope - createContext
   * ---------------------------------------------------------------------------------------------*/

  /**
   * createContext를 사용할 때,
   * defaultContext를 추가할 경우 해당 defaultContext를 사용합니다.
   * defaultContext를 추가하지 않는다면 BaseContext(신규 생성)를 사용합니다.
   *
   * 생성된 context(`defaultContext` 또는 `BaseContext`)는 `defaultContexts`(배열)에 추가되어 관리됩니다.
   * createContext는 생성된 context의 `Provider`와 `useContext`를 반환합니다.
   */
  function createContext<ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext?: ContextValueType
  ) {
    const BaseContext = React.createContext<ContextValueType | undefined>(defaultContext);

    // defaultContext를 내부 배열에 추가하기 전에 현재 context length를 캡쳐합니다.
    // createContext를 호출한 시점의 context index를 기억하기 위해
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];

    /**
     * scope는 key가 `scopeName`이고 value는 generic으로 받은 타입을 가진 `React.Context`의 배열인 Record입니다.
     *
     * scope에서 createContextScope param으로 받은 `scopeName`에 해당하는 `React.Context`를 찾습니다.
     * 만약 scope에 해당하는 context가 없다면 `BaseContext`(신규 생성된 context)를 사용합니다.
     *
     * scope에서 찾은(또는 신규 생성한) Context로 `Provider`를 생성합니다.
     */
    function Provider(
      props: ContextValueType & { scope: Scope<ContextValueType>; children: React.ReactNode }
    ) {
      const { scope, children, ...context } = props;
      const Context = scope?.[scopeName][index] || BaseContext;

      // eslint-disable-next-line react-hooks/exhaustive-deps
      const value = React.useMemo(() => context, Object.values(context)) as ContextValueType;
      return <Context.Provider value={value}>{children}</Context.Provider>;
    }

    /**
     * consumerName은 useContext를 사용할 때 내부에서 인식하는 이름입니다. 비정상적인 접근(context가 선언되지 않았거나 등)일 경우 에러 메시지에 사용됩니다.
     * scope는 key가 `scopeName`이고 value는 generic으로 받은 타입을 가진 `React.Context`의 배열인 Record입니다.
     *
     * scope에서 createContextScope param으로 받은 `scopeName`에 해당하는 `React.Context`를 찾습니다.
     * 만약 scope에 해당하는 context가 없다면 `BaseContext`(신규 생성된 context)를 사용합니다.
     *
     * 해당 context로 `React.useContext`를 호출합니다.
     * 만약 해당 context로 `React.useContext`로 생성한 context가 없다면 defaultContext를 사용합니다.
     * 만약 defaultContext도 존재하지 않는다면 에러를 발생시킵니다.
     */
    function useContext(consumerName: string, scope: Scope<ContextValueType | undefined>) {
      const Context = scope?.[scopeName][index] || BaseContext;
      const context = React.useContext(Context);
      if (context) return context;
      if (defaultContext !== undefined) return defaultContext;

      // defaultContext가 지정되지 않았다면, provider에 내에 사용되어야 하는 context입니다.
      // 따라서, context를 사용하는 컴포넌트가 `Provider`를 사용하지 않았다면, 에러를 발생시킵니다.
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }

    Provider.displayName = rootComponentName + 'Provider';
    return [Provider, useContext] as const;
  }

  /* -----------------------------------------------------------------------------------------------
   * createContextScope - createScope
   * ---------------------------------------------------------------------------------------------*/

  /**
   * `defaultContexts`(생성한 context를 관리하는 배열)를 기반으로 `React.createContext`를 호출하여 `scopeContexts` 배열을 생성합니다.
   *
   * 함수를 반환하는데, 이 함수는 scope를 인자로 받습니다.
   * scope는 key가 `scopeName`이고 value는 generic으로 받은 타입을 가진 `React.Context`의 배열인 Record입니다.
   *
   * scope에서 createContextScope param으로 받은 `scopeName`에 해당하는 `React.Context` 배열을 찾습니다.
   * 만약 scope에 `scopeName`값이 없다면 방금 전에 생성한 `defaultContexts`를 기반으로 신규 생성한 `scopeContexts`를 사용합니다.
   *
   * `__scope${scopeName}`이라는 key에 `{ [scopeName]: contexts }`를 추가한 scope를 value로 가지는 객체를 반환하는 함수(custom hook)을 반환합니다.
   *
   * `createScope`의 scopeName은 인자로 받은 `scopeName`으로 설정합니다.
   */
  const createScope: CreateScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return React.createContext(defaultContext);
    });
    return function useScope(scope: Scope) {
      const contexts = scope?.[scopeName] || scopeContexts;
      return React.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };

  createScope.scopeName = scopeName;
  return [createContext, composeContextScopes(createScope, ...createContextScopeDeps)] as const;
}

/* -------------------------------------------------------------------------------------------------
 * composeContextScopes
 * -----------------------------------------------------------------------------------------------*/

/**
 * 주어진 createScope 배열 기반으로 scope를 생성하는 함수를 반환합니다.
 *
 * 배열의 첫 번째 scope(baseScope)를 기반으로 scopes를 순회하면서 하나의 scope로 합칩니다.
 *
 * 주어진 createScope 배열을 순회하면서 각 createScope를 호출하여 scope를 생성합니다.
 * 각 scope를 가져와서 baseScope.scopeName을 key로 가지고 순회하여 합쳐진 scope를 value로 가진 Record를 생성합니다.
 * 이렇게 scope를 합쳐서 생성할 수 있게 하는 createScope 함수를 반환합니다.
 *
 * `createScope`의 scopeName은 인자로 받은 `scopeName`으로 설정합니다.
 */
function composeContextScopes(...scopes: CreateScope[]) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;

  const createScope: CreateScope = () => {
    const scopeHooks = scopes.map((createScope) => ({
      useScope: createScope(),
      scopeName: createScope.scopeName,
    }));

    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes, { useScope, scopeName }) => {
        // callback 내부에서 hook을 호출하는 것은 React가 경고하는(inconsistent renders, 일관성 없는 렌더링) 것이지만,
        // useScope는 렌더링 사이드 이펙트가 없으므로 룰을 무시합니다.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes, ...currentScope };
      }, {});

      return React.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };

  createScope.scopeName = baseScope.scopeName;
  return createScope;
}

export { createContext, createContextScope };
export type { CreateScope, Scope };
