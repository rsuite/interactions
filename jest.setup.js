import '@testing-library/jest-dom';

if (process.env.REACT_VERSION === '18') {
  jest.mock('react', () => {
    return jest.requireActual('react18');
  });

  jest.mock('react-dom', () => {
    return jest.requireActual('react-dom18');
  });
  jest.mock('react-dom/test-utils', () => {
    return jest.requireActual('react-dom18/test-utils');
  });
}
