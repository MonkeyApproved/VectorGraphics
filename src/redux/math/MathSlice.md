# Parsing equation strings

In order to allow equations being used in any input field, we parse the inputs and try to interpret them as mathematical equations.
This is done in multiple steps and can result in numbers or arrays.
So far we do not support using matrix inputs (only 1D vectors).
This feature could be added in the future.
Any time an input is updated by the user, the `updateEquationInput()` function in _src/redux/dataStore/equations/computeResult.ts_ is triggered.

In the following we will go through an example of an input string being processed.
We assume that there are the following equations:

- A = 4
- B = A/2

## Step 1: Parse Equation

This converts the input string into a token array.
In order to break up an input string into meaningful tokens, we use different regex expressions to identify different types of syntactic elements:

- `[a-z]+[a-z0-9]*`: Find any variable or function name. We expect that variables/functions always start with a lowercase letter and we only allow letters or numbers for the rest.
- `[0-9]+[.]?[0-9]*`: Find numbers with `.` as a decimal separator. This could easily be configurable in the future.
- `[+*^_%/-]`: Operators are all the mathematical symbols that are supported.
- `[)([,:\]]`: Compositions, including parenthesis and array syntax such as array brackets and commas used to define vectors/arrays `[1,2,3]`.
- `[^\s]+`: Everything else is unknown.

For all of these categories, we replace all matches with an empty string of the same length. This allows us to extract the exact position and size of all the matches, which makes it easy to order them by their position in the input.

## Step 2: Fix tokens

After splitting the input string into it's basic components, we perform some checks, add certain tokens that are implied by shorthand notations (e.g. `2x` meaning `2*x`) and merge/replace tokens that are used for more complex syntax (e.g. `A1:A3` indicating a cell range `[A1,A2,A3]`).

### Add missing multiplication

We look for any missing multiplications that are indicated by the syntax.
Examples are `2x`, `2sin(x)`, `2(x+y)`, `x y`, `(x+y)(x+y)`.
To identify those cases, we check if there are two subsequent tokens that match the following pattern:

- The 1st token is: Cell, Variable, Array, Number, CellRange, RightParenthesis, ArrayEnd
- The 2nd token is: Cell, Variable, Array, Number, Function, CellRange, LeftParenthesis, ArrayStart

If those conditions are met, we simply add a multiplication operator between these two tokens.

### Differentiate between sign and plus/minus operator

Whenever we find a plus/minus operator, we check if

- The next token is: Cell, Variable, Array, Number, Function, CellRange, LeftParenthesis, ArrayStart
- The previous token is: Operator of type `^*_/`, Composition of type `([,` or Start

If these conditions are met, we either remove the plus sign or replace the minus operator with the `negative` function. This function takes one argument and inverts the value (`negative(x) = -x`)

### Cell ranges

Whenever we find a Colon, we check that the two surrounding tokens are cells. If thats not the case, we mark the equation as invalid, otherwise we replace the colon and two cell tokens with a cell range token.

### Arrays

If we find an ArrayStart token, we replace it with array function token and an open parenthesis token. Additionally, we update the currentLevel of the tracker (see next section for details) and add the array start token to the tracker hierarchy.

If we find an ArrayEnd token, we check if the matching token in the tracker hierarchy is an ArrayStart token. That being the case, we replace the ArrayEnd with a RightParenthesis token. Otherwise, we mark the equation as invalid.

### Parenthesis

### Commas

## Step 3: Compute Reversed Polish Notation
