import React from 'react';
import ReactDOM from 'react-dom';
import InteractionModal from './InteractionModal';
import getContainerDOM from './getContainerDOM';

export default function confirm(message, modalConfig) {
  return new Promise(resolve => {
    ReactDOM.render(
      <InteractionModal
        key={Date.now()}
        onOk={() => resolve(true)}
        onCancel={() => resolve(false)}
        resolveFn={resolve}
        {...modalConfig}
      >
        {message}
      </InteractionModal>,
      getContainerDOM()
    );
  });
}
