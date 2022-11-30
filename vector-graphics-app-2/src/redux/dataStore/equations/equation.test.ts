import getEquation from './equation';

const equations = [
  { string: '1+1+1', tokens: ['', '1', '+', '1', '+', '1', ''], rpn: ['+', '1', '+', '1', '1'] },
];

test('check tokens', () => {
  equations.forEach((equation) => {
    const eq = getEquation(equation.string);
    eq.tokens.forEach((token, index) => {
      expect(token.symbol).toBe(equation.tokens[index]);
    });
  });
});
