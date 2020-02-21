let x = []
let s = new Set()
for (let e of wRefs) {
    for (let v of e.list) {
        let ar = v.cv
        x.push(ar)
        s.add(ar)
    }
}