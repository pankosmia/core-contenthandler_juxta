import { useEffect, useState, useContext } from "react";
import { Box, Grid, Popover, Stack, Typography } from "@mui/material";

import {
  i18nContext as I18nContext,
  debugContext as DebugContext,
  bcvContext as BcvContext,
} from "pankosmia-rcl";
import { getJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import Juxta2Verbs from "./ViewerTools/juxta2verbs";

function JuxtalinearViewerMuncher({
  metadata,
  Navigation,
  showNavigation,
  bcvRef,
  debugRef,
  i18nRef,
}) {
  const [ingredient, setIngredient] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedWordJuxta, setSelectedWordJuxta] = useState(null);
  const [selectedMorph, setSelectedMorph] = useState([]);

  const getAllData = async () => {
    const ingredientLink = `/api/burrito/ingredient/raw/${metadata.local_path}?ipath=${bcvRef.current.bookCode}.json`;
    let response = await getJson(ingredientLink, debugRef.current);
    if (response.ok) {
      setIngredient(response.json);
    } else {
      enqueueSnackbar(
        `${doI18n("pages:core-contenthandler_juxta:error", i18nRef.current)}: ${response.status}`,
        { variant: "error" },
      );
      setIngredient([]);
    }
  };
  useEffect(() => {
    getAllData().then();
  }, [bcvRef.current]);

  const sentencesForVerse = ingredient.filter((i) =>
    i.chunks.some((c) =>
      c.source.some((s) => {
        const [cvChapter, cvVerse] = s.cv.split(":").map(Number);
        const endVerseNum =
          bcvRef.current.endVerseNum ?? bcvRef.current.verseNum;
        return (
          cvChapter === bcvRef.current.chapterNum &&
          cvVerse >= bcvRef.current.verseNum &&
          cvVerse <= endVerseNum
        );
      }),
    ),
  );

  const versesInSentence = sentencesForVerse
    .map((sfv) =>
      sfv.chunks
        .map((c) => c.source.map((src) => src.cv))
        .reduce((a, b) => [...a, ...b], []),
    )
    .reduce((a, b) => [...a, ...b], []);

  const uniqueVersesInSentence = [...new Set(versesInSentence)];

  const sentencesForVerses = ingredient.filter((i) =>
    i.chunks.some((c) =>
      c.source.some((s) => uniqueVersesInSentence.includes(s.cv)),
    ),
  );

  const sentencePrintRef = `${uniqueVersesInSentence[0]}${uniqueVersesInSentence.length > 1 ? `-${uniqueVersesInSentence[uniqueVersesInSentence.length - 1].split(":")[1]}` : ""}`;

  return (
    <Stack sx={{ p: 1, alignItems: "center" }}>
      {/* {showNavigation && <Navigation/>} */}
      <h5>{`(${bcvRef.current.bookCode} ${sentencePrintRef})`}</h5>
      <div>
        {ingredient.length > 0 ? (
          <Grid container>
            {sentencesForVerses.map((s, id) => (
              <Grid
                key={id}
                container
                size={12}
                spacing={0}
                sx={{ marginBottom: 1 }}
                display="flex"
              >
                {s.chunks.map((c, id2) => (
                  <>
                    <Grid
                      key={id2}
                      size={6}
                      spacing={0}
                      sx={{ p: 0, m: 0 }}
                      justifyContent="flex-end"
                      alignItems="flex-end"
                    >
                      <Box
                        key={`${id}${id2}`}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignContent: "flex-end",
                          alignItems: "flex-end",
                          fontSize: "small",
                          pr: 1,
                          textAlign: "right",
                        }}
                      >
                        {c.source.map((s, idx) => {
                          const popoverId = `${s.content}-${idx}`;
                          return (
                            <>
                              <Typography
                                key={idx}
                                sx={{
                                  paddingRight: 1,
                                  mb: 0,
                                  cursor: "pointer",
                                }}
                                onClick={(event) => {
                                  setAnchorEl(event.currentTarget);
                                  setSelectedWordJuxta(popoverId);
                                  setSelectedMorph(s.morph);
                                }}
                              >
                                {s.content}
                              </Typography>
                              <Popover
                                open={selectedWordJuxta === popoverId}
                                anchorEl={anchorEl}
                                onClose={() => {
                                  setSelectedWordJuxta(null);
                                  setAnchorEl(null);
                                }}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "left",
                                }}
                              >
                                <Juxta2Verbs
                                  morphArray={selectedMorph}
                                  lemma={s.lemma}
                                />
                              </Popover>
                            </>
                          );
                        })}
                      </Box>
                    </Grid>
                    <Grid
                      size={6}
                      sx={{ fontSize: "small", pl: 1, m: 0 }}
                      spacing={0}
                    >
                      {c.gloss}
                    </Grid>
                  </>
                ))}
              </Grid>
            ))}
          </Grid>
        ) : (
          `${doI18n("pages:core-local-workspace:no_juxta", i18nRef.current)}`
        )}
      </div>
    </Stack>
  );
}

export default JuxtalinearViewerMuncher;
