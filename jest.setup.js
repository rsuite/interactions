import '@testing-library/jest-dom';

if (process.env.RSUITE === '5') {
  jest.mock(
    'date-fns/_lib/toInteger/index.js',
    () => {
      return jest.requireActual('date-fns2/_lib/toInteger/index.js');
    },
    { virtual: true }
  );

  jest.mock(
    'date-fns/_lib/cloneObject',
    () => {
      return jest.requireActual('date-fns2/_lib/cloneObject');
    },
    { virtual: true }
  );

  jest.mock('rsuite', () => {
    return jest.requireActual('rsuite5');
  });
} else {
  jest.mock('rsuite', () => {
    return jest.requireActual('rsuite4');
  });
}
