import { Box, Grid2, IconButton, Tooltip } from "@mui/material";
// import LayoutIcon from "../../../TextTranslation/SimplifiedEditor/layouts/LayoutIcon";
import BookPicker from "./BookPicker";
import md5sum from "md5";
import { useEffect, useState } from "react";
import { getJson, postEmptyJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import { useNavigate } from "react-router-dom";
import JuxtaSaveButton from "./JuxtaSaveButton";
import JuxtaSentencesNav from "./JuxtaSentencesNav";
import { getFirstChapterJuxta } from "../utils/getFirstChapterJuxta";

function JuxtaEditorTools({
  metadata,
  md5sumScriptureJson,
  setMd5sumScriptureJson,
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
  const [modified, setModified] = useState(false);
  const navigate = useNavigate();

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
    return sentences.length
      ? sentences[curIndex].chunks.slice(-1)[0]?.source.slice(-1)[0]
      : null;
  };
  const currentChapter = () => firstSource()?.cv.split(":")[0] ?? 0;

  const startVerse = () => firstSource()?.cv.split(":")[1] ?? 0;

  const endVerse = () => lastSource()?.cv.split(":")[1] ?? 0;
  // Set up chapter numbers when changing book

  useEffect(() => {
    if (currentBookCode) {
      postEmptyJson(
        `/api/navigation/bcv/${currentBookCode}/${currentChapter()}/${startVerse()}`,
        debugRef.current,
      );
    }
  }, [curIndex]);

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
          const JsonDraft = jsonResponse.json;
          setCurrentBookCode(bcvRef.current.bookCode);
        } else {
          enqueueSnackbar(
            `${doI18n("pages:core-contenthandler_juxta:error", i18nRef.current)}: ${jsonResponse.status}`,
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
  const indexChangeHandler = (e) => {
    const index = parseInt(e.target.value);
    if (index > 0 && index <= sentences.length) {
      setCurIndex(index - 1);
    }
  };
  useEffect(() => {
    const isElectron = !!window.electronAPI;
    if (isElectron) {
      if (modified) {
        window.electronAPI.setCanClose(false);
      } else {
        window.electronAPI.setCanClose(true);
      }
    }
  }, [modified]);

  useEffect(() => {
    setModified(
      sentences.length > 0
        ? md5sum(JSON.stringify(sentences[curIndex])) !== md5sumScriptureJson
        : true,
    );
  }, [curIndex, md5sumScriptureJson, sentences]);
  return (
    <Box
      sx={{
        flexDirection: "row",
        display: "flex",
      }}
    >
      <Grid2
        container
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Grid2 display="flex" gap={1}>
          <JuxtaSaveButton
            metadata={metadata}
            bcvRef={bcvRef}
            modified={!modified}
            md5sumScriptureJson={md5sumScriptureJson}
            setMd5sumScriptureJson={setMd5sumScriptureJson}
            sentences={sentences}
            curIndex={curIndex}
            i18nRef={i18nRef}
          />
        </Grid2>

        <Grid2 display="flex" gap={1}>
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
        </Grid2>
        <Grid2 display="flex" gap={1}>
          <Tooltip
            title={doI18n(
              "pages:core-local-workspace:button_edit",
              i18nRef.current,
              debugRef.current,
            )}
          >
            <IconButton
              disabled={modified}
              /* enables redirection based on the page */
              onClick={() =>
                navigate({
                  pathname: "/",
                  search: "return-page=workspace",
                })
              }
            >
              {/* <LayoutIcon /> */}
            </IconButton>
          </Tooltip>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default JuxtaEditorTools;
