# Redux Slice "DataStore"

This slice contains all data about the SVG-elements, as well as all used equations.

## SVG

The SVG part of the slice contains a dictionary of all the SVG elements currently defined on the canvas.

## Equations

The Equation part of the slice contains the definitions of all used equations in the entire app.
Those equations, contain the following information:

- `id`: unique id used to reference this equation
- `input`: current value of the equation. This is the equation itself, e.g. `"1+3-sin(phi)"`
