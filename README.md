# Performance Measure

This is a small API based on Firebase Perform library.

## Install

```bash
npm install --save react-native-firebase-perf-tracer
// or
yarn add react-native-firebase-perf-tracer
```

## Dependencies

- `react-native` 0.61 or above
- `@react-native-firebase/perf` 6.3.4 or above

```bash
// Install dependencies
npm install --save  @react-native-firebase/perf
// or
yarn add @react-native-firebase/perf
```

## How to use it?

The most complete/automatic implementation can be easily get by the use of the it's Higher-Order Component.
Here is a sample on how to use the [Higher-Order Component](https://reactjs.org/docs/higher-order-components.html) on your components:

```jsx
// raw-compoent.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { PerformanceMeasureHOCTypeProps } from '../infra/performance/types.d';

interface Props extends PerformanceMeasureHOCTypeProps {
  yourProp: String;
}

class RawComponentClass extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    // Now you have access to props defined in PerformanceMeasureHOCTypeProp
  }
}

export const RawComponent = withPerformanceMeasure(
  RawComponentClass,
  'RawComponentClass'
);
```

Now you have access to the pops created by the HOC described as:

```typescript
interface PerformanceMeasureHOCTypeProps {
	performance: PerformanceMeasureHookType;
	profileTracerReady: () => void;
	profileTracerFail: () => void;
	profileTracerSession: PerformanceMeasureSession | undefined;
}
```

### Breaking it down

**performance**: A performance instance of a PerformanceMeasureHookType already set to the provided identifier.

**profileTracerReady**: A simple callback to finish profileTracerSession

**profileTracerFail**: It finishes the profileTracerSession and set the `fail` attribute to `true`.

**profileTracerSession**: An already running session named profiler, which implements `React.Profiler` to get `mount_time` among and `updates` count,
it is set to Firebase Perf Dashboard as `[SNAKE_CASE_OF_PROVIDED_IDENTIFIER]::profiler` it can be user to set your own attributes and metrics _(Limited to 35)_

## Performance Measure Hook

Use it in your functional components like this:

```typescript
import { PerformanceMeasureHOCTypeProps, usePerformanceMeasure } from '../infra/performance';
...
export const RawComponentFunction = React.FC<Props>() => {
	const performance = usePerformanceMeasure('RawComponent');
  ...
};
```

You should provide a identifier to be used in Firebase Perf Dashboard. The performance object implents `PerformanceMeasureHookType`.

```typescript
interface PerformanceMeasureHookType {
	startTraceSession(name: string): Promise<PerformanceMeasureSession>;
	completeTraceSession(name: string): void;
	failTraceSession(name: string): void;
	traceMethod: TraceMethodType;
}
```

### Breaking it down:

**startTraceSession**: Creates a new trace session appending the session name as provided `[IDENTIFIER]::[SESSION_NAME]` and returns an instance of `PerformanceMeasureSession`. It is described [here](#performance-measure-session).

**completeTraceSession**: A simple method to finish a tracer session.

**failTraceSession**: It finishes the tracer session and set the `fail` attribute to `true`.

**traceMethod**: For convenience, you can use this to wrap your methods so they can be tracked automatically.

**Here is example of functional component we will be using:**

```jsx
// raw-compoent.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  yourProp: String;
}

export const RawComponentFunction = React.FC<Props>() => {
  const [isReady, setComponentReady] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  const doSomethingReallyExpensive = async () => {
    const response = await getFromNetwork();
    await doSomethingThatTakesAWhile()
    await doSomethingThatTakesAWhileAgainWhyNot();
  }

  const doAnotherExpensiveThing = async () => {
    return await callSomeMethodHere();
  };

  const loadContent = async () => {
    setError();
    try {
      await doSomethingReallyExpensive();
      await doAnotherExpensiveThing();
    } catch (error) {
      setError(error.message);
    } finally {
      setComponentReady(true);
    }
  }

  const renderLoading = () => <View style={styles.loadingOverlay} />;

  const renderContent = () => {
    if (error) {
      return <Error message={error} retry={start} />
    }

    return (
      <View style={styles.container}>
        ...
      </View>
    );
  };

  React.useEffect(() => {
		loadContent();
	}, []);

  return isReady ? renderContent() : renderLoading();
};
```

**Here is after the implementation diff:**

```diff
// raw-compoent.tsx
import React from 'react';
import { View, Text } from 'react-native';
+ import { PerformanceMeasureHOCTypeProps, withPerformanceMeasure } from '../infra/performance';

- interface Props extends PerformanceMeasureHOCTypeProps {
+ interface Props extends PerformanceMeasureHOCTypeProps {
  yourProp: String;
}

- export const RawComponentFunction: React.FC<Props> = () => {
+ export const RawComponentFunction: React.FC<Props> = withPerformanceMeasure(({
+ 	performance,
+ 	profileTracerReady,
+		profileTracerFail,
+ 	profileTracerSession,
+	}) => {
	const [isReady, setComponentReady] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string>();

	const doSomethingReallyExpensive = async () => {
+		const myTraceSession = await performance.startTraceSession('do_something_really_expensive');
-   const response = await getFromNetwork();
+   const response = await myTraceSession.traceCodeSection(async () => {
+			return await getFromNetwork();
+   }, 'get_from_network');
+
-   await doSomethingThatTakesAWhile()
-   await doSomethingThatTakesAWhileAgainWhyNot();
+   await myTraceSession.traceCodeSection(async () => {
+   	await doSomethingThatTakesAWhile()
+   	await doSomethingThatTakesAWhileAgainWhyNot();
+   }, 'do_something_that_takes_a_while');
+
+    performance.completeTraceSession('do_something_really_expensive');
	};

- const doAnotherExpensiveThing = async () => {
+ const doAnotherExpensiveThing = performance.traceMethod(async () => {
    return await callSomeMethodHere();
-  };
+ }, 'do_another_expensive_thing');

  const loadContent = async () => {
    setError(undefined);
    try {
      await doSomethingReallyExpensive();
      await doAnotherExpensiveThing();
+			profileTracerReady();
    } catch (error) {
      setError(error.message);
+			profileTracerFail();
    } finally {
      setComponentReady(true);
    }
  }

  const renderLoading = () => <View style={styles.loadingOverlay} />;

  const renderContent = () => {
    if (error) {
      return <Error message={error} retry={loadContent} />
    }

    return (
      <View style={styles.container}>
        ...
      </View>
    );
  };

  React.useEffect(() => {
		loadContent();
	}, []);

  return isReady ? renderContent() : renderLoading();
- }
+ }, 'raw_component_id');
```

# Performance Measure Session

```typescript
abstract class PerformanceMeasureSessionType {
	async startTraceSession(): void;
	completeTraceSession(): void;
	startLoading(loadingName: string): StopLoadingCallback;
	putAttribute(attributeName: string, value: string): void;
	incrementMetric(metricName: string, incrementBy: number): void;
}
```

# License

- [MIT](./LICENSE)

# Contributing

Contributions are very welcome!

- [Code of Conduct](./CODE_OF_CONDUCT.txt)
- [Contributing Guide](./CONTRIBUTING.txt)

# From Developers

Made with ❤️ by [Zenklub](zenklub.com.br) developer team.
