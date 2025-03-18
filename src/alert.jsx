import React from 'react';
import InteractionModal from './InteractionModal';
import { isFunction } from './utils';
import getRoot from './getRoot';

export default function alert(message, modalConfig) {
  return new Promise((resolve, reject) => {
    getRoot().render(
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
      </InteractionModal>
    );
  });
}
