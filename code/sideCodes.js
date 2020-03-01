let x = []
let s = new Set()
for (let e of wRefs) {
    for (let v of e.list) {
        let ar = v.cv
        x.push(ar)
        s.add(ar)
    }
}

let all = ''
all += searchQue.value + "\n"
wordLst[1].forEach(e => all += `https://a0m0rajab.github.io/BahisQuraniDev/simi#${e[0]+1}:${e[1]+1}\n`)
all