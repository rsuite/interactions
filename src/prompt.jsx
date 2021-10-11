import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import { Input } from 'rsuite';
import InteractionModal from './InteractionModal';
import getContainerDOM from './getContainerDOM';
import { isFunction } from './utils';

function PromptModal({
  message,
  defaultResult = '',
  onOk,
  inputProps,
  style,
  ...props
}) {
  const { onChange: onInputChange, style: inputStyle, ...restInputProps } =
    inputProps || {};
  const [result, setResult] = useState(defaultResult);

  const handleOk = useCallback(() => onOk(result), [onOk, result]);

  return (
    <InteractionModal {...props} onOk={handleOk}>
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
    ReactDOM.render(
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
      />,
      getContainerDOM()
    );
  });
}
