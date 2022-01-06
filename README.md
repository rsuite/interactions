# RSuite Interactions

> Call RSuite Modals like a boss.

[![npm][npm-svg]][npm-home]
[![GitHub Actions][actions-svg]][actions-home]
[![codecov](https://codecov.io/gh/rsuite/interactions/branch/master/graph/badge.svg)](https://codecov.io/gh/rsuite/interactions)

    npm install @rsuite/interactions --save

## Features

- Easy to call out `alert()`, `confirm()`, `prompt()` styles modals as you already know how.
- Await their return values.
- Multiple calls are queued.

## API

- [`alert`](#alert)
- [`confirm`](#confirm)
- [`prompt`](#prompt)

### `alert`

Use it like you are using `window.alert()`, and you can await it.

```tsx
const buyNewPhone = useCallback(async () => {
  await alert("Congrats! You've got a new iPhone!");
  console.log('alert closed');
}, []);
```

#### Signatures

```tsx
alert(
  message?: React.ReactNode,
  modalConfig?: AlertModalProps
): Promise<void>;

interface AlertModalProps {
  okButtonText?: string;
  onOk?: (() => void) | (() => Promise<any>);
}
```

- `okButtonText`: Customize "OK" button text.
- `onOk`: Callback function when "OK" is clicked. If `onOk` returns a `Promise`, "OK" button shows loading status until the promise finishes.

### `confirm`

Use it like you are using `window.confirm()` but await its return value.

```tsx
const confirmSmashPhone = useCallback(async () => {
  if (await confirm('Are you sure you what to do this?')) {
    alert('Rest in pieces.');
  }
}, []);
```

#### Signatures

```tsx
confirm(
  message?: React.ReactNode,
  modalConfig?: ConfirmModalProps
): Promise<boolean>;

interface ConfirmModalProps {
  okButtonText?: string;
  cancelButtonText?: string;
  onOk?: (() => void) | (() => Promise<any>);
  onCancel?: (isSubmitLoading?: boolean) => any;
  canCancelOnLoading?: boolean;
}
```

- `okButtonText`: Customize "OK" button text.
- `cancelButtonText`: Customize "Cancel" button text.
- `onOk`: Callback function when "OK" is clicked. If `onOk` returns a `Promise`, "OK" button shows loading status until the promise finishes.
- `onCancel`: Callback function when "Cancel" is clicked. If not provided, "Cancel" is disabled when "OK" is loading.
- `canCancelOnLoading`: When `onCancel` is set, you can still use this option to force disable "Cancel" button.

### `prompt`

Use it like you are using `window.prompt()` but await its return value.

```tsx
const promptForName = useCallback(async () => {
  const name = await prompt('What is your name?');
  if (name) {
    alert(`It\'s ok, ${name}.`);
  }
}, []);
```

#### Signatures

```tsx
prompt(
  message?: React.ReactNode,
  _default?: string,
  modalConfig?: PromptModalProps
): Promise<string | null>;

interface PromptModalProps {
  okButtonText?: string;
  cancelButtonText?: string;
  onOk?: ((inputVal?: string) => void) | ((inputVal: string) => Promise<any>);
  onCancel?: (isSubmitLoading?: boolean) => any;
  canCancelOnLoading?: boolean;
  inputProps?: InputProps;
}
```

- `okButtonText`: Customize "OK" button text.
- `cancelButtonText`: Customize "Cancel" button text.
- `onOk`: Callback function when "OK" is clicked, receiving a string representing the user input. If `onOk` returns a `Promise`, "OK" button shows loading status until the promise finishes.
- `onCancel`: Callback function when "Cancel" is clicked. If not provided, "Cancel" is disabled when "OK" is loading.
- `canCancelOnLoading`: When `onCancel` is set, you can still use this option to force disable "Cancel" button.
- `inputProps`: custom input properties, learn more information about `InputProps` from [here](https://rsuitejs.com/components/input#code-lt-input-gt-code)

## License

MIT licensed

[npm-svg]: https://badge.fury.io/js/%40rsuite%2Finteractions.svg
[npm-home]: https://www.npmjs.com/package/@rsuite/interactions
[actions-svg]: https://github.com/rsuite/interactions/workflows/Node.js%20CI/badge.svg
[actions-home]: https://github.com/rsuite/interactions/actions?query=workflow%3A%22Node.js+CI%22
