import React from 'react';
import ReactDOM from 'react-dom';
import InteractionModal from './InteractionModal';
import getContainerDOM from './getContainerDOM';
import { isFunction } from './utils';

export default function alert(message, modalConfig) {
  return new Promise(resolve => {
    ReactDOM.render(
      <InteractionModal
        key={Date.now()}
        showCancelButton={false}
        {...modalConfig}
        onOk={() => {
          if (!isFunction(modalConfig?.onOk)) {
            resolve();
            return;
          }
          const result = modalConfig.onOk();
          if (!(result instanceof Promise)) {
            resolve();
            return;
          }
          result.then(resolved => {
            resolve();
            return resolved;
          });
          return result;
        }}
      >
        {message}
      </InteractionModal>,
      getContainerDOM()
    );
  });
}
