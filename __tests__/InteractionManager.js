import manager from '../src/InteractionManager';
import { screen, fireEvent } from '@testing-library/react';

it('should throw if invalid methods are requested', async () => {
  const dialog = jest.fn(
    async () => await manager.requestInteraction('dialog')
  );
  expect(dialog()).rejects.toThrow();
});

it('Queues multiple interaction requests', async () => {
  manager.requestInteraction('alert', 'Message 1');
  manager.requestInteraction('alert', 'Message 2');

  const modal2 = screen.queryByText('Message 2', {
    selector: '.rs-modal-body',
  });
  expect(modal2).not.toBeInTheDocument();

  const okButton = (
    await screen.findByText('Message 1', {
      selector: '.rs-modal-body',
    })
  )
    .closest('.rs-modal')
    .querySelector('.rs-btn-primary');
  fireEvent.click(okButton);
  await screen.findByText('Message 2', {
    selector: '.rs-modal-body',
  });
});
