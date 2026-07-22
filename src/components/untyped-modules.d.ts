declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

// 💡 Declares any import ending in .scss, .css, etc., as a module with string keys
// This is necessary if you are using CSS Modules (e.g., import styles from './file.module.scss')
declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}
