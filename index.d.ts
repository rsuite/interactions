import * as React from 'react';

interface InteractionModalProps {
  okButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
}

export function alert(
  message?: React.ReactNode,
  modalConfig?: InteractionModalProps
): void;

export function confirm(
  message?: React.ReactNode,
  modalConfig?: InteractionModalProps
): Promise<boolean>;

export function prompt(
  message?: React.ReactNode,
  _default?: string,
  modalConfig?: InteractionModalProps
): Promise<string | null>;
