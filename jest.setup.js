import '@testing-library/jest-dom';

if (process.env.RSUITE_VERSION === '5') {
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

switch (process.env.REACT_VERSION) {
  case '16':
    jest.mock('react', () => {
      return jest.requireActual('react16');
    });

    jest.mock('react-dom', () => {
      return jest.requireActual('react-dom16');
    });
    jest.mock('react-dom/test-utils', () => {
      return jest.requireActual('react-dom16/test-utils');
    });
    break;
  case '17':
    jest.mock('react', () => {
      return jest.requireActual('react17');
    });

    jest.mock('react-dom', () => {
      return jest.requireActual('react-dom17');
    });
    jest.mock('react-dom/test-utils', () => {
      return jest.requireActual('react-dom17/test-utils');
    });
    break;
  default:
    break;
}
