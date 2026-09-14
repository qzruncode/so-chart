declare module '*.module.less' {
  const content: { [key: string]: string };
  export default content;
}

declare module '*.module.less?inline' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}
