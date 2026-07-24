import { getJson, postEmptyJson } from "pankosmia-lib/http";

export async function getFirstChapterJuxta(
  currentProjectRefCurr,
  debugRefCurr,
  bookCode,
) {
  const projectPath = `${currentProjectRefCurr.source}/${currentProjectRefCurr.organization}/${currentProjectRefCurr.project}`;
  const responce = await getJson(
    `/api/burrito/ingredient/raw/${projectPath}?ipath=${bookCode}.json`,
    debugRefCurr,
  );
  if (responce.ok) {
    let [chapter, verse] = responce.json[0].chunks[0].source[0].cv.split(":");

    await postEmptyJson(
      `/api/navigation/bcv/${bookCode}/${chapter}/${verse}`,
      debugRefCurr,
    );
  }
}
