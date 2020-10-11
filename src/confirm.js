import React from 'react';
import ReactDOM from 'react-dom';
import InteractionModal from './InteractionModal';
import getContainerDOM from './getContainerDOM';
import { isFunction } from './utils';

export default function confirm(message, modalConfig) {
  return new Promise(resolve => {
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
          result.then(resolved => {
            resolve(true);
            return resolved;
          });
          return result;
        }}
        onCancel={isSubmitLoading => {
          if (!isFunction(modalConfig?.onCancel)) {
            resolve(false);
            return;
          }
          const result = modalConfig.onCancel(isSubmitLoading);
          if (!(result instanceof Promise)) {
            resolve(false);
            return;
          }
          result.then(resolved => {
            resolve(false);
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
