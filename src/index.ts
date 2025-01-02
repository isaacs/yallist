export class Yallist<T = unknown> {
  tail?: Node<T>
  head?: Node<T>
  length: number = 0

  static create<T = unknown>(list: Iterable<T> = []) {
    return new Yallist(list)
  }

  constructor(list: Iterable<T> = []) {
    for (const item of list) {
      this.push(item)
    }
  }

  *[Symbol.iterator]() {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }

  removeNode(node: Node<T>) {
    if (node.list !== this) {
      throw new Error(
        'removing node which does not belong to this list',
      )
    }

    const next = node.next
    const prev = node.prev

    if (next) {
      next.prev = prev
    }

    if (prev) {
      prev.next = next
    }

    if (node === this.head) {
      this.head = next
    }
    if (node === this.tail) {
      this.tail = prev
    }

    this.length--
    node.next = undefined
    node.prev = undefined
    node.list = undefined

    return next
  }

  unshiftNode(node: Node<T>) {
    if (node === this.head) {
      return
    }

    if (node.list) {
      node.list.removeNode(node)
    }

    const head = this.head
    node.list = this
    node.next = head
    if (head) {
      head.prev = node
    }

    this.head = node
    if (!this.tail) {
      this.tail = node
    }
    this.length++
  }

  pushNode(node: Node<T>) {
    if (node === this.tail) {
      return
    }

    if (node.list) {
      node.list.removeNode(node)
    }

    const tail = this.tail
    node.list = this
    node.prev = tail
    if (tail) {
      tail.next = node
    }

    this.tail = node
    if (!this.head) {
      this.head = node
    }
    this.length++
  }

  push(...args: T[]) {
    for (let i = 0, l = args.length; i < l; i++) {
      push(this, args[i])
    }
    return this.length
  }

  unshift(...args: T[]) {
    for (var i = 0, l = args.length; i < l; i++) {
      unshift(this, args[i])
    }
    return this.length
  }

  pop() {
    if (!this.tail) {
      return undefined
    }

    const res = this.tail.value
    const t = this.tail
    this.tail = this.tail.prev
    if (this.tail) {
      this.tail.next = undefined
    } else {
      this.head = undefined
    }
    t.list = undefined
    this.length--
    return res
  }

  shift() {
    if (!this.head) {
      return undefined
    }

    const res = this.head.value
    const h = this.head
    this.head = this.head.next
    if (this.head) {
      this.head.prev = undefined
    } else {
      this.tail = undefined
    }
    h.list = undefined
    this.length--
    return res
  }

  forEach(
    fn: (value: T, i: number, list: Yallist<T>) => any,
    thisp?: any,
  ) {
    thisp = thisp || this
    for (let walker = this.head, i = 0; !!walker; i++) {
      fn.call(thisp, walker.value, i, this)
      walker = walker.next
    }
  }

  forEachReverse(
    fn: (value: T, i: number, list: Yallist<T>) => any,
    thisp?: any,
  ) {
    thisp = thisp || this
    for (let walker = this.tail, i = this.length - 1; !!walker; i--) {
      fn.call(thisp, walker.value, i, this)
      walker = walker.prev
    }
  }

  get(n: number) {
    let i = 0
    let walker = this.head
    for (; !!walker && i < n; i++) {
      walker = walker.next
    }
    if (i === n && !!walker) {
      return walker.value
    }
  }

  getReverse(n: number) {
    let i = 0
    let walker = this.tail
    for (; !!walker && i < n; i++) {
      // abort out of the list early if we hit a cycle
      walker = walker.prev
    }
    if (i === n && !!walker) {
      return walker.value
    }
  }

  map<R = any>(
    fn: (value: T, list: Yallist<T>) => R,
    thisp?: any,
  ): Yallist<R> {
    thisp = thisp || this
    const res = new Yallist<R>()
    for (let walker = this.head; !!walker; ) {
      res.push(fn.call(thisp, walker.value, this))
      walker = walker.next
    }
    return res
  }

  mapReverse<R = any>(
    fn: (value: T, list: Yallist<T>) => R,
    thisp?: any,
  ): Yallist<R> {
    thisp = thisp || this
    var res = new Yallist<R>()
    for (let walker = this.tail; !!walker; ) {
      res.push(fn.call(thisp, walker.value, this))
      walker = walker.prev
    }
    return res
  }

  reduce(fn: (left: T, right: T, i: number) => T): T
  reduce<R = any>(
    fn: (acc: R, next: T, i: number) => R,
    initial: R,
  ): R
  reduce<R = any>(
    fn: (acc: R, next: T, i: number) => R,
    initial?: R,
  ): R {
    let acc: R | T
    let walker = this.head
    if (arguments.length > 1) {
      acc = initial as R
    } else if (this.head) {
      walker = this.head.next
      acc = this.head.value
    } else {
      throw new TypeError(
        'Reduce of empty list with no initial value',
      )
    }

    for (var i = 0; !!walker; i++) {
      acc = fn(acc as R, walker.value, i)
      walker = walker.next
    }

    return acc as R
  }

  reduceReverse(fn: (left: T, right: T, i: number) => T): T
  reduceReverse<R = any>(
    fn: (acc: R, next: T, i: number) => R,
    initial: R,
  ): R
  reduceReverse<R = any>(
    fn: (acc: R, next: T, i: number) => R,
    initial?: R,
  ): R {
    let acc: R | T
    let walker = this.tail
    if (arguments.length > 1) {
      acc = initial as R
    } else if (this.tail) {
      walker = this.tail.prev
      acc = this.tail.value
    } else {
      throw new TypeError(
        'Reduce of empty list with no initial value',
      )
    }

    for (let i = this.length - 1; !!walker; i--) {
      acc = fn(acc as R, walker.value, i)
      walker = walker.prev
    }

    return acc as R
  }

  toArray() {
    const arr = new Array(this.length)
    for (let i = 0, walker = this.head; !!walker; i++) {
      arr[i] = walker.value
      walker = walker.next
    }
    return arr
  }

  toArrayReverse() {
    const arr = new Array(this.length)
    for (let i = 0, walker = this.tail; !!walker; i++) {
      arr[i] = walker.value
      walker = walker.prev
    }
    return arr
  }

  slice(from: number = 0, to: number = this.length) {
    if (to < 0) {
      to += this.length
    }
    if (from < 0) {
      from += this.length
    }
    const ret = new Yallist()
    if (to < from || to < 0) {
      return ret
    }
    if (from < 0) {
      from = 0
    }
    if (to > this.length) {
      to = this.length
    }
    let walker = this.head
    let i = 0
    for (i = 0; !!walker && i < from; i++) {
      walker = walker.next
    }
    for (; !!walker && i < to; i++, walker = walker.next) {
      ret.push(walker.value)
    }
    return ret
  }

  sliceReverse(from: number = 0, to: number = this.length) {
    if (to < 0) {
      to += this.length
    }
    if (from < 0) {
      from += this.length
    }
    const ret = new Yallist()
    if (to < from || to < 0) {
      return ret
    }
    if (from < 0) {
      from = 0
    }
    if (to > this.length) {
      to = this.length
    }
    let i = this.length
    let walker = this.tail
    for (; !!walker && i > to; i--) {
      walker = walker.prev
    }
    for (; !!walker && i > from; i--, walker = walker.prev) {
      ret.push(walker.value)
    }
    return ret
  }

  splice(start: number, deleteCount: number = 0, ...nodes: T[]) {
    if (start > this.length) {
      start = this.length - 1
    }
    if (start < 0) {
      start = this.length + start
    }

    let walker = this.head

    for (let i = 0; !!walker && i < start; i++) {
      walker = walker.next
    }

    const ret: T[] = []
    for (let i = 0; !!walker && i < deleteCount; i++) {
      ret.push(walker.value)
      walker = this.removeNode(walker)
    }
    if (!walker) {
      walker = this.tail
    } else if (walker !== this.tail) {
      walker = walker.prev
    }

    for (const v of nodes) {
      walker = insertAfter<T>(this, walker, v)
    }

    return ret
  }

  reverse() {
    const head = this.head
    const tail = this.tail
    for (let walker = head; !!walker; walker = walker.prev) {
      const p = walker.prev
      walker.prev = walker.next
      walker.next = p
    }
    this.head = tail
    this.tail = head
    return this
  }

  find(predicate: (value: T, index: number) => boolean) {
    let walker = this.head
    let index = 0

    while (walker !== undefined) {
      if (predicate(walker.value, index)) {
        return walker
      }

      walker = walker.next
      index++
    }

    return undefined
  }
}

// insertAfter undefined means "make the node the new head of list"
function insertAfter<T>(
  self: Yallist<T>,
  node: Node<T> | undefined,
  value: T,
) {
  const prev = node
  const next = node ? node.next : self.head
  const inserted = new Node<T>(value, prev, next, self)

  if (inserted.next === undefined) {
    self.tail = inserted
  }
  if (inserted.prev === undefined) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push<T>(self: Yallist<T>, item: T) {
  self.tail = new Node<T>(item, self.tail, undefined, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift<T>(self: Yallist<T>, item: T) {
  self.head = new Node<T>(item, undefined, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

export class Node<T = unknown> {
  list?: Yallist<T>
  next?: Node<T>
  prev?: Node<T>
  value: T

  constructor(
    value: T,
    prev?: Node<T> | undefined,
    next?: Node<T> | undefined,
    list?: Yallist<T> | undefined,
  ) {
    this.list = list
    this.value = value

    if (prev) {
      prev.next = this
      this.prev = prev
    } else {
      this.prev = undefined
    }

    if (next) {
      next.prev = this
      this.next = next
    } else {
      this.next = undefined
    }
  }
}
