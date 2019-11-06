import manager from './InteractionManager';

export const alert = message => manager.requestInteraction('alert', message);
export const confirm = message => manager.requestInteraction('confirm', message);
export const prompt = (message, _default) => manager.requestInteraction('prompt', message, _default);
