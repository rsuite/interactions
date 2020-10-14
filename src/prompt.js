import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import { Input } from 'rsuite';
import InteractionModal from './InteractionModal';
import getContainerDOM from './getContainerDOM';
import { isFunction } from './utils';

function PromptModal({ message, defaultResult = '', onOk, ...props }) {

  const [result, setResult] = useState(defaultResult);

  const handleOk = useCallback(() => onOk(result), [onOk, result]);

  return (
    <InteractionModal
      {...props}
      onOk={handleOk}
    >
      {message}
      <Input
        autoFocus
        value={result}
        onChange={value => setResult(value)}
        style={{ marginTop: 10 }}
      />
    </InteractionModal>
  );
}

export default function prompt(message, _default, modalConfig) {
  return new Promise(resolve => {
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
          const result = modalConfig.onOk(...args);
          if (!(result instanceof Promise)) {
            resolve(...args);
            return;
          }
          result.then(resolved => {
            resolve(...args);
            return resolved;
          });
          return result;
        }}
        onCancel={isSubmitLoading => {
          modalConfig?.onCancel?.(isSubmitLoading);
          resolve(null);
        }}
      />,
      getContainerDOM()
    );
  });
}
