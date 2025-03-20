const btnTask=document.getElementById('btnTask')

btnTask.addEventListener('click', ()=>{

    let obj=document.getElementById('test')
    let parentObj=obj.parentNode

    while(parentObj.tagName!=='HTML'){
        let firstChild=parentObj.firstElementChild
        let newObj=document.createElement(firstChild.tagName)
        newObj.append('Новый элемент')
        parentObj.append(newObj)
        obj=parentObj
        parentObj=obj.parentNode
    }
    //obj.parentNode.lastElementChild.innerHTML='Новый эдемент'
})
