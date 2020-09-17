import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'rsuite';
import { alert, confirm, prompt } from '../src';
import './styles.less';

function App() {
  const buyNewPhone = useCallback(() => {
    alert("Congrats! You've got a new iPhone!", {
      okButtonText: 'Hooray!',
    });
  }, []);

  const confirmSmashPhone = useCallback(async () => {
    if (
      await confirm('Are you sure you what to do this?', {
        okButtonText: 'Yes',
        cancelButtonText: 'No',
      })
    ) {
      alert('Rest in pieces.');
    }
  }, []);

  const promptForName = useCallback(async () => {
    const name = await prompt('What is your name?', '', {
      okButtonText: 'This is my name',
      cancelButtonText: 'I don\'t want to tell you'
    });
    if (name) {
      alert(`It\'s ok, ${name}.`);
    }
  }, []);

  return (
    <div className="page">
      <h1>Interactions</h1>
      <p>Call RSuite Modal at ease.</p>
      <p>
        <a href="https://github.com/rsuite/interactions" target="_blank">
          https://github.com/rsuite/interactions
        </a>
      </p>
      <hr />
      <div className="example">
        {' '}
        <Button onClick={buyNewPhone}>Buy a new iPhone</Button>
        <Button onClick={confirmSmashPhone}>Then smash it!</Button>
        <Button onClick={promptForName}>I'm so sorry.</Button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
