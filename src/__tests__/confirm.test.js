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

  act(() => {
    confirm(message);
  });

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

it('renders custom button text', async () => {
  const okButtonText = 'Okay';
  const cancelButtonText = 'Nah';

  act(() => {
    confirm('Message', {
      okButtonText,
      cancelButtonText,
    });
  });

  expect(
    screen.getByRole('button', { name: cancelButtonText })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: okButtonText })
  ).toBeInTheDocument();
});

it('renders red ok button when okButtonDangerous=true', () => {
  act(() => {
    confirm('Message', {
      okButtonDangerous: true,
    });
  });

  expect(screen.getByRole('button', { name: '确定' })).toHaveClass(
    'rs-btn-red'
  );
});

describe('resolves correctly', () => {
  it('hides modal and resolves true on clicking ok button', async () => {
    let promise;

    act(() => {
      promise = confirm('Message');
    });

    userEvent.click(screen.getByRole('button', { name: '确定' }));

    await expect(promise).resolves.toBe(true);
  });

  it('hides modal and resolves false on clicking cancel button', async () => {
    let promise;

    act(() => {
      promise = confirm('Message');
    });

    userEvent.click(screen.getByRole('button', { name: '取消' }));

    await expect(promise).resolves.toBe(false);
  });

  it('hides modal and resolves true on pressing Enter', async () => {
    let promise;

    act(() => {
      promise = confirm('Message');
    });

    fireEvent.keyDown(document, { key: 'Enter' });
    await expect(promise).resolves.toBe(true);
  });

  it('hides modal and false true on pressing Esc', async () => {
    let promise;

    act(() => {
      promise = confirm('Message');
    });

    fireEvent.keyDown(document, { key: 'Escape' });
    await expect(promise).resolves.toBe(false);
  });
});

describe('triggers callbacks', () => {
  it('calls onOk on clicking ok button', async () => {
    const onOk = jest.fn();

    act(() => {
      confirm('Message', {
        onOk,
      });
    });

    await userEvent.click(screen.getByRole('button', { name: '确定' }));
    expect(onOk).toHaveBeenCalled();
  });

  it('calls onCancel on clicking cancel button', async () => {
    const onCancel = jest.fn();

    act(() => {
      confirm('Message', {
        onCancel,
      });
    });

    await userEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('works with async onOk function', async () => {
    let promise;
    const asyncOnOk = jest.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        })
    );

    act(() => {
      promise = confirm('Message', {
        async onOk() {
          await asyncOnOk();
        },
      });
    });

    await userEvent.click(screen.getByRole('button', { name: '确定' }));

    expect(asyncOnOk).toHaveBeenCalled();

    await act(() => promise);
  });

  describe('waits for async onOk', () => {
    it('shows loading on ok button', async () => {
      let promise;
      const asyncOnOk = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          })
      );

      act(() => {
        promise = confirm('Message', {
          onOk: asyncOnOk,
        });
      });

      const okButton = screen.getByRole('button', { name: '确定' });
      await userEvent.click(okButton);
      expect(okButton).toHaveClass('rs-btn-loading');

      await act(() => promise);
    });

    it('disables cancel button while promise running', async () => {
      let promise;
      const asyncOnOk = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          })
      );

      act(() => {
        promise = confirm('Message', {
          onOk: asyncOnOk,
        });
      });

      await userEvent.click(screen.getByRole('button', { name: '确定' }));
      expect(screen.getByRole('button', { name: '取消' })).toBeDisabled();

      await act(() => promise);
    });

    it("doesn't disable  cancel button if onCancel is provided", async () => {
      let promise;
      const asyncOnOk = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          })
      );

      act(() => {
        promise = confirm('Message', {
          onOk: asyncOnOk,
          onCancel: jest.fn(),
        });
      });

      await userEvent.click(screen.getByRole('button', { name: '确定' }));
      expect(screen.getByRole('button', { name: '取消' })).not.toBeDisabled();

      await act(() => promise);
    });

    it("doesn't disable cancel button if canCancelOnLoading is true", async () => {
      let promise;
      const asyncOnOk = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          })
      );

      act(() => {
        promise = confirm('Message', {
          onOk: asyncOnOk,
          canCancelOnLoading: true,
        });
      });

      await userEvent.click(screen.getByRole('button', { name: '确定' }));
      expect(screen.getByRole('button', { name: '取消' })).not.toBeDisabled();

      await act(() => promise);
    });

    it('force disable cancel button if canCancelOnLoading is false', async () => {
      let promise;
      const asyncOnOk = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          })
      );

      act(() => {
        promise = confirm('Message', {
          onOk: asyncOnOk,
          onCancel: jest.fn(),
          canCancelOnLoading: false,
        });
      });

      await userEvent.click(screen.getByRole('button', { name: '确定' }));
      expect(screen.getByRole('button', { name: '取消' })).toBeDisabled();

      await act(() => promise);
    });

    it('closes after promise finishes', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      const asyncOnOk = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          })
      );

      act(() => {
        confirm('Message', {
          onOk: asyncOnOk,
          onCancel: jest.fn(),
          canCancelOnLoading: false,
        });
      });

      await user.click(screen.getByRole('button', { name: '确定' }));

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      jest.useRealTimers();
      await waitForElementToBeRemoved(screen.getByRole('alertdialog'));
    });
  });
});
