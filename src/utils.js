/**
 * https://stackoverflow.com/a/7356528/8106429
 */
export function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
}
