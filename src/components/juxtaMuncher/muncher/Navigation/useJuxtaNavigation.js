import { useState } from "react";

// State shared between JuxtaNavigation (e.g. in an app bar) and the editor
export default function useJuxtaNavigation() {
  const [currentBookCode, setCurrentBookCode] = useState(null);
  const [curIndex, setCurIndex] = useState(0);
  const [sentences, setSentences] = useState([]);

  return {
    currentBookCode,
    setCurrentBookCode,
    curIndex,
    setCurIndex,
    sentences,
    setSentences,
  };
}
