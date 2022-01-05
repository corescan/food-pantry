import { useEffect, useState } from 'react';

function includes(elements, id) {
  for (let _i in elements) {
    if (elements[_i].id === id) return true;
  }
}

export default function useDocumentClicked(excludeElementID) {
  const [docClicked, setDocClicked] = useState(false);

  function downHandler(ev) {
    if (includes(ev.path, excludeElementID)) return;
    setDocClicked(true);
  }

  function upHandler() {
    setDocClicked(false);
  }

  useEffect(() => {
    document.addEventListener("mousedown", downHandler);
    document.addEventListener("mouseup", upHandler);

    return () => {
      document.removeEventListener("mousedown", downHandler);
      document.removeEventListener("mouseup", upHandler);

    };
  });

  return docClicked;
};