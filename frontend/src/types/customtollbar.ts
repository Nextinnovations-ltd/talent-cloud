// ------------------ Types ------------------
type FormatType = {
    header?: number | null;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    list?: "ordered" | "bullet";
  };
  
  export default FormatType;