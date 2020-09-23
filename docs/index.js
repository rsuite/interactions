import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Button, ButtonToolbar } from 'rsuite';
import { alert, confirm, prompt } from '../src';
import './styles.less';

const getNTimeout = (n = 2000, result = true) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (result) {
        resolve();
      } else {
        reject();
      }
    }, n);
  });

function App() {
  const buyNewPhone = useCallback(() => {
    alert('Congrats! You\'ve got a new iPhone!', {
      okButtonText: 'Hooray!'
    });
  }, []);

  const buyNewPhoneOk = useCallback(() => {
    alert('Congrats! You\'ve got a new iPhone!', {
      okButtonText: 'Hooray!',
      onOk: () => {
        alert('You clicked Hooray!');
      }
    });
  }, []);

  const buyNewPhoneAsync = useCallback(() => {
    alert('Queue for 2s to get a new iPhone', {
      okButtonText: 'Stand in line',
      onOk: () =>
        getNTimeout(2000).then(() => {
          alert('Congrats! You\'ve got a new iPhone!');
        })
    });
  }, []);

  const confirmSmashPhone = useCallback(async () => {
    if (
      await confirm('Are you sure you want to do this?', {
        okButtonText: 'Yes',
        cancelButtonText: 'No'
      })
    ) {
      alert('Rest in pieces.');
    }
  }, []);

  const confirmSmashPhoneOk = useCallback(async () => {
    if (
      await confirm('Are you sure you want to do this?', {
        okButtonText: 'Yes',
        cancelButtonText: 'No',
        onOk: () => {
          alert('You just clicked Yes');
        }
      })
    ) {
      alert('Rest in pieces.');
    }
  }, []);

  const confirmSmashPhoneAsync = useCallback(async () => {
    if (
      await confirm('Are you sure you want to do this?', {
        okButtonText: 'Yes',
        cancelButtonText: 'No',
        onOk: () =>
          getNTimeout().then(() => {
            alert('Rest in pieces.');
          }),
        canCancelOnLoading: true,
      })
    ) {
      alert('Life is Simple! You make choices and you don\'t look back');
    }
  }, []);

  const confirmSmashPhoneCancelAsync = useCallback(async () => {
    if (
      await confirm('Are you sure you want to do this?', {
        okButtonText: 'Yes',
        cancelButtonText: 'No',
        onOk: () =>
          getNTimeout().then(() => {
            alert('Rest in pieces.');
          }),
        canCancelOnLoading: true,
        onCancel: isSubmitLoading => {
          // will resolve false when click onCancel
          if (isSubmitLoading) {
            alert('is submitLoading');
            // do something to cancel that promise
          } else {
            alert('is not submitLoading');
          }
        },
      })
    ) {
      alert('Life is Simple! You make choices and you don\'t look back');
    }
  }, []);

  const promptForName = useCallback(async () => {
    const name = await prompt('What is your name?', '', {
      okButtonText: 'This is my name',
      cancelButtonText: 'I don\'t want to tell you'
    });
    if (name) {
      alert(`It's ok, ${name}.`);
    }
  }, []);

  const promptForNameOk = useCallback(async () => {
    const name = await prompt('What is your name?', '', {
      okButtonText: 'This is my name',
      cancelButtonText: 'I don\'t want to tell you',
      onOk: inputVal => {
        if (inputVal) {
          alert(`You've confirmed your name, ${inputVal}`);
        }
      }
    });
    if (name) {
      alert(`It's ok, ${name}.`);
    }
  }, []);

  const promptForNameAsync = useCallback(async () => {
    const name = await prompt('What is your name?', '', {
      okButtonText: 'This is my name',
      cancelButtonText: 'I don\'t want to tell you',
      // eslint-disable-next-line consistent-return
      onOk: nameInput => {
        if (nameInput) {
          return getNTimeout(2000, false)
            .then(() => {
              alert(`Hi, ${nameInput}, Don't say Sorry, say GoodBye`);
            })
            .catch(() => {
              alert(`Hi, ${nameInput}, System Error, pls contact administrator`);
            });
        }
      }
    });
    if (name) {
      alert(`Thanks for your collaboration, ${name}`);
    }
  }, []);

  return (
    <div className="page">
      <h1>Interactions</h1>
      <p>Call RSuite Modal at ease.</p>
      <p>
        <a href="https://github.com/rsuite/interactions" target="_blank" rel="noopener noreferrer">
          https://github.com/rsuite/interactions
        </a>
      </p>
      <hr />
      <div className="example">
        {'Simple Usage'}
        <br />
        <ButtonToolbar>
          <Button onClick={buyNewPhone}>Buy a new iPhone</Button>
          <Button onClick={confirmSmashPhone}>Then smash it!</Button>
          <Button onClick={promptForName}>{'I\'m so sorry.'}</Button>
        </ButtonToolbar>
      </div>
      <hr />
      <div className="example">
        {'onOk: normal function'}
        <br />
        <ButtonToolbar>
          <Button onClick={buyNewPhoneOk}>Buy a new iPhone</Button>
          <Button onClick={confirmSmashPhoneOk}>Then smash it!</Button>
          <Button onClick={promptForNameOk}>{'I\'m so sorry.'}</Button>
        </ButtonToolbar>
      </div>
      <hr />
      <div className="example">
        {'onOk: Promise Chain'}
        <br />
        <ButtonToolbar>
          <Button onClick={buyNewPhoneAsync}>Buy a new iPhone</Button>
          <Button onClick={confirmSmashPhoneAsync}>Then smash it!</Button>
          <Button onClick={promptForNameAsync}>{'I\'m so sorry.'}</Button>
        </ButtonToolbar>
      </div>
      <hr />
      <div className="example">
        {'onOk: Promise Chain; then onCancel'}
        <br />
        <ButtonToolbar>
          <Button onClick={confirmSmashPhoneCancelAsync}>Then smash it!</Button>
        </ButtonToolbar>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
