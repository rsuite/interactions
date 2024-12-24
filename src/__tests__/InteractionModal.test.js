import React from 'react';
import {
  render,
  within,
  fireEvent,
  waitForElementToBeRemoved,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InteractionModal from '../InteractionModal';

it('shows an alert dialog with message text and buttons', () => {
  const message = 'Hey';
  const { getByRole } = render(<InteractionModal>{message}</InteractionModal>);

  const dialog = getByRole('alertdialog');
  expect(dialog).toBeVisible();
  expect(dialog).toHaveTextContent(message);

  expect(
    within(dialog).getByRole('button', {
      name: '取消',
    })
  ).toBeInTheDocument();
  expect(
    within(dialog).getByRole('button', {
      name: '确定',
    })
  ).toBeInTheDocument();
});

it('hides cancel button given `showCancelButton=false`', () => {
  const { queryByRole } = render(
    <InteractionModal showCancelButton={false}></InteractionModal>
  );

  expect(
    queryByRole('button', {
      name: '取消',
    })
  ).not.toBeInTheDocument();
});

it('renders custom button text', () => {
  const okButtonText = 'Okay';
  const cancelButtonText = 'Nah';

  const { getByRole } = render(
    <InteractionModal
      okButtonText={okButtonText}
      cancelButtonText={cancelButtonText}
    ></InteractionModal>
  );

  expect(getByRole('button', { name: cancelButtonText })).toBeInTheDocument();
  expect(getByRole('button', { name: okButtonText })).toBeInTheDocument();
});

it('accepts custom props on ok button via okButtonProps prop', () => {
  const { getByRole } = render(
    <InteractionModal okButtonProps={{ color: 'red', disabled: true }}>
      Hey
    </InteractionModal>
  );

  expect(
    within(getByRole('alertdialog')).getByRole('button', {
      name: '确定',
    })
  ).toBeDisabled();
  expect(
    within(getByRole('alertdialog')).getByRole('button', {
      name: '确定',
    })
  ).toHaveClass('rs-btn-red');
});

it('hides dialog on clicking ok button', async () => {
  const { getByRole } = render(<InteractionModal></InteractionModal>);

  userEvent.click(getByRole('button', { name: '确定' }));
  await waitForElementToBeRemoved(getByRole('alertdialog'));
});

it('hides dialog on clicking cancel button', async () => {
  const { getByRole } = render(<InteractionModal></InteractionModal>);

  userEvent.click(getByRole('button', { name: '取消' }));
  await waitForElementToBeRemoved(getByRole('alertdialog'));
});

it('calls onOk on clicking ok button', () => {
  const onOk = jest.fn();
  const { getByRole } = render(
    <InteractionModal onOk={onOk}></InteractionModal>
  );

  userEvent.click(getByRole('button', { name: '确定' }));
  expect(onOk).toHaveBeenCalled();
});

it('calls onCancel on clicking cancel button', () => {
  const onCancel = jest.fn();
  const { getByRole } = render(
    <InteractionModal onCancel={onCancel}></InteractionModal>
  );

  userEvent.click(getByRole('button', { name: '取消' }));
  expect(onCancel).toHaveBeenCalled();
});

it('forwards modalProps to modal', () => {
  const { getByRole } = render(
    <InteractionModal modalProps={{ role: 'article' }}></InteractionModal>
  );

  expect(getByRole('article')).toBeInTheDocument();
});

describe('supports keyboard controls', () => {
  it('calls onOk on pressing enter', async () => {
    const onOk = jest.fn();
    render(<InteractionModal onOk={onOk}></InteractionModal>);
    fireEvent.keyDown(document, {
      key: 'Enter',
    });

    expect(onOk).toHaveBeenCalled();
  });

  it('calls onCancel on pressing ESC', async () => {
    const onCancel = jest.fn();
    render(<InteractionModal onCancel={onCancel}></InteractionModal>);
    fireEvent.keyDown(document, {
      key: 'Escape',
    });
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onOk on pressing ESC if showCancelButton is false', async () => {
    const onOk = jest.fn();
    render(
      <InteractionModal onOk={onOk} showCancelButton={false}></InteractionModal>
    );
    fireEvent.keyDown(document, {
      key: 'Escape',
    });
    expect(onOk).toHaveBeenCalled();
  });
});

describe('waits for async onOk', () => {
  let promise;
  afterEach(() => {
    promise = null;
  });

  it('shows loading state on ok button', async () => {
    const asyncOnOk = jest.fn(() => (promise = Promise.resolve()));

    const { getByRole } = render(
      <InteractionModal onOk={asyncOnOk}></InteractionModal>
    );

    const okButton = getByRole('button', { name: '确定' });
    userEvent.click(okButton);
    expect(okButton).toHaveClass('rs-btn-loading');

    await act(() => promise);
  });

  it('disables cancel button when ok is loading', async () => {
    const asyncOnOk = jest.fn(() => (promise = Promise.resolve()));
    const { getByRole } = render(
      <InteractionModal onOk={asyncOnOk}></InteractionModal>
    );

    userEvent.click(getByRole('button', { name: '确定' }));
    expect(getByRole('button', { name: '取消' })).toBeDisabled();
    await act(() => promise);
  });

  it('force-enables cancel button if canCancelOnLoading is true', async () => {
    const asyncOnOk = jest.fn(() => (promise = Promise.resolve()));
    const { getByRole } = render(
      <InteractionModal onOk={asyncOnOk} canCancelOnLoading></InteractionModal>
    );

    userEvent.click(getByRole('button', { name: '确定' }));
    expect(getByRole('button', { name: '取消' })).not.toBeDisabled();
    await act(() => promise);
  });
});
