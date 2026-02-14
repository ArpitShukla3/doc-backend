export type BearType = {
    id: number;
}
export type TextBlockType = {
  id: string;          // important for stable rendering
  isCode: boolean;
  codeLanguage?: Language;
  heading?: Heading;
  isItalic?: boolean;
  text: string;
  input?: string;
  output?: string;
};
export enum Heading {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
}
export enum Language{
    java = "java",
    python = "python",
    javascript = "javascript",
    default = "cpp"
}