import React from 'react';
import InteractionModal from './InteractionModal';
import { isFunction } from './utils';
import getRoot from './getRoot';

export default function confirm(
  message,
  { okButtonDangerous = false, ...modalConfig } = {}
) {
  return new Promise((resolve, reject) => {
    getRoot().render(
      <InteractionModal
        key={Date.now()}
        canCancelOnLoading={!!modalConfig?.onCancel}
        {...modalConfig}
        okButtonProps={{
          color: okButtonDangerous ? 'red' : undefined,
        }}
        onOk={() => {
          if (!isFunction(modalConfig?.onOk)) {
            resolve(true);
            return;
          }
          try {
            const result = modalConfig.onOk();
            if (!(result instanceof Promise)) {
              resolve(true);
              return;
            }
            result.then((resolved) => {
              resolve(true);
              return resolved;
            }, reject);
            return result;
          } catch (e) {
            reject(e);
          }
        }}
        onCancel={(isSubmitLoading) => {
          modalConfig?.onCancel?.(isSubmitLoading);
          resolve(false);
        }}
      >
        {message}
      </InteractionModal>
    );
  });
}
