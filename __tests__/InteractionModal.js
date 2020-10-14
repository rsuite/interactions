import React from 'react';
import {
  render,
  getByText,
  fireEvent,
  waitForElementToBeRemoved,
  act
} from '@testing-library/react';
import InteractionModal from '../src/InteractionModal';

function renderModal(message, props) {
  const { baseElement } = render(<InteractionModal {...props}>{message}</InteractionModal>);

  const modal = baseElement.querySelector('.rs-modal');
  const okButton = modal.querySelector('.rs-btn-primary');
  const cancelButton = modal.querySelector('.rs-btn-default');
  return { modal, okButton, cancelButton };
}

describe('renders modal', () => {

  it('shows modal with message text and buttons', () => {
    const { modal, okButton, cancelButton } = renderModal('Hey');
    expect(getByText(modal, 'Hey'))
      .not
      .toBeNull();
    expect(okButton)
      .not
      .toBeNull();
    expect(cancelButton)
      .not
      .toBeNull();
  });

  it('hides cancel button if showCancelButton is false', () => {
    const { cancelButton } = renderModal('Hey', { showCancelButton: false });
    expect(cancelButton)
      .toBeNull();
  });

  it('renders custom button text', () => {
    const okButtonText = 'Okay';
    const cancelButtonText = 'Nah';
    const { okButton, cancelButton } = renderModal('Hey', { okButtonText, cancelButtonText });
    expect(okButton.textContent)
      .toBe(okButtonText);
    expect(cancelButton.textContent)
      .toBe(cancelButtonText);
  });

  it('hides modal on clicking ok button', async () => {
    const { modal, okButton } = renderModal('Hey');
    fireEvent.click(okButton);
    await waitForElementToBeRemoved(modal);
  });

  it('hides modal on clicking cancel button', async () => {
    const { modal, cancelButton } = renderModal('Hey');
    fireEvent.click(cancelButton);
    await waitForElementToBeRemoved(modal);
  });
});

describe('triggers callbacks', () => {
  it('calls onOk on clicking ok button', () => {
    const onOk = jest.fn();
    const { okButton } = renderModal('Hey', { onOk });
    fireEvent.click(okButton);
    expect(onOk)
      .toBeCalled();
  });

  it('calls onCancel on clicking cancel button', () => {
    const onCancel = jest.fn();
    const { cancelButton } = renderModal('Hey', { onCancel });
    fireEvent.click(cancelButton);
    expect(onCancel)
      .toBeCalled();
  });

  describe('supports keyboard controls', () => {

    it('calls onOk on pressing enter', async () => { const onOk = jest.fn();
      renderModal('Hey', { onOk });
      fireEvent.keyDown(document, {
        key: 'Enter'
      })

      expect(onOk)
        .toBeCalled();
    });

    it('calls onCancel on pressing ESC', async () => {
      const onCancel = jest.fn();
      renderModal('Hey', { onCancel });
      fireEvent.keyDown(document, {
        key: 'Escape'
      })
      expect(onCancel)
        .toBeCalled();
    });

    it ('calls onOk on pressing ESC if showCancelButton is false', async () => {
      const onOk = jest.fn();
      renderModal('Hey', { onOk, showCancelButton: false });
      fireEvent.keyDown(document, {
        key: 'Escape'
      })
      expect(onOk)
        .toBeCalled();
    })
  })
});

describe('waits for async onOk', () => {

  let promise;
  afterEach(() => {
    promise = null;
  });

  it('shows loading state on ok button', async () => {
    const asyncOnOk = jest.fn(() => promise = Promise.resolve());
    const { okButton } = renderModal('Hey', { onOk: asyncOnOk });
    fireEvent.click(okButton);
    expect(okButton.classList)
      .toContain('rs-btn-loading');
    await act(() => promise);
  });

  it('disables cancel button when ok is loading', async () => {
    const asyncOnOk = jest.fn(() => promise = Promise.resolve());
    const { okButton, cancelButton } = renderModal('Hey', { onOk: asyncOnOk });
    fireEvent.click(okButton);
    expect(cancelButton.classList)
      .toContain('rs-btn-disabled');
    await act(() => promise);
  });

  it('force-enables cancel button if canCancelOnLoading is true', async () => {
    const asyncOnOk = jest.fn(() => promise = Promise.resolve());
    const { okButton, cancelButton } = renderModal('Hey', {
      onOk: asyncOnOk,
      canCancelOnLoading: true
    });
    fireEvent.click(okButton);
    expect(cancelButton.classList)
      .not.toContain('rs-btn-disabled');
    await act(() => promise);
  });

});
