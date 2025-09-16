!function menu(){
    //Event delegation
    document.addEventListener("click", async (ev)=>{
        ev.stopPropagation()
        ev.preventDefault()
        const node = ev.composedPath().find(n=>n.dataset && 'page' in n.dataset)
        if(node){
            const {page} = node.dataset
            const url = `./${page}.js`
            const module = await import(url)
            module.default()
        }
    })
}()