// pages/todos/todos.js
Page({
  data: {
    search: '',
    todos: [
      { text: 'Learing HTML', completed: false },
      { text: 'Learing CSS', completed: false },
      { text: 'Learing JavaScript', completed: true }
    ],
    leftCount: 2,  //剩余数量
    allCompleted: false
  },
  onLoad() { //每次加载获取缓存，没有缓存则展示默认的
    let that = this
    wx.getStorage({
      key: 'todosKey',
      success(res) {
        that.setData({
          todos: res.data,
          leftCount: res.data.length
        })
      }
    })
  },
  inputChange(e) {
    // 每次输入都要改变search的值方便后面使用
    this.setData({ search: e.detail.value })
  },
  addTodo() {
    //空的情况下不新增
    if (!this.data.search) return
    let todos = this.data.todos
    //新增一条 text就是输入的search内容，completed默认为false
    todos.push({
      text: this.data.search,
      completed: false
    })
    this.setData({ 
      search: '',
      todos, //储存todos的新数据
      leftCount: this.data.leftCount + 1  //每次新增都是+1
    })
    //数据缓存
    wx.setStorage({
      key: 'todosKey',
      data: this.data.todos
    })
  },
  toggleTodos(e) {
    //获取索引，然后根据索引找到todos里面的对应数据
    let item = this.data.todos[e.currentTarget.dataset.index]
    //取反
    item.completed = !item.completed
    this.setData({ 
      todos: this.data.todos,
      //剩余数量根据completed来决定+1还是-1
      leftCount: this.data.leftCount + (item.completed ? - 1 : + 1)
    })
  },
  removeTodos(e) {
    let todos = this.data.todos
    todos.splice(e.currentTarget.dataset.index, 1)
    this.setData({ 
      todos,
      leftCount: this.data.leftCount - 1 <= 0 ? 0 : this.data.leftCount - 1
    })
    wx.setStorage({
      key: 'todosKey',
      data: this.data.todos
    })
  },
  allToggle() {
    this.data.allCompleted = !this.data.allCompleted
    let todos = this.data.todos
    todos.forEach( item => {
      item.completed = this.data.allCompleted
    })
    this.setData({ 
      todos,
      leftCount: !this.data.allCompleted ? todos.length : 0
    })
  },
  clear() {
    let todos = this.data.todos
    //过滤出未完成的数据 放到新数组
    todos = todos.filter( item => {
      return !item.completed
    })
    this.setData({
      todos,
      leftCount: todos.length
    })
    wx.setStorage({
      key: 'todosKey',
      data: this.data.todos
    })
  }
})