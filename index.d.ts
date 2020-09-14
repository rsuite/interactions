import * as React from 'react';

interface AlertModalProps {
  okButtonText?: string;
}

interface ConfirmModalProps {
  okButtonText?: string;
  cancelButtonText?: string;
}

interface PromoteModalProps {
  okButtonText?: string;
  cancelButtonText?: string;
}

export function alert(
  message?: React.ReactNode,
  modalConfig?: AlertModalProps
): void;

export function confirm(
  message?: React.ReactNode,
  modalConfig?: ConfirmModalProps
): Promise<boolean>;

export function prompt(
  message?: React.ReactNode,
  _default?: string,
  modalConfig?: PromoteModalProps
): Promise<string | null>;
