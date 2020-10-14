import {
  screen,
  waitForElementToBeRemoved,
  fireEvent,
  findByText,
  act,
} from '@testing-library/react';
import { alert } from '../src';

let modal;
let okButton;

async function openAlert(message, options) {
  await closeAlert();
  alert(message, options);
  modal = (await screen.findAllByRole('dialog')).find((div) =>
    div.classList.contains('rs-modal')
  );
  okButton = modal.querySelector('.rs-btn-primary');
}

async function closeAlert() {
  if (okButton) {
    fireEvent.click(okButton);
    await waitForElementToBeRemoved(modal);
    modal = null;
    okButton = null;
  }
}

it('shows alert modal', async () => {
  await openAlert('Message');
  const alertModal = await findByText(modal, 'Message');
  expect(alertModal).not.toBeNull();
  expect(okButton).not.toBeNull();
});

it('closes on clicking ok button', async () => {
  await closeAlert();
});

it('renders custom ok button text', async () => {
  const okButtonText = 'Okay';
  await openAlert('Message', {
    okButtonText,
  });

  expect(okButton.textContent).toBe(okButtonText);
});

describe('triggers callbacks', () => {
  it('calls onOk on clicking ok button', async () => {
    const onOk = jest.fn();
    await openAlert('Message', {
      onOk,
    });
    fireEvent.click(okButton);

    expect(onOk).toBeCalled();
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

      await openAlert('Message', {
        onOk: asyncOnOk,
      });
      fireEvent.click(okButton);
    });

    afterEach(async () => {
      jest.advanceTimersByTime(1000);
      jest.useRealTimers();
      await act(() => promise);
    });

    it('shows loading on ok button', () => {
      expect(okButton.classList.contains('rs-btn-loading')).toBe(true);
    });

    it('closes after Promise finishes', async () => {
      jest.advanceTimersByTime(1000);
      await waitForElementToBeRemoved(modal);
    });
  });
});
