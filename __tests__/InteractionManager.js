import manager from '../src/InteractionManager';

it('should throw if invalid methods are requested', async () => {
  const dialog = jest.fn(async () => await manager.requestInteraction('dialog'));
  expect(dialog())
    .rejects
    .toThrow();
});
