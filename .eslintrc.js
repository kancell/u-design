module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  rules: {
    //'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-multiple-empty-lines': 0,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 0,
  },
};
