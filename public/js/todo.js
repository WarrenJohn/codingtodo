(function(){

    const todoInput = document.getElementById('todo');
    const list = document.getElementById('list');
    const li = list.querySelectorAll('li');
    const date = new Date();
    const storage = window.localStorage;
    const existingTodo = storage.todo ? JSON.parse(storage.todo) : false

    function clearTodo(){
        storage.clear();
        list.innerHTML = ''
    }

    function addItem(){
        let children = list.children;
        let userItems = Array();
        for (let each of children){
            itemID = each.children.item('label').id;
            userItems.push({
                'id': each.children.item('label').id,
                'text': each.children.item('label').textContent,
                'checked': each.children.item('label').children.item('input').checked
            })
        }
        userItems = JSON.stringify(userItems);
        storage.setItem('todo', userItems);

    }

    function setUp(id, text, checked){
        const li = document.createElement('li');
        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        label.id = id;
        label.className += 'check-container';
        input.type = 'checkbox';
        if(checked){
            label.classList.toggle('complete');
            input.checked = checked;
        }
        span.className += 'checkmark';

        label.textContent = text;

        li.appendChild(label);
        label.appendChild(input);
        label.appendChild(span)
        return li;
    }

    // function addTodo (userInput){
    //     let randomID = Math.random().toString(36).substring(7);
    //     const li = document.createElement('li');
    //     const label = document.createElement('label');
    //     const input = document.createElement('input');
    //     const span = document.createElement('span');
    //     label.id = randomID;
    //     label.className += 'check-container';
    //     input.type = 'checkbox'
    //     span.className += 'checkmark';
    //
    //     label.textContent = userInput + ` (${new Date().toDateString()})`;
    //
    //     li.appendChild(label);
    //     label.appendChild(input);
    //     label.appendChild(span)
    //     return li;
    // }

    function Todo (){
        this.randomID = Math.random().toString(36).substring(7);
        this.li = document.createElement('li');
        this.label = document.createElement('label');
        this.input = document.createElement('input');
        this.span = document.createElement('span');

        this.add = function(userInput){
            this.label.id = this.randomID;
            this.label.className += 'check-container';
            this.input.type = 'checkbox'
            this.span.className += 'checkmark';

            this.label.textContent = userInput + ` (${new Date().toDateString()})`;

            this.li.appendChild(this.label);
            this.label.appendChild(this.input);
            this.label.appendChild(this.span)
            return this.li;
        }

    }

    existingTodo ? existingTodo.forEach(todo => {
        list.appendChild(setUp(todo.id, todo.text, todo.checked))
    }) : false;

    todoInput.onkeydown = (e) => {
        if (e.keyCode == 13) { // enter key is 13
            // const todo = addTodo(todo.value);
            const todo = new Todo();
            list.appendChild(todo.add(todoInput.value));
            addItem()
            todoInput.value = ''; // input field value
        }
    }
    list.addEventListener('click', e => {
        if(e.target.tagName === 'LABEL'){
            const clicked = document.getElementById(e.target.id);
            clicked.classList.toggle('complete');
        }
        addItem()
    });

})();
