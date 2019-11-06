export function alert(message?: string): void;

export function confirm(message?: string): Promise<boolean>;

export function prompt(message?: string, _default?: string): Promise<string | null>;
