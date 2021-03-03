import {
  screen,
  waitForElementToBeRemoved,
  fireEvent,
  findByText,
  act,
} from '@testing-library/react';
import { confirm } from '../src';

let modal;
let okButton;
let cancelButton;

async function openConfirm(message, options) {
  await closeConfirm();
  confirm(message, options);
  modal = (await screen.findByText(message)).closest('.rs-modal');
  okButton = modal.querySelector('.rs-btn-primary');
  cancelButton = modal.querySelector('.rs-btn-default');
}

async function closeConfirm() {
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
  await openConfirm('Message');
  const alertModal = await findByText(modal, 'Message');
  expect(alertModal).not.toBeNull();
  expect(okButton).not.toBeNull();
  expect(cancelButton).not.toBeNull();
});

it('renders custom button text', async () => {
  const okButtonText = 'Okay';
  const cancelButtonText = 'Nah';
  await openConfirm('Message', {
    okButtonText,
    cancelButtonText,
  });

  expect(okButton.textContent).toBe(okButtonText);
  expect(cancelButton.textContent).toBe(cancelButtonText);
});

describe('resolves correctly', () => {
  let promise;

  beforeEach(async () => {
    promise = confirm('Message');
    modal = (await screen.findByText('Message')).closest('.rs-modal');
    okButton = modal.querySelector('.rs-btn-primary');
    cancelButton = modal.querySelector('.rs-btn-default');
  });

  it('hides modal and resolves true on clicking ok button', async () => {
    fireEvent.click(okButton);

    await expect(promise).resolves.toBe(true);
  });

  it('hides modal and resolves false on clicking cancel button', async () => {
    fireEvent.click(cancelButton);

    await expect(promise).resolves.toBe(false);
  });

  it('hides modal and resolves true on pressing Enter', async () => {
    fireEvent.keyDown(document, { key: 'Enter' });
    await expect(promise).resolves.toBe(true);
  });

  it('hides modal and false true on pressing Esc', async () => {
    fireEvent.keyDown(document, { key: 'Escape' });
    await expect(promise).resolves.toBe(false);
  });
});

describe('triggers callbacks', () => {
  it('calls onOk on clicking ok button', async () => {
    const onOk = jest.fn();
    await openConfirm('Message', {
      onOk,
    });
    fireEvent.click(okButton);
    expect(onOk).toBeCalled();
  });

  it('calls onCancel on clicking cancel button', async () => {
    const onCancel = jest.fn();
    await openConfirm('Message', {
      onCancel,
    });
    fireEvent.click(cancelButton);

    expect(onCancel).toBeCalled();
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

    async function openAsyncConfirm(options) {
      const asyncOnOk = jest.fn(() => {
        promise = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
        return promise;
      });
      await openConfirm('Message', {
        onOk: asyncOnOk,
        ...options,
      });
      act(() => {
        fireEvent.click(okButton);
      });
    }

    it('shows loading on ok button', async () => {
      await openAsyncConfirm();
      expect(okButton.classList.contains('rs-btn-loading')).toBe(true);
    });

    it('disables cancel button while promise running', async () => {
      await openAsyncConfirm();
      expect(cancelButton.classList).toContain('rs-btn-disabled');
    });

    it("doesn't disable  cancel button if onCancel is provided", async () => {
      await openAsyncConfirm({ onCancel: jest.fn() });
      expect(cancelButton.classList).not.toContain('rs-btn-disabled');
    });

    it("doesn't disable cancel button if canCancelOnLoading is true", async () => {
      await openAsyncConfirm({ canCancelOnLoading: true });
      expect(cancelButton.classList).not.toContain('rs-btn-disabled');
    });

    it('force disable cancel button if canCancelOnLoading is false', async () => {
      await openAsyncConfirm({
        onCancel: jest.fn(),
        canCancelOnLoading: false,
      });
      expect(cancelButton.classList).toContain('rs-btn-disabled');
    });

    it('closes after promise finishes', async () => {
      await openAsyncConfirm();
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      await waitForElementToBeRemoved(modal);
    });
  });
});
