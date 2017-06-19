const OFF = 0;
const WARNING = 1;
const ERROR = 2;
const ALWAYS = "always";
const NEVER = "never";

const eslint = {
    "env": {
        "node": true
    },
    "extends": ["eslint:all"],
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        //"arrow-body-style": [OFF],

        // Active this to allow braces in a single line (if {} else if {})
        "brace-style": [OFF, "1tbs", { "allowSingleLine": true }],

        // Some comments are code, by this reason is unfeasible to keep ON
        "capitalized-comments": [OFF, ALWAYS, {
            "ignoreConsecutiveComments": true
        }],

        // Exceptions are variables names of 'for loops' and some libraries

        "id-length": [ERROR,
            { "exceptions": ["x", "y", "z", "i", "j", "k", "_"] }
        ],
        "linebreak-style": [WARNING, "windows"],
        "max-lines": [OFF],

        // Allows functions with 4 or more parameters
        "max-params": [OFF],

        // "max-statements-per-line": [OFF],
        "newline-after-var": [OFF],
        "no-bitwise": [ERROR, { "allow": ["~"] }],
        
        // Disable for object explicitness
        "no-empty-function": [OFF],

        "no-inline-comments": [WARNING],
        
        // Setting a variable to each number is tedious
        "no-magic-numbers": [OFF, { "ignore": [0, 1] }],

        "no-multi-spaces": [WARNING],

        // Sometimes is important separate with many empty
        // lines different sections of the code
        "no-multiple-empty-lines": [OFF],

        "no-plusplus": [WARNING],
        "no-unused-vars": [WARNING],

        // Objects with one property can be created in the same line or below
        "object-curly-newline": [OFF],

        //"object-property-newline": [OFF],

        // Keep all variables in a single 'const' or 'let' is unattractive
        "one-var": [OFF],

        // enforces consistent no-empty line padding within blocks
        "padded-blocks": [WARNING, NEVER],
        
        // It is tiring to add  quotes to each prop
        "quote-props": [OFF],

        // Not always we want keys sorted
        "sort-keys": [OFF],
        
        "spaced-comment": [WARNING]
    },

    "globals": {
        //expectDev: true,
    }
};

// =============================================================================
// Visual Studio Code Formatter
// =============================================================================
eslint.rules["indent"] = [WARNING, 2, { "SwitchCase": 1 }];
eslint.rules["object-curly-spacing"] = [WARNING, ALWAYS];
eslint.rules["space-before-function-paren"] = [WARNING, { "named": NEVER }];

// ESLint extension bug
eslint.rules["no-mixed-operators"] = [OFF];

// =============================================================================
// React
// =============================================================================
// eslint.parserOptions.ecmaFeatures = { "jsx": true };
eslint.extends.push("plugin:react/all");
eslint.plugins = ["react"];
eslint.rules["class-methods-use-this"] = [OFF, {
    "exceptMethods": [
        "render",
        "getInitialState",
        "getDefaultProps",
        "componentWillMount",
        "componentDidMount",
        "componentWillReceiveProps",
        "shouldComponentUpdate",
        "componentWillUpdate",
        "componentDidUpdate",
        "componentWillUnmount",
    ],
}];
eslint.rules["no-extra-parens"] = [ERROR, "all", { "ignoreJSX": "multi-line" }];
eslint.rules["react/jsx-closing-bracket-location"] = [ERROR, 'after-props'];
eslint.rules["react/jsx-sort-props"] = [OFF];

// Pending
eslint.rules["react/no-set-state"] = [OFF];

module.exports = eslint;

// =============================================================================
// Pending
// =============================================================================
eslint.rules["max-statements"] = [OFF, 10, { "ignoreTopLevelFunctions": true }];

// =============================================================================
// Other rules
// =============================================================================
// "no-mixed-operators": [ERROR,
//     {
//         "groups": [
//             ["+", "-", "*", "/", "%", "**"],
//             ["&", "|", "^", "~", "<<", ">>", ">>>"],
//             ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
//             ["&&", "||"],
//             ["in", "instanceof"]
//         ],
//         "allowSamePrecedence": true
//     }
// ],
