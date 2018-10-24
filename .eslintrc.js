module.exports = {
  extends: ['@ridi', 'prettier'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  globals: {
    window: true,
  },
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['import', 'prettier'],
  rules: {
    // prettier
    'prettier/prettier': 'error',

    // reset @ridi
    'class-methods-use-this': 'error',
    'no-constant-condition': 'error',
    'no-plusplus': 'error',

    // store rules
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    'no-unused-vars': ['error'],
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'no-bitwise': [
      'error',
      {
        allow: ['~'],
      },
    ],
    'no-console': [
      'warn',
      {
        allow: ['error'],
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],
    curly: ['error', 'multi-line', 'consistent'],
    'nonblock-statement-body-position': [
      'error',
      'below',
      {
        overrides: {
          if: 'beside',
        },
      },
    ],
    'object-curly-newline': [
      'error',
      {
        multiline: true,
        consistent: true,
      },
    ],

    // jsx
    'react/no-unknown-property': [
      'warn',
      {
        ignore: ['class'],
      },
    ],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.js', '.jsx', '.vue'],
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
  },
};