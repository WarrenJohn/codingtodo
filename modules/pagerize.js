const pageMap = new Map()
const pageObj = new Object()

document.querySelectorAll('*[id]').forEach(a => {
    pageMap.set(a.id, a); pageObj[a.id] = a;
})

export{ pageMap, pageObj };
