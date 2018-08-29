const twice = require('../../src/utils/twice.js');


describe('Twice Number', () => {
  it('2 * 3 = 6', () => {
    const result = twice(3);
    expect(result).toBe(6);
  });
});
