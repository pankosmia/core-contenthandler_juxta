import { Box, Input, InputProps } from "@mui/material";

export const MarkdownInput = (props: InputProps) => {
  const value = String(props.value ?? "");

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minWidth: 0,
        minHeight: "100%",
      }}
    >
      {/* Invisible content determines the height */}
      <Box
        component="span"
        sx={{
          visibility: "hidden",
          display: "block",
          width: "100%",
          minHeight: "40px",

          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
          wordBreak: "break-word",

          font: "inherit",
          fontSize: "1rem",

          px: "8px",
          pr: "30px",
          boxSizing: "border-box",
        }}
      >
        {value || " "}
      </Box>

      <Input
        {...props}
        multiline
        maxRows={6}
        fullWidth
        sx={{
          position: "absolute",
          inset: 0,
          p: 1,
          width: "100%",
          height: "100%",

          backgroundColor: "lightgrey",

          "& textarea": {
            padding: 0,
            resize: "none",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          },

          ...props.sx,
        }}
      />
    </Box>
  );
};
