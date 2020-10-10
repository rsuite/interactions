import {
  screen,
  waitForElementToBeRemoved,
  fireEvent,
  findByText,
  act
} from '@testing-library/react';
import { alert } from '../src';

let modal;
let okButton;

async function openAlert(message, options) {
  await closeAlert();
  alert(message, options);
  modal = (await screen.findAllByRole('dialog')).find(div => div.classList.contains('rs-modal'));
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
  expect(alertModal)
    .not
    .toBeNull();
  expect(okButton)
    .not
    .toBeNull();
});

it('closes on clicking ok button', async () => {
  await closeAlert();
});

it('renders custom ok button text', async () => {
  const okButtonText = 'Okay';
  await openAlert('Message', {
    okButtonText
  });

  expect(okButton.textContent)
    .toBe(okButtonText);
});

it('calls onOk on clicking ok button', async () => {
  const onOk = jest.fn();
  await act(async () => {
    await openAlert('Message', {
      onOk
    });
    fireEvent.click(okButton);
  });

  expect(onOk)
    .toBeCalled();
});

describe('waits for async onOk', () => {
  beforeAll(async () => {
    jest.useFakeTimers();
    const asyncOnOk = jest.fn(() => new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    }));
    await act(async () => {
      await openAlert('Message', {
        onOk: asyncOnOk
      });
      fireEvent.click(okButton);
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('shows loading on ok button', () => {
    expect(okButton.classList.contains('rs-btn-loading'))
      .toBe(true);
  });

  it('closes after Promise finishes', async () => {
    jest.advanceTimersByTime(1000);
    await waitForElementToBeRemoved(modal);
  });
});

