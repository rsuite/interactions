import * as React from 'react';
import type { InputProps, ModalProps } from 'rsuite';

interface WrappedModalProps {
  modalProps?: ModalProps;
}

interface AlertModalProps extends WrappedModalProps {
  okButtonText?: string;
  onOk?: (() => void) | (() => Promise<any>);
}

interface ConfirmModalProps extends WrappedModalProps {
  okButtonText?: string;
  okButtonDangerous?: boolean;
  cancelButtonText?: string;
  onOk?: (() => void) | (() => Promise<any>);
  onCancel?: (isSubmitLoading?: boolean) => any;
  canCancelOnLoading?: boolean;
  title?: React.ReactNode;
}

interface PromptModalProps extends WrappedModalProps {
  okButtonText?: string;
  okButtonDangerous?: boolean;
  cancelButtonText?: string;
  validate?: (inputValue: string) => boolean;
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
