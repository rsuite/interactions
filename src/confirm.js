import React from 'react';
import ReactDOM from 'react-dom';
import InteractionModal from './InteractionModal';
import getContainerDOM from './getContainerDOM';

export default function confirm(message) {
  return new Promise(resolve => {
    ReactDOM.render(
      <InteractionModal
        key={Date.now()}
        onOk={() => resolve(true)}
        onCancel={() => resolve(false)}
      >
        {message}
      </InteractionModal>,
      getContainerDOM()
    );
  });
}
