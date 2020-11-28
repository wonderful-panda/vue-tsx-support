module.exports = {
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  moduleNameMapper: {
    "^vue$": "<rootDir>/node_modules/vue/dist/vue.js"
  },
  testRegex: "test/jest/(.*)\\.tsx?$",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      tsconfig: "test/jest/tsconfig.json",
      babelConfig: {
        presets: ["@babel/env", "@vue/babel-preset-jsx"]
      }
    }
  }
};
