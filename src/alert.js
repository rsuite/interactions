import React from 'react';
import ReactDOM from 'react-dom';
import InteractionModal from './InteractionModal';
import getContainerDOM from './getContainerDOM';

export default function alert(message, modalConfig) {
  return new Promise(resolve => {
    ReactDOM.render(
      <InteractionModal
        key={Date.now()}
        onOk={resolve}
        showCancelButton={false}
        resolveFn={resolve}
        okResolveValue={undefined}
        {...modalConfig}
      >
        {message}
      </InteractionModal>,
      getContainerDOM()
    );
  });
}
