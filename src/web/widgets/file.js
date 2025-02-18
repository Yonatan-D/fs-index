class FileList extends HTMLElement {
  constructor() {
    super();

    // 创建 Shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });

    // 创建一个 slot 元素
    const slot = document.createElement('slot');

    // 将 slot 添加到 Shadow DOM 中
    shadow.appendChild(slot);

    // 你可以通过 slot.assignedNodes() 获取插入的内容
    const nodes = slot.assignedNodes();

    // 过滤出 a 标签
    const list = this.filterFileList(nodes);
    console.log(list); // 这将输出 a 标签的列表

    Array.from(list).forEach((item) => {
      console.log(item);
      
    })
  }

  filterFileList(nodes) {
    return nodes[0].querySelectorAll('ul#files li a');
  }

  connectedCallback() {
    
  }
  
}

customElements.define('file-list', FileList);
