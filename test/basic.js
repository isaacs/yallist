import t from 'tap'
import { Yallist, Node } from '../dist/esm/index.js'

function add10(i) {
  return i + 10
}
const y = Yallist.create([1, 2, 3, 4, 5])
t.match(y.map(add10).toArray(), [11, 12, 13, 14, 15])
t.match(y.mapReverse(add10).toArray(), [15, 14, 13, 12, 11])

t.match(y.map(add10).toArrayReverse(), [15, 14, 13, 12, 11])
t.type(new Yallist([1, 2, 3]), 'Yallist')
t.equal(y.push(6, 7, 8), 8)
t.match(y.toArray(), [1, 2, 3, 4, 5, 6, 7, 8])
y.pop()
y.shift()
y.unshift(100)

var expect = [100, 2, 3, 4, 5, 6, 7]
var expectReverse = [7, 6, 5, 4, 3, 2, 100]

t.match(y.toArray(), expect)
t.equal(y.length, y.toArray().length)

t.test(function forEach(t) {
  t.plan(y.length * 2)
  y.forEach(function (item, i, list) {
    t.equal(item, expect[i])
    t.equal(list, y)
  })
})

t.test(function forEach(t) {
  t.plan(y.length * 5)
  var n = 0
  y.forEachReverse(function (item, i, list) {
    t.equal(item, expectReverse[n])
    t.equal(item, expect[i])
    t.equal(item, y.get(i))
    t.equal(item, y.getReverse(n))
    n += 1
    t.equal(list, y)
  })
})

t.equal(y.getReverse(100), undefined)

t.equal(y.get(9999), undefined)

function sum(a, b) {
  return a + b
}
t.equal(y.reduce(sum), 127)
t.equal(y.reduce(sum, 100), 227)
t.equal(y.reduceReverse(sum), 127)
t.equal(y.reduceReverse(sum, 100), 227)

t.equal(new Yallist().pop(), undefined)
t.equal(new Yallist().shift(), undefined)

var x = new Yallist()
x.unshift(1)
t.equal(x.length, 1)
t.match(x.toArray(), [1])

// verify that y.toArray() returns an array and if we create a
// new Yallist from that array, we get a list matching it
t.match(new Yallist(y.toArray()), y)

t.throws(
  function () {
    new Yallist().reduce(function () {})
  },
  {},
  new TypeError('Reduce of empty list with no initial value'),
)
t.throws(
  function () {
    new Yallist().reduceReverse(function () {})
  },
  {},
  new TypeError('Reduce of empty list with no initial value'),
)

const z = y.reverse()
t.equal(z, y)
t.match(y.toArray(), expectReverse)
y.reverse()
t.match(y.toArray(), expect)

var a = new Yallist([1, 2, 3, 4, 5, 6])
var cases = [
  [
    [2, 4],
    [3, 4],
  ],
  [[2, -4], []],
  [
    [2, -2],
    [3, 4],
  ],
  [
    [1, -2],
    [2, 3, 4],
  ],
  [[-1, -2], []],
  [
    [-5, -2],
    [2, 3, 4],
  ],
  [
    [-99, 2],
    [1, 2],
  ],
  [[5, 99], [6]],
  [[], [1, 2, 3, 4, 5, 6]],
]
t.test('slice', function (t) {
  t.plan(cases.length)
  cases.forEach(function (c) {
    t.test(JSON.stringify(c), function (t) {
      t.match(a.slice.apply(a, c[0]), new Yallist(c[1]))
      t.match([].slice.apply(a.toArray(), c[0]), c[1])
      t.end()
    })
  })
})

t.test('sliceReverse', function (t) {
  t.plan(cases.length)
  cases.forEach(function (c) {
    var rev = c[1].slice().reverse()
    t.test(JSON.stringify([c[0], rev]), function (t) {
      t.match(a.sliceReverse.apply(a, c[0]), new Yallist(rev))
      t.match([].slice.apply(a.toArray(), c[0]).reverse(), rev)
      t.end()
    })
  })
})

var inserter = new Yallist([1, 2, 3, 4, 5])
inserter.unshiftNode(inserter.head.next)
t.match(inserter.toArray(), [2, 1, 3, 4, 5])
inserter.unshiftNode(inserter.tail)
t.match(inserter.toArray(), [5, 2, 1, 3, 4])
inserter.unshiftNode(inserter.head)
t.match(inserter.toArray(), [5, 2, 1, 3, 4])

var single = new Yallist([1])
single.unshiftNode(single.head)
t.match(single.toArray(), [1])

inserter = new Yallist([1, 2, 3, 4, 5])
inserter.pushNode(inserter.tail.prev)
t.match(inserter.toArray(), [1, 2, 3, 5, 4])
inserter.pushNode(inserter.head)
t.match(inserter.toArray(), [2, 3, 5, 4, 1])
inserter.unshiftNode(inserter.head)
t.match(inserter.toArray(), [2, 3, 5, 4, 1])

single = new Yallist([1])
single.pushNode(single.tail)
t.match(single.toArray(), [1])

