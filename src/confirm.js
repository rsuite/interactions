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
        {...modalConfig}
        onOk={async () => {
          let result;
          if (modalConfig && isFunction(modalConfig.onOk)) {
            result = await modalConfig.onOk();
          }
          resolve(true);

          return result;
        }}
        onCancel={async isSubmitLoading => {
          if (modalConfig && isFunction(modalConfig.onCancel)) {
            await modalConfig.onCancel(isSubmitLoading);
          }
          resolve(false);
        }}
      >
        {message}
      </InteractionModal>,
      getContainerDOM()
    );
  });
}
