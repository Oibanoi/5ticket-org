
/**
 * LINT-STAGED CONFIGURATION
 * 
 * Purpose: Automatically run code quality tools only on staged files (ready to commit)
 * Ensures code quality before commit without running on entire project
 * 
 * How it works:
 * - Triggered by Git hooks (usually pre-commit hook)
 * - Only runs on files that have been `git add`ed
 * 
 * Current configuration:
 * - JS/TS/JSX/TSX files: Run ESLint to auto-fix errors, then check again
 * - TypeScript files: Run type checking
 * - JSON/YAML files: Format code with Prettier
 * 
 * To modify: Add file patterns and corresponding commands to the object below
 */

module.exports = {
  // Check and fix ESLint errors for JavaScript/TypeScript files
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "eslint"],
  
  // Run TypeScript type checking (runs after ESLint due to --concurrent false)
  "**/*.ts?(x)": () => "npm run check-types",
  
  // Format JSON and YAML files with Prettier
  "*.{json,yaml}": ["prettier --write"],
};
