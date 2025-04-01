import {
  screen,
  waitForElementToBeRemoved,
  fireEvent,
  within,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import manager from '../InteractionManager';
import confirm from '../confirm';

afterEach(async () => {
  manager.resetQueue();
});

it('shows dialog with given message and two buttons', async () => {
  const message = 'Message';

  confirm(message);
  const dialog = screen.getByRole('alertdialog');
  expect(dialog).toBeVisible();
  expect(dialog).toHaveTextContent(message);

  expect(
    within(dialog).getByRole('button', { name: '取消' })
  ).toBeInTheDocument();
  expect(
    within(dialog).getByRole('button', { name: '确定' })
  ).toBeInTheDocument();
});

it('show dialog with custom title', async () => {
  const title = 'Custom Title';
  confirm('Message', {
    title,
  });

  expect(screen.getByRole('alertdialog')).toHaveTextContent(title);
  expect(screen.queryByLabelText('Close')).toBeInTheDocument();
});
it('show dialog without custom title', async () => {
  confirm('Message');

  expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
});

it('renders custom button text', async () => {
  const okButtonText = 'Okay';
  const cancelButtonText = 'Nah';

  confirm('Message', {
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
  confirm('Message', {
    okButtonDangerous: true,
  });

  expect(screen.getByRole('button', { name: '确定' })).toHaveClass(
    'rs-btn-red'
  );
});

describe('resolves correctly', () => {
  it('hides modal and resolves true on clicking ok button', async () => {
    const promise = confirm('Message');
    userEvent.click(screen.getByRole('button', { name: '确定' }));

    await expect(promise).resolves.toBe(true);
  });

  it('hides modal and resolves false on clicking cancel button', async () => {
    const promise = confirm('Message');
    userEvent.click(screen.getByRole('button', { name: '取消' }));

    await expect(promise).resolves.toBe(false);
  });

  it('hides modal and resolves true on pressing Enter', async () => {
    const promise = confirm('Message');

    fireEvent.keyDown(document, { key: 'Enter' });
    await expect(promise).resolves.toBe(true);
  });

  it('hides modal and false true on pressing Esc', async () => {
    const promise = confirm('Message');

    fireEvent.keyDown(document, { key: 'Escape' });
    await expect(promise).resolves.toBe(false);
  });
});

describe('triggers callbacks', () => {
  it('calls onOk on clicking ok button', async () => {
    const onOk = jest.fn();
    confirm('Message', {
      onOk,
    });

    userEvent.click(screen.getByRole('button', { name: '确定' }));
    expect(onOk).toHaveBeenCalled();
  });

  it('calls onCancel on clicking cancel button', async () => {
    const onCancel = jest.fn();
    confirm('Message', {
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
    const promise = confirm('Message', {
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

      const promise = confirm('Message', {
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

      const promise = confirm('Message', {
        onOk: asyncOnOk,
      });

      userEvent.click(screen.getByRole('button', { name: '确定' }));
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

      const promise = confirm('Message', {
        onOk: asyncOnOk,
        onCancel: jest.fn(),
      });

      userEvent.click(screen.getByRole('button', { name: '确定' }));
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

      const promise = confirm('Message', {
        onOk: asyncOnOk,
        canCancelOnLoading: true,
      });

      userEvent.click(screen.getByRole('button', { name: '确定' }));
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

      const promise = confirm('Message', {
        onOk: asyncOnOk,
        onCancel: jest.fn(),
        canCancelOnLoading: false,
      });

      userEvent.click(screen.getByRole('button', { name: '确定' }));
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

      confirm('Message', {
        onOk: asyncOnOk,
        onCancel: jest.fn(),
        canCancelOnLoading: false,
      });

      userEvent.click(screen.getByRole('button', { name: '确定' }));
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      await waitForElementToBeRemoved(screen.getByRole('alertdialog'));
      jest.useRealTimers();
    });
  });
});
