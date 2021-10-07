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

  alert(message);
  const dialog = screen.getByRole('dialog');
  expect(dialog).toBeVisible();
  expect(dialog).toHaveTextContent(message);

  expect(
    within(dialog).getByRole('button', { name: '确定' })
  ).toBeInTheDocument();
});

it('closes on clicking ok button', async () => {
  alert('Message');

  userEvent.click(screen.getByRole('button', { name: '确定' }));

  await waitForElementToBeRemoved(screen.getByRole('dialog'));
});

it('renders custom ok button text', () => {
  const okButtonText = 'Okay';
  alert('Message', {
    okButtonText,
  });

  expect(
    screen.getByRole('button', { name: okButtonText })
  ).toBeInTheDocument();
});

describe('triggers callbacks', () => {
  it('calls onOk on clicking ok button', async () => {
    const onOk = jest.fn();
    alert('Message', {
      onOk,
    });

    userEvent.click(screen.getByRole('button', { name: '确定' }));
    expect(onOk).toHaveBeenCalled();
  });

  describe('waits for async onOk', () => {
    let promise;
    beforeEach(async () => {
      jest.useFakeTimers();
      const asyncOnOk = jest.fn(
        () =>
          (promise = new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          }))
      );

      alert('Message', {
        onOk: asyncOnOk,
      });
      userEvent.click(screen.getByRole('button', { name: '确定' }));
    });

    afterEach(async () => {
      jest.advanceTimersByTime(1000);
      jest.useRealTimers();
      await act(() => promise);
    });

    it('shows loading on ok button', () => {
      expect(screen.getByRole('button', { name: '确定' })).toHaveClass(
        'rs-btn-loading'
      );
    });

    it('closes after Promise finishes', async () => {
      jest.advanceTimersByTime(1000);
      await waitForElementToBeRemoved(screen.getByRole('dialog'));
    });
  });
});
