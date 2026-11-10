import { getJson, postEmpty } from "pankosmia-lib/http";
import { enqueueSnackbar } from "notistack";
import { doI18n } from "pankosmia-lib/i18n";

export async function getFirstChapterJuxta(
  currentProjectRefCurr,
  debugRefCurr,
  bookCode,
  i18nRef,
) {
  const projectPath = `${currentProjectRefCurr.source}/${currentProjectRefCurr.organization}/${currentProjectRefCurr.project}`;
  const responce = await getJson(
    `/api/burrito/ingredient/raw/${projectPath}?ipath=${bookCode}.json`,
    debugRefCurr,
  );
  console.log(responce);
  if (responce.ok) {
    let [chapter, verse] = responce.json[0].chunks[0].source[0].cv.split(":");

    let postResponse = await postEmpty(
      `/api/navigation/bcv/${bookCode}/${chapter}/${verse}`,
      debugRefCurr,
    );
    if (!postResponse.ok) {
      enqueueSnackbar(
        `${doI18n("pages:core-contenthandler_juxta:error", i18nRef.current)}: ${postResponse.error.reason} ${postResponse.status}`,
        { variant: "error" },
      );
    }
  } else {
    enqueueSnackbar(
      `${doI18n("pages:core-contenthandler_juxta:error", i18nRef.current)}: ${responce.error.reason} ${responce.status}`,
      { variant: "error" },
    );
  }
}
