import manager from './InteractionManager';

export const alert = (message, modalConfig) => manager.requestInteraction('alert', message, modalConfig);
export const confirm = (message, modalConfig) => manager.requestInteraction('confirm', message, modalConfig);
export const prompt = (message, _default, modalConfig) => manager.requestInteraction('prompt', message, _default, modalConfig);
