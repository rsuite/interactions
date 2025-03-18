import React, { useCallback, useState, useMemo } from 'react';
import { Input } from 'rsuite';
import InteractionModal from './InteractionModal';
import { isFunction } from './utils';
import getRoot from './getRoot';

function PromptModal({
  message,
  defaultResult = '',
  okButtonDangerous = false,
  onOk,
  validate,
  inputProps,
  style,
  ...props
}) {
  const {
    onChange: onInputChange,
    style: inputStyle,
    ...restInputProps
  } = inputProps || {};
  const [result, setResult] = useState(defaultResult);

  const handleOk = useCallback(() => onOk(result), [onOk, result]);

  const okButtonDisabled = useMemo(() => {
    return validate?.(result) === false;
  }, [result, validate]);

  const okButtonColor = okButtonDangerous ? 'red' : undefined;

  return (
    <InteractionModal
      {...props}
      okButtonProps={{
        color: okButtonColor,
        disabled: okButtonDisabled,
      }}
      onOk={handleOk}
    >
      <div style={{ padding: '5px' }} className="modal-content">
        {message}
        <Input
          autoFocus
          value={result}
          onChange={(value) => {
            setResult(value);
            onInputChange?.(value);
          }}
          style={{ marginTop: 10, ...inputStyle }}
          {...restInputProps}
        />
      </div>
    </InteractionModal>
  );
}

export default function prompt(message, _default, modalConfig) {
  return new Promise((resolve, reject) => {
    getRoot().render(
      <PromptModal
        key={Date.now()}
        message={message}
        defaultResult={_default}
        canCancelOnLoading={!!modalConfig?.onCancel}
        {...modalConfig}
        onOk={(...args) => {
          if (!isFunction(modalConfig?.onOk)) {
            resolve(...args);
            return;
          }
          try {
            const result = modalConfig.onOk(...args);
            if (!(result instanceof Promise)) {
              resolve(...args);
              return;
            }
            result.then((resolved) => {
              resolve(...args);
              return resolved;
            }, reject);
            return result;
          } catch (e) {
            reject(e);
          }
        }}
        onCancel={(isSubmitLoading) => {
          modalConfig?.onCancel?.(isSubmitLoading);
          resolve(null);
        }}
      />
    );
  });
}
