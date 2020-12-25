import React from 'react';
import {
  render,
  getByText,
  fireEvent,
  waitForElementToBeRemoved,
  act,
  screen,
} from '@testing-library/react';
import InteractionModal from '../src/InteractionModal';

function renderModal(message, props) {
  const { baseElement } = render(
    <InteractionModal {...props}>{message}</InteractionModal>
  );

  const modal = baseElement.querySelector('.rs-modal');
  const cancelButton = screen.queryByRole('button', {
    name: '取消',
  });
  const okButton = screen.queryByRole('button', {
    name: '确定',
  });

  return { modal, cancelButton, okButton };
}

describe('renders modal', () => {
  it('shows modal with message text and buttons', () => {
    const { modal, cancelButton, okButton } = renderModal('Hey');
    expect(modal).toHaveTextContent('Hey');
    expect(okButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('hides cancel button if showCancelButton is false', () => {
    const { cancelButton } = renderModal('Hey', { showCancelButton: false });
    expect(cancelButton).not.toBeInTheDocument();
  });

  it('renders custom button text', () => {
    const okButtonText = 'Okay';
    const cancelButtonText = 'Nah';
    renderModal('Hey', {
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
    expect(onOk).toHaveBeenCalled();
  });

  it('calls onCancel on clicking cancel button', () => {
    const onCancel = jest.fn();
    const { cancelButton } = renderModal('Hey', { onCancel });
    fireEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalled();
  });

  describe('supports keyboard controls', () => {
    it('calls onOk on pressing enter', async () => {
      const onOk = jest.fn();
      renderModal('Hey', { onOk });
      fireEvent.keyDown(document, {
        key: 'Enter',
      });

      expect(onOk).toHaveBeenCalled();
    });

    it('calls onCancel on pressing ESC', async () => {
      const onCancel = jest.fn();
      renderModal('Hey', { onCancel });
      fireEvent.keyDown(document, {
        key: 'Escape',
      });
      expect(onCancel).toHaveBeenCalled();
    });

    it('calls onOk on pressing ESC if showCancelButton is false', async () => {
      const onOk = jest.fn();
      renderModal('Hey', { onOk, showCancelButton: false });
      fireEvent.keyDown(document, {
        key: 'Escape',
      });
      expect(onOk).toHaveBeenCalled();
    });
  });
});

describe('waits for async onOk', () => {
  let promise;
  afterEach(() => {
    promise = null;
  });

  it('shows loading state on ok button', async () => {
    const asyncOnOk = jest.fn(() => (promise = Promise.resolve()));
    const { okButton } = renderModal('Hey', { onOk: asyncOnOk });
    fireEvent.click(okButton);
    expect(okButton.classList).toContain('rs-btn-loading');
    await act(() => promise);
  });

  it('disables cancel button when ok is loading', async () => {
    const asyncOnOk = jest.fn(() => (promise = Promise.resolve()));
    const { okButton, cancelButton } = renderModal('Hey', { onOk: asyncOnOk });
    fireEvent.click(okButton);
    expect(cancelButton).toBeDisabled();
    await act(() => promise);
  });

  it('force-enables cancel button if canCancelOnLoading is true', async () => {
    const asyncOnOk = jest.fn(() => (promise = Promise.resolve()));
    const { okButton, cancelButton } = renderModal('Hey', {
      onOk: asyncOnOk,
      canCancelOnLoading: true,
    });
    fireEvent.click(okButton);
    expect(cancelButton).not.toBeDisabled();
    await act(() => promise);
  });
});
