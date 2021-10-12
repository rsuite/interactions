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
}
```

- `okButtonText`: Customize "OK" button text.
- `cancelButtonText`: Customize "Cancel" button text.
- `onOk`: Callback function when "OK" is clicked, receiving a string representing the user input. If `onOk` returns a `Promise`, "OK" button shows loading status until the promise finishes.
- `onCancel`: Callback function when "Cancel" is clicked. If not provided, "Cancel" is disabled when "OK" is loading.
- `canCancelOnLoading`: When `onCancel` is set, you can still use this option to force disable "Cancel" button.

## Testability

If you use `@rsuite/interactions` to call alert dialogs in your app, you can easily test it with `@testing-library/react`.

Say you want to show a confirm dialog when user clicks a button that will delete a post:

```jsx
import { confirm } from '@rsuite/interactions';

function App() {
  async function confirmDeletePost(id) {
    if (await confirm('Are you sure?')) {
      await api.deletePost(id);
    }
  }

  return <button onClick={() => confirmDeletePost(1)}>Delete post 1</button>;
}
```

And you want to test that the dialog is shown when the button is clicked:

```jsx
import { render, fireEvent, screen } from '@testing-library/react';

it('Should show a confirm dialog', () => {
  const { getByRole } = render(<App />);

  fireEvent.click(getByRole('button', { name: /delete post/i }));

  // Assume you're using Jest with @testing-library/jest-dom
  const dialog = screen.getByRole('alertdialog');
  expect(dialog).toBeVisible();
  // Assert on its a11y description
  expect(dialog).toHaveAccessibleDescription('Are you sure?');
  // Or if you're using jest-dom < 5.14, you can assert on its textContent
  expect(dialog).toHaveTextContent('Are you sure?');
});
```

## License

MIT licensed

[npm-svg]: https://badge.fury.io/js/%40rsuite%2Finteractions.svg
[npm-home]: https://www.npmjs.com/package/@rsuite/interactions
[actions-svg]: https://github.com/rsuite/interactions/workflows/Node.js%20CI/badge.svg
[actions-home]: https://github.com/rsuite/interactions/actions?query=workflow%3A%22Node.js+CI%22
