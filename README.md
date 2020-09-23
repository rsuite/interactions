# RSuite Interactions

> Call RSuite Modals like a boss.

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
interface AlertModalProps {
  okButtonText?: string;
  onOk?: (() => void) | (() => Promise<any>);
}

alert(
  message?: React.ReactNode,
  modalConfig?: AlertModalProps
): Promise<void>;
```

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
interface ConfirmModalProps {
  okButtonText?: string;
  cancelButtonText?: string;
  onOk?: (() => void) | (() => Promise<any>);
  onCancel?: (isSubmitLoading?: boolean) => any;
  canCancelOnLoading?: boolean;
}

confirm(
  message?: React.ReactNode,
  modalConfig?: ConfirmModalProps
): Promise<boolean>;
```

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
interface PromptModalProps {
  okButtonText?: string;
  cancelButtonText?: string;
  onOk?: ((inputVal?: string) => void) | ((inputVal: string) => Promise<any>);
  onCancel?: (isSubmitLoading?: boolean) => any;
  canCancelOnLoading?: boolean;
}

prompt(
  message?: React.ReactNode,
  _default?: string,
  modalConfig?: PromptModalProps
): Promise<string | null>;
```

## License

MIT licensed
