import * as React from 'react';

export function alert(message?: React.ReactNode): void;

export function confirm(message?: React.ReactNode): Promise<boolean>;

export function prompt(message?: React.ReactNode, _default?: string): Promise<string | null>;
