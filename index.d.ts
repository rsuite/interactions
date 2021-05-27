import * as React from 'react';
import { InputProps } from 'rsuite/lib/Input';

interface AlertModalProps {
  okButtonText?: string;
  onOk?: (() => void) | (() => Promise<any>);
}

interface ConfirmModalProps {
  okButtonText?: string;
  cancelButtonText?: string;
  onOk?: (() => void) | (() => Promise<any>);
  onCancel?: (isSubmitLoading?: boolean) => any;
  canCancelOnLoading?: boolean;
}

interface PromptModalProps {
  okButtonText?: string;
  cancelButtonText?: string;
  onOk?: ((inputVal?: string) => void) | ((inputVal: string) => Promise<any>);
  onCancel?: (isSubmitLoading?: boolean) => any;
  canCancelOnLoading?: boolean;
  inputProps?: InputProps;
}

export function alert(
  message?: React.ReactNode,
  modalConfig?: AlertModalProps
): Promise<void>;

export function confirm(
  message?: React.ReactNode,
  modalConfig?: ConfirmModalProps
): Promise<boolean>;

export function prompt(
  message?: React.ReactNode,
  _default?: string,
  modalConfig?: PromptModalProps
): Promise<string | null>;
