module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
    },
    "extends": "airbnb",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "no-console": 0,
        "max-len": 0,
        "camelcase": 0,
        "no-param-reassign": 0,
        "react/prop-types": 0,
        "react/no-array-index-key": 0,
        "react/jsx-one-expression-per-line": 0,
        "no-underscore-dangle": 0,
        "no-unused-vars": 0

    }
}
