(function(){
    const todo = document.getElementById('todo');
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

    function addTodo (userInput){
        let ranID = Math.random().toString(36).substring(7);
        const li = document.createElement('li');
        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        label.id = ranID;
        label.className += 'check-container';
        input.type = 'checkbox'
        span.className += 'checkmark';

        label.textContent = userInput + ` (${new Date().toDateString()})`;

        li.appendChild(label);
        label.appendChild(input);
        label.appendChild(span)
        return li;
    }

    existingTodo ? existingTodo.forEach(item => {
        list.appendChild(setUp(item.id, item.text, item.checked))
    }) : false;

    todo.onkeydown = (e) => {
        if (e.keyCode == 13) {
            const item = addTodo(todo.value);
            list.appendChild(item);
            addItem()
            todo.value = '';
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
