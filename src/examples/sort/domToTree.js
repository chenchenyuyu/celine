// 将dom转换为树的结构
<div>
    <span></span>
    <ul>
        <li></li>
        <li></li>
    </ul>
</div>

 // 先将dom树转化为可以描述的json对象树的结构， 如下：
//  {
//     tag: 'div',
//     children: [
//         {
//             tag: 'span',
//                attr: {classname:'', id: ''}
//         },
//         {
//             tag: 'ul',
//             children: [
//                 {tag: 'li'},
//                 {tag: 'li'},
//             ]
//         }
//     ]
//  }
// dom: 直接传入dom html数据格式
const domToTree = (dom) => {
    const obj = {};
    obj.tag = dom.tagName;
    obj.children = [];
    dom.childNodes.forEach(element => obj.children.push(domToTree(element))); // 递归解决嵌套的数据
}


// json=> dom树的格式， treeToDom
const _render = (vnode) => {
    if(typeof vnode === 'number') {
        vnode = String(vnode);
    }

    if(typeof vnode === 'string') {
        return document.createTextNode(vnode);
    }

    const dom = document.createElement(vnode.tag);
    if(vnode.attrs) {
        Object.keys(vnode.attrs).forEach((key) => {
            const value = vnode.attrs[key];
            dom.setAttribute(key, value);
        });
    }

    vnode.children.forEach((child) => dom.appendChild(_render(child)));

    return dom; // 返回父节点
}   

