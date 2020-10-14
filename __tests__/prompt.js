import {
  screen,
  waitForElementToBeRemoved,
  fireEvent,
  findByText,
  act
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prompt } from '../src';

let modal;
let input;
let okButton;
let cancelButton;

async function openPrompt(message, _default, options) {
  await closePrompt();
  prompt(message, _default, options);
  modal = (await screen.findByText(message)).closest('.rs-modal');
  input = modal.querySelector('input');
  okButton = modal.querySelector('.rs-btn-primary');
  cancelButton = modal.querySelector('.rs-btn-default');
}

async function closePrompt() {
  if (cancelButton) {
    fireEvent.click(cancelButton);
    await waitForElementToBeRemoved(modal);
    modal = null;
    okButton = null;
    cancelButton = null;
  }
}

afterEach(async () => {
  if (document.contains(modal)) {
    fireEvent.click(modal.querySelector('.rs-btn-default'));
    await waitForElementToBeRemoved(modal);
    modal = null;
    okButton = null;
    cancelButton = null;
  }
});

it('shows confirm modal', async () => {
  await openPrompt('Message');
  const alertModal = await findByText(modal, 'Message');
  expect(alertModal)
    .not
    .toBeNull();
  expect(okButton)
    .not
    .toBeNull();
  expect(cancelButton)
    .not
    .toBeNull();
});

it('renders default value', async () => {
  const defaultValue = 'Default value';
  await openPrompt('Message', defaultValue);
  expect(input.value)
    .toBe(defaultValue);
});

it('renders custom button text', async () => {
  const okButtonText = 'Okay';
  const cancelButtonText = 'Nah';
  await openPrompt('Message', '', {
    okButtonText,
    cancelButtonText
  });

  expect(okButton.textContent)
    .toBe(okButtonText);
  expect(cancelButton.textContent)
    .toBe(cancelButtonText);
});

describe('resolves correctly', () => {
  let promise;
  const inputValue = 'Input value';
  beforeEach(async () => {
    promise = prompt('Message');
    modal = (await screen.findAllByRole('dialog')).find(div => div.classList.contains('rs-modal'));
    input = modal.querySelector('input');
    userEvent.type(input, inputValue);
  });

  it('hides modal and resolves input value on clicking ok button', async () => {
    okButton = modal.querySelector('.rs-btn-primary');
    fireEvent.click(okButton);
    await expect(promise)
      .resolves
      .toBe(inputValue);
  });

  it('hides modal and resolves null on clicking cancel button', async () => {
    cancelButton = modal.querySelector('.rs-btn-default');
    fireEvent.click(cancelButton);
    await expect(promise)
      .resolves
      .toBe(null);
  });

  it('hides modal and resolves input value on pressing Enter', async () => {
    fireEvent.keyDown(document, { key: 'Enter' });
    await expect(promise)
      .resolves
      .toBe(inputValue);
  });

  it('hides modal and resolves null on pressing Esc', async () => {
    fireEvent.keyDown(document, { key: 'Escape' });
    await expect(promise)
      .resolves
      .toBe(null);
  });
});

it('calls onOk on clicking ok button', async () => {
  const onOk = jest.fn();
  await act(async () => {
    await openPrompt('Message', '', {
      onOk
    });
    fireEvent.click(okButton);
  });

  expect(onOk)
    .toBeCalled();
});

it('calls onCancel on clicking cancel button', async () => {
  const onCancel = jest.fn();
  await act(async () => {
    await openPrompt('Message', '', {
      onCancel
    });
    fireEvent.click(cancelButton);
  });

  expect(onCancel)
    .toBeCalled();
});

describe('waits for async onOk', () => {
  beforeAll(async () => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  let promise;
  afterEach(async () => {
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await act(() => promise);
    promise = null;
  });

  async function openAsyncPrompt(options) {
    const asyncOnOk = jest.fn(() => {
      promise = new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      return promise;
    });
    await openPrompt('Message', '', {
      onOk: asyncOnOk,
      ...options
    });
    act(() => {
      fireEvent.click(okButton);
    });
  }

  it('shows loading on ok button', async () => {
    await openAsyncPrompt();
    expect(okButton.classList.contains('rs-btn-loading'))
      .toBe(true);
  });

  it('disables cancel button while promise running', async () => {
    await openAsyncPrompt();
    expect(cancelButton.classList)
      .toContain('rs-btn-disabled');
  });

  it('doesn\'t disable  cancel button if onCancel is provided', async () => {
    await openAsyncPrompt({ onCancel: jest.fn() });
    expect(cancelButton.classList)
      .not
      .toContain('rs-btn-disabled');
  });

  it('doesn\'t disable cancel button if canCancelOnLoading is true', async () => {
    await openAsyncPrompt({ canCancelOnLoading: true });
    expect(cancelButton.classList)
      .not
      .toContain('rs-btn-disabled');
  });

  it('force disable cancel button if canCancelOnLoading is false', async () => {
    await openAsyncPrompt({ onCancel: jest.fn(), canCancelOnLoading: false });
    expect(cancelButton.classList)
      .toContain('rs-btn-disabled');
  });

  it('closes after promise finishes', async () => {
    await openAsyncPrompt();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await waitForElementToBeRemoved(modal);
  });
});

