import React from 'react';
import ReactDOM from 'react-dom';
import InteractionModal from './InteractionModal';
import getContainerDOM from './getContainerDOM';

export default function alert(message) {
  return new Promise(resolve => {
    ReactDOM.render(
      <InteractionModal
        key={Date.now()}
        onOk={resolve}
        showCancelButton={false}
      >
        {message}
      </InteractionModal>,
      getContainerDOM()
    );
  });
}
