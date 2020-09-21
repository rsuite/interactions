import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import { Input } from 'rsuite';
import InteractionModal from './InteractionModal';
import getContainerDOM from './getContainerDOM';

function PromptModal({ message, defaultResult = '', onOk, ...props }) {

  const [result, setResult] = useState(defaultResult);

  const handleOk = useCallback(() => onOk(result), [onOk, result]);

  return (
    <InteractionModal
      {...props}
      onOk={handleOk}
      okResolveValue={result}
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
        onOk={resolve}
        onCancel={() => resolve(null)}
        resolveFn={resolve}
        {...modalConfig}
      />,
      getContainerDOM()
    );
  });
}
