import React from 'react';
import ReactDOM from 'react-dom';
import InteractionModal from './InteractionModal';
import getContainerDOM from './getContainerDOM';
import { isFunction } from './utils';

export default function confirm(message, modalConfig) {
  return new Promise((resolve) => {
    ReactDOM.render(
      <InteractionModal
        key={Date.now()}
        canCancelOnLoading={!!modalConfig?.onCancel}
        {...modalConfig}
        onOk={() => {
          if (!isFunction(modalConfig?.onOk)) {
            resolve(true);
            return;
          }
          const result = modalConfig.onOk();
          if (!(result instanceof Promise)) {
            resolve(true);
            return;
          }
          result.then((resolved) => {
            resolve(true);
            return resolved;
          });
          return result;
        }}
        onCancel={(isSubmitLoading) => {
          modalConfig?.onCancel?.(isSubmitLoading);
          resolve(false);
        }}
      >
        {message}
      </InteractionModal>,
      getContainerDOM()
    );
  });
}
