import { createRoot } from 'react-dom/client';

let root = null;

export default function getRoot() {
  if (!root) {
    const dom = document.createElement('div');
    document.body.appendChild(dom);

    root = createRoot(dom);
  }

  return root;
}
