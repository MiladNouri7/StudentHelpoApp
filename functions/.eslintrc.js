// module.exports = {
//   root: true,
//   env: {
//     es6: true,
//     node: true,
//   },
//   extends: [
//     "eslint:recommended",
//     "google",
//   ],
//   rules: {
//     quotes: ["error", "double"],
//   },
// };

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": [2, "double"],
    "indent": "off",
    "no-undef": "off",
    "comma-dangle": "off",
    "object-curly-spacing": "off",
    "linebreak-style": ["error", "windows"],
    "eol-last": "off",
  },
  parserOptions: {
    "ecmaVersion": 8,
  },
};