const assert = require('assert')
const { sum } = require('../src/Array')

describe('#Array.js', () => {
  describe('#sum()', () => {
    it('sum(1,2,3) shoule return 6', () => {
      assert.strictEqual(sum(1, 2, 3), 6)
    })

    it('sum(1,2) shoule return 3', () => {
      assert.strictEqual(sum(1, 2), 3)
    })
  })
})
