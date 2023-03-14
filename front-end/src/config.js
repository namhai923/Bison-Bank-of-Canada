const config = {
    // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
    // like '/berry-material-react/react/default'
    basename: '',
    defaultPath: '/',
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 12
};

const blankState = {
    userName: '',
    firstName: 'Bison',
    lastName: '',
    accountBalance: 0,
    expenseHistory: [],
    transferHistory: []
};

export default config;
export { blankState };
