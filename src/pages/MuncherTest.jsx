import { Box } from "@mui/material";
import { currentProjectContext, bcvContext } from "pankosmia-rcl";
import { useContext, useState, useEffect } from "react";
import { getJson } from "pankosmia-lib/http";
import JuxtaDraftingEditor from "../components/juxtaMuncher/muncher/Editor/JuxtalinearDraftingEditor";
import JuxtalinearViewerMuncher from "../components/juxtaMuncher/muncher/Viewer/JuxtalinearViewerMuncher";
import { getFirstChapterJuxta } from "../components/juxtaMuncher/muncher/utils/getFirstChapterJuxta";
import { WrapperNav } from "../components/juxtaMuncher/wrapperMuncher/WrapperNav";

export function MuncherTest() {
  const { bcvRef } = useContext(bcvContext);
  const { currentProjectRef } = useContext(currentProjectContext);
  const [currentBurrito, setCurrentBurrito] = useState(null);
  const [modified, setModified] = useState(false);

  useEffect(() => {
    async function getSummary() {
      if (currentProjectRef.current) {
        const projectPath = `${currentProjectRef.current.source}/${currentProjectRef.current.organization}/${currentProjectRef.current.project}`;
        const fullMetadataResponse = await getJson(
          `/api/burrito/metadata/summary/${projectPath}`,
        );
        if (fullMetadataResponse.ok) {
          const entry = fullMetadataResponse.json;
          setCurrentBurrito([projectPath, entry]);
        }
      }
    }

    getSummary();
  }, [currentProjectRef.current]);

  const metadata = currentBurrito && {
    local_path: currentBurrito[0],
    ...currentBurrito[1],
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: 3,
        height: "98vh",
      }}
    >
      <WrapperNav flavor={"x-juxtalinear"} />

      <Box sx={{ display: "flex", width: "100%", overflowY: "scroll" }}>
        {metadata && (
          <Box sx={{ flex: 1, margin: 2 }}>
            <JuxtalinearViewerMuncher
              key={metadata.local_path}
              metadata={metadata}
            />
          </Box>
        )}

        {metadata && (
          <Box sx={{ flex: 1, margin: 2 }}>
            <JuxtaDraftingEditor
              key={metadata.local_path}
              modified={modified}
              setModified={setModified}
              metadata={metadata}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
