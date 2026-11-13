import { Box, Grid, IconButton, Tooltip } from "@mui/material";
// import LayoutIcon from "../../../TextTranslation/SimplifiedEditor/layouts/LayoutIcon";
import md5sum from "md5";
import { useEffect } from "react";
import { doI18n } from "pankosmia-lib/i18n";
import { useNavigate } from "react-router-dom";
import JuxtaSaveButton from "./JuxtaSaveButton";
import JuxtaNavigation from "./JuxtaNavigation";

function JuxtaEditorTools({
  metadata,
  modified,
  setModified,
  md5sumScriptureJson,
  setMd5sumScriptureJson,
  curIndex,
  sentences,
  navigation,
  bcvRef,
  debugRef,
  i18nRef,
  currentProjectRef,
}) {
  const navigate = useNavigate();

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
        position: "fixed",
        top: "48px",
        left: 0,
        right: 0,
        display: "flex",
        padding: 2,
      }}
    >
      <Grid
        container
        sx={{
          alignItems: "flex-start",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex" }} gap={1}>
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
        </Box>
        <JuxtaNavigation
          metadata={metadata}
          modified={modified}
          {...navigation}
          bcvRef={bcvRef}
          debugRef={debugRef}
          i18nRef={i18nRef}
          currentProjectRef={currentProjectRef}
        />
        <Box display="flex" gap={1}>
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
        </Box>
      </Grid>
    </Box>
  );
}

export default JuxtaEditorTools;