var swiped = new Yallist([9, 8, 7])
inserter.unshiftNode(swiped.head.next)
t.match(inserter.toArray(), [8, 2, 3, 5, 4, 1])
t.match(swiped.toArray(), [9, 7])

swiped = new Yallist([9, 8, 7])
inserter.pushNode(swiped.head.next)
t.match(inserter.toArray(), [8, 2, 3, 5, 4, 1, 8])
t.match(swiped.toArray(), [9, 7])

swiped.unshiftNode(new Node(99))
t.match(swiped.toArray(), [99, 9, 7])
swiped.pushNode(new Node(66))
t.match(swiped.toArray(), [99, 9, 7, 66])

var e = new Yallist()
e.unshiftNode(new Node(1))
t.same(e.toArray(), [1])
e = new Yallist([])
e.pushNode(new Node(1))
t.same(e.toArray(), [1])

// steal them back, don't break the lists
swiped.unshiftNode(inserter.head)
t.same(swiped, new Yallist([8, 99, 9, 7, 66]))
t.same(inserter, new Yallist([2, 3, 5, 4, 1, 8]))
swiped.unshiftNode(inserter.tail)
t.same(inserter, new Yallist([2, 3, 5, 4, 1]))
t.same(swiped, new Yallist([8, 8, 99, 9, 7, 66]))

t.throws(
  function remove_foreign_node() {
    e.removeNode(swiped.head)
  },
  {},
  new Error('removing node which does not belong to this list'),
)
t.throws(
  function remove_unlisted_node() {
    e.removeNode(new Node('nope'))
  },
  {},
  new Error('removing node which does not belong to this list'),
)

e = new Yallist([1, 2])
e.removeNode(e.head)
t.same(e, new Yallist([2]))
e = new Yallist([1, 2])
e.removeNode(e.tail)
t.same(e, new Yallist([1]))

// shift all the way down
e = new Yallist()
e.push(1)
e.push(2)
e.push(3)
t.equal(e.shift(), 1)
t.equal(e.shift(), 2)
t.equal(e.shift(), 3)
t.equal(e.shift(), undefined)

// pop all the way down
e = new Yallist()
e.unshift(1)
e.unshift(2)
e.unshift(3)
t.equal(e.pop(), 1)
t.equal(e.pop(), 2)
t.equal(e.pop(), 3)
t.equal(e.pop(), undefined)

t.test('iterator test', t => {
  t.plan(1)
  e = new Yallist([1, 2, 3, 4])
  t.same(Array.from(e), [1, 2, 3, 4])
})

e = new Yallist([1, 2, 3, 4, 5])
t.same(e.splice(2, 0), [])
t.same(e, new Yallist([1, 2, 3, 4, 5]))

e = new Yallist([1, 2, 3, 4, 5])
t.same(e.splice(2, 1), [3])
t.same(e, new Yallist([1, 2, 4, 5]))

e = new Yallist([1, 2, 3, 4, 5])
t.same(e.splice(-2, 2), [4, 5])
t.same(e, new Yallist([1, 2, 3]))

e = new Yallist([1, 2, 3, 4, 5])
t.same(e.splice(2, 0, 6), [])
t.same(e, new Yallist([1, 2, 6, 3, 4, 5]))

e = new Yallist([1, 2, 3, 4, 5])
t.same(e.splice(-2, 10, 6, 7), [4, 5])
t.same(e, new Yallist([1, 2, 3, 6, 7]))

e = new Yallist([1, 2, 3, 4, 5])
t.same(e.splice(0, 0, 6), [])
t.same(e, new Yallist([6, 1, 2, 3, 4, 5]))

e = new Yallist([1, 2, 3, 4, 5])
t.same(e.splice(60, 0, 6), [])
t.same(e, new Yallist([1, 2, 3, 4, 5, 6]))

t.test('shift/removeNode bug', t => {
  // https://github.com/isaacs/yallist/issues/35
  const ll = new Yallist()

  t.test('shift', t => {
    ll.push({ name: 'a' })
    const node = ll.head
    t.equal(ll.length, 1)

    ll.shift()
    t.equal(ll.length, 0)

    t.throws(() => ll.removeNode(node))
    t.equal(ll.length, 0)
    t.end()
  })
  t.test('push', t => {
    ll.push({ name: 'a' })
    const node = ll.head
    ll.pop()
    t.equal(ll.length, 0)

    t.throws(() => ll.removeNode(node))
    t.equal(ll.length, 0)
    t.end()
  })
  t.end()
})

t.test('splice bug', t => {
  const myList = new Yallist([1, 2, 3])
  myList.splice(1, 0, 'should be second item')
  t.same(myList.toArray(), [1, 'should be second item', 2, 3])
  t.end()
})

t.test('find', t => {
  const ll = new Yallist([1, 2, 3, 4, 5])

  const foundNode = ll.find(value => value === 3)
  t.equal(foundNode?.value, 3)

  const notFoundNode = ll.find(value => value === 6)
  t.equal(notFoundNode, undefined)

  t.end()
})
