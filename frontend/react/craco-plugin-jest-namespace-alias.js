module.exports = {
  overrideJestConfig: ({ jestConfig }) => {
    jestConfig.moduleNameMapper['^@frontend/app/(.*)$'] = '<rootDir>/../app/$1'
    return jestConfig;
  }
};
