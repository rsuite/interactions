import React from 'react';
import ReactDOM from 'react-dom';
import InteractionModal from './InteractionModal';
import getContainerDOM from './getContainerDOM';
import { isFunction } from './utils';

export default function alert(message, modalConfig) {
  return new Promise((resolve, reject) => {
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
          try {
            const result = modalConfig.onOk();
            if (!(result instanceof Promise)) {
              resolve();
              return;
            }
            result.then((resolved) => {
              resolve();
              return resolved;
            }, reject);
            return result;
          } catch (e) {
            reject(e);
          }
        }}
      >
        {message}
      </InteractionModal>,
      getContainerDOM()
    );
  });
}
