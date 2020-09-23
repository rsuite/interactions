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
        onOk={async () => {
          let result;
          if (modalConfig && isFunction(modalConfig.onOk)) {
            result = await modalConfig.onOk();
          }
          resolve();

          return result;
        }}
      >
        {message}
      </InteractionModal>,
      getContainerDOM()
    );
  });
}
