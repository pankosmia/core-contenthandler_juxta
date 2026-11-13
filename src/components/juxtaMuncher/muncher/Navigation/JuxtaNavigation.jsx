import { useEffect } from "react";
import { Box } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { getJson, postEmpty } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import BookPicker from "./BookPicker";
import JuxtaSentencesNav from "./JuxtaSentencesNav";
import { getFirstChapterJuxta } from "../utils/getFirstChapterJuxta";

export default function JuxtaNavigation({
  metadata,
  modified,
  currentBookCode,
  setCurrentBookCode,
  curIndex,
  setCurIndex,
  sentences,
  bcvRef,
  debugRef,
  i18nRef,
  currentProjectRef,
}) {
  const onPrevHandler = () => {
    if (curIndex > 0) {
      setCurIndex(curIndex - 1);
    }
  };

  const onNextHandler = () => {
    if (curIndex < sentences.length - 1) {
      setCurIndex(curIndex + 1);
    }
  };

  const indexChangeHandler = (e) => {
    const index = parseInt(e.target.value);
    if (index > 0 && index <= sentences.length) {
      setCurIndex(index - 1);
    }
  };

  const firstSource = () => {
    if (
      !sentences.length ||
      !sentences[curIndex].chunks[0]?.source.length ||
      sentences[curIndex].chunks[0]?.source[0] === null
    ) {
      return null;
    }
    return sentences[curIndex].chunks[0]?.source[0];
  };

  const lastSource = () => {
    if (
      !sentences.length ||
      !sentences[curIndex].chunks.slice(-1)[0]?.source.length ||
      sentences[curIndex].chunks.slice(-1)[0]?.source[0] === null
    ) {
      return null;
    }
    return sentences[curIndex].chunks.slice(-1)[0]?.source.slice(-1)[0];
  };

  const currentChapter = () => firstSource()?.cv.split(":")[0] ?? 0;
  const startVerse = () => firstSource()?.cv.split(":")[1] ?? 0;
  const endVerse = () => lastSource()?.cv.split(":")[1] ?? 0;

  // Keep the global bcv in sync with the current sentence
  useEffect(() => {
    if (currentBookCode) {
      postEmpty(
        `/api/navigation/bcv/${currentBookCode}/${currentChapter()}/${startVerse()}`,
        debugRef.current,
      );
    }
  }, [curIndex]);

  // Load the new book when the bcv book code changes
  useEffect(() => {
    const doChapterNumbers = async () => {
      if (
        bcvRef.current?.bookCode &&
        bcvRef.current.bookCode !== currentBookCode
      ) {
        let jsonResponse = await getJson(
          `/api/burrito/ingredient/raw/${metadata.local_path}?ipath=${bcvRef.current.bookCode}.json`,
          debugRef.current,
        );
        if (jsonResponse.ok) {
          setCurrentBookCode(bcvRef.current.bookCode);
        } else {
          enqueueSnackbar(
            `${doI18n("pages:core-contenthandler_juxta:error", i18nRef.current)}: ${jsonResponse.error.reason} ${jsonResponse.status}`,
            { variant: "error" },
          );
        }
      }
    };
    doChapterNumbers().then();
  }, [
    bcvRef.current.bookCode,
    metadata,
    currentBookCode,
    setCurrentBookCode,
    debugRef,
  ]);

  return (
    <Box sx={{ display: "flex", backgroundColor: "white" }} gap={1}>
      <BookPicker
        disable={modified}
        setFirstChapter={getFirstChapterJuxta}
        bcvRef={bcvRef}
        debugRef={debugRef}
        i18nRef={i18nRef}
        currentProjectRef={currentProjectRef}
      />
      <JuxtaSentencesNav
        onPrevHandler={onPrevHandler}
        onNextHandler={onNextHandler}
        indexChangeHandler={indexChangeHandler}
        sentences={sentences}
        currentChapter={currentChapter}
        startVerse={startVerse}
        curIndex={curIndex}
        endVerse={endVerse}
        modified={modified}
      />
    </Box>
  );
}
