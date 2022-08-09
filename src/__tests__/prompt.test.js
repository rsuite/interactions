import {
  screen,
  waitForElementToBeRemoved,
  fireEvent,
  within,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import manager from '../InteractionManager';
import prompt from '../prompt';

afterEach(async () => {
  manager.resetQueue();
});

it('shows dialog with given message and an text input and two buttons', async () => {
  const message = 'Message';
  prompt(message);

  const dialog = screen.getByRole('alertdialog');
  expect(dialog).toBeVisible();
  expect(dialog).toHaveTextContent(message);

  expect(within(dialog).getByRole('textbox')).toBeInTheDocument();
  expect(
    within(dialog).getByRole('button', { name: '取消' })
  ).toBeInTheDocument();
  expect(
    within(dialog).getByRole('button', { name: '确定' })
  ).toBeInTheDocument();
});

it('Should lock focus on the text input', () => {
  prompt('Message');

  const dialog = screen.getByRole('alertdialog');
  const textbox = within(dialog).getByRole('textbox');

  // Textbox has focus initially
  expect(textbox).toHaveFocus();

  userEvent.tab();

  // Still has focus after user presses Tab
  expect(textbox).toHaveFocus();
});

it('renders default value', async () => {
  const defaultValue = 'Default value';
  prompt('Message', defaultValue);

  expect(screen.getByRole('textbox')).toHaveValue(defaultValue);
});

it('renders custom button text', async () => {
  const okButtonText = 'Okay';
  const cancelButtonText = 'Nah';
  prompt('Message', '', {
    okButtonText,
    cancelButtonText,
  });

  expect(
    screen.getByRole('button', { name: cancelButtonText })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: okButtonText })
  ).toBeInTheDocument();
});

it('renders red ok button when okButtonDangerous=true', () => {
  prompt('Message', '', {
    okButtonDangerous: true,
  });

  expect(screen.getByRole('button', { name: '确定' })).toHaveClass(
    'rs-btn-red'
  );
});

it('disable OK button if validation fails', () => {
  prompt('Message', '', {
    validate: () => false,
  });

  expect(screen.getByRole('button', { name: '确定' })).toBeDisabled();
});

it('enable OK button when validation passes', () => {
  prompt('Message', '', {
    validate: (value) => value === 'expected',
  });

  userEvent.type(screen.getByRole('textbox'), 'expected');

  expect(screen.getByRole('button', { name: '确定' })).not.toBeDisabled();
});

describe('resolves correctly', () => {
  const inputValue = 'Input value';

  it('hides dialog and resolves input value on clicking ok button', async () => {
    const promise = prompt('Message');
    userEvent.type(screen.getByRole('textbox'), inputValue);
    userEvent.click(screen.getByRole('button', { name: '确定' }));
    await expect(promise).resolves.toBe(inputValue);
  });

  it('hides dialog and resolves null on clicking cancel button', async () => {
    const promise = prompt('Message');
    userEvent.type(screen.getByRole('textbox'), inputValue);
    userEvent.click(screen.getByRole('button', { name: '取消' }));
    await expect(promise).resolves.toBe(null);
  });

  it('hides dialog and resolves input value on pressing Enter', async () => {
    const promise = prompt('Message');
    userEvent.type(screen.getByRole('textbox'), inputValue);
    fireEvent.keyDown(document, { key: 'Enter' });
    await expect(promise).resolves.toBe(inputValue);
  });

  it('hides dialog and resolves null on pressing Esc', async () => {
    const promise = prompt('Message');
    userEvent.type(screen.getByRole('textbox'), inputValue);
    fireEvent.keyDown(document, { key: 'Escape' });
    await expect(promise).resolves.toBe(null);
  });
});

describe('triggers callbacks', () => {
  it('calls onOk on clicking ok button', async () => {
    const onOk = jest.fn();
    prompt('Message', '', {
      onOk,
    });

    userEvent.click(screen.getByRole('button', { name: '确定' }));
    expect(onOk).toHaveBeenCalled();
  });

  it('calls onCancel on clicking cancel button', async () => {
    const onCancel = jest.fn();
    prompt('Message', '', {
      onCancel,
    });

    userEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('works with async onOk function', async () => {
    const asyncOnOk = jest.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        })
    );
    const promise = prompt('Message', '', {
      async onOk() {
        await asyncOnOk();
      },
    });

    const okButton = screen.getByRole('button', { name: '确定' });
    userEvent.click(okButton);

    expect(asyncOnOk).toHaveBeenCalled();

    await act(() => promise);
  });

  describe('waits for async onOk', () => {
    it('shows loading on ok button', async () => {
      const asyncOnOk = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          })
      );
      const promise = prompt('Message', '', {
        onOk: asyncOnOk,
      });

      const okButton = screen.getByRole('button', { name: '确定' });
      userEvent.click(okButton);
      expect(okButton).toHaveClass('rs-btn-loading');

      await act(() => promise);
    });

    it('disables cancel button while promise running', async () => {
      const asyncOnOk = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          })
      );
      const promise = prompt('Message', '', {
        onOk: asyncOnOk,
      });

      const okButton = screen.getByRole('button', { name: '确定' });
      userEvent.click(okButton);

      expect(screen.getByRole('button', { name: '取消' })).toBeDisabled();
      await act(() => promise);
    });

    it("doesn't disable  cancel button if onCancel is provided", async () => {
      const asyncOnOk = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          })
      );
      const promise = prompt('Message', '', {
        onOk: asyncOnOk,
        onCancel: jest.fn(),
      });

      const okButton = screen.getByRole('button', { name: '确定' });
      userEvent.click(okButton);

      expect(screen.getByRole('button', { name: '取消' })).not.toBeDisabled();
      await act(() => promise);
    });

    it("doesn't disable cancel button if canCancelOnLoading is true", async () => {
      const asyncOnOk = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          })
      );
      const promise = prompt('Message', '', {
        onOk: asyncOnOk,
        canCancelOnLoading: true,
      });

      const okButton = screen.getByRole('button', { name: '确定' });
      userEvent.click(okButton);

      expect(screen.getByRole('button', { name: '取消' })).not.toBeDisabled();
      await act(() => promise);
    });

    it('force disable cancel button if canCancelOnLoading is false', async () => {
      const asyncOnOk = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          })
      );
      const promise = prompt('Message', '', {
        onOk: asyncOnOk,
        onCancel: jest.fn(),
        canCancelOnLoading: false,
      });

      const okButton = screen.getByRole('button', { name: '确定' });
      userEvent.click(okButton);

      expect(screen.getByRole('button', { name: '取消' })).toBeDisabled();
      await act(() => promise);
    });

    it('closes after promise finishes', async () => {
      jest.useFakeTimers();
      const asyncOnOk = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          })
      );
      prompt('Message', '', {
        onOk: asyncOnOk,
      });

      const okButton = screen.getByRole('button', { name: '确定' });
      userEvent.click(okButton);

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      await waitForElementToBeRemoved(screen.getByRole('alertdialog'));
      jest.useRealTimers();
    });
  });
});

describe('resolve input props in dialog config', () => {
  it('input should be disabled', async () => {
    prompt('Message', '', {
      inputProps: {
        disabled: true,
      },
    });
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
