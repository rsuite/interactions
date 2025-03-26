import {
  screen,
  waitForElementToBeRemoved,
  act,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import manager from '../InteractionManager';
import alert from '../alert';

afterEach(() => {
  manager.resetQueue();
});

it('shows dialog with given message and an ok button', () => {
  const message = 'Message';

  act(() => {
    alert(message);
  });

  const dialog = screen.getByRole('alertdialog');
  expect(dialog).toBeVisible();
  expect(dialog).toHaveTextContent(message);

  expect(
    within(dialog).getByRole('button', { name: '确定' })
  ).toBeInTheDocument();
});

it('closes on clicking ok button', async () => {
  act(() => {
    alert('Message');
  });

  await userEvent.click(screen.getByRole('button', { name: '确定' }));

  await waitForElementToBeRemoved(screen.getByRole('alertdialog'));
});

it('renders custom ok button text', () => {
  const okButtonText = 'Okay';

  act(() => {
    alert('Message', {
      okButtonText,
    });
  });

  expect(
    screen.getByRole('button', { name: okButtonText })
  ).toBeInTheDocument();
});

describe('triggers callbacks', () => {
  it('calls onOk on clicking ok button', async () => {
    const onOk = jest.fn();

    act(() => {
      alert('Message', {
        onOk,
      });
    });

    await userEvent.click(screen.getByRole('button', { name: '确定' }));
    expect(onOk).toHaveBeenCalled();
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

    act(() => {
      alert('Message', {
        async onOk() {
          await asyncOnOk();
        },
      });
    });

    await userEvent.click(screen.getByRole('button', { name: '确定' }));

    expect(asyncOnOk).toHaveBeenCalled();
  });

  describe('waits for async onOk', () => {
    let promise;
    beforeEach(async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      const asyncOnOk = jest.fn(
        () =>
          (promise = new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 10000);
          }))
      );

      act(() => {
        alert('Message', {
          onOk: asyncOnOk,
        });
      });

      await user.click(screen.getByRole('button', { name: '确定' }));
    });

    it('shows loading on ok button', () => {
      expect(screen.getByRole('button', { name: '确定' })).toHaveClass(
        'rs-btn-loading'
      );
    });

    it('closes after Promise finishes', async () => {
      act(() => {
        jest.advanceTimersByTime(10000);
      });
      jest.useRealTimers();

      await waitForElementToBeRemoved(screen.getByRole('alertdialog'));
    });
  });
});
