(function(){

    function List() {
        this.listID = Math.random().toString(36).substring(7);

        this.todoInput = document.createElement('input');
        this.todoInput.type = 'text';
        this.todoInput.className = 'big-input';
        this.todoInput.placeholder = 'I have to...';
        this.todoInput.autofocus = true;
        this.todoInput.autocomplete = false;

        this.listDiv = document.createElement('div');
        this.container = document.getElementById('todo-container');
        this.container.appendChild(this.listDiv);

        this.ul = document.createElement('ul');
        this.ul.classList = 'list'
        this.storage = window.localStorage;
        this.existingTodo = this.storage.todo ? JSON.parse(this.storage.todo) : false;

        this.bottom = document.createElement('div');
        this.bottom.className = 'bottom';
        this.clear = document.createElement('button');
        this.clear.type = 'button';
        this.clear.id = 'clear-todo';
        this.clear.className = 'clear';
        this.clear.textContent = 'Clear';
        this.bottom.appendChild(this.clear);

        this.setUp = function (id, text, checked){
            // Set's up the list saved in localStorage
            this.li = document.createElement('li');
            this.label = document.createElement('label');
            this.input = document.createElement('input');
            this.span = document.createElement('span');
            this.label.id = id;
            this.label.className = 'check-container';
            this.input.type = 'checkbox';
            if(checked){
                this.label.classList.toggle('complete');
                this.input.checked = checked;
            }
            this.span.className = 'checkmark';

            this.label.textContent = text;

            this.li.appendChild(this.label);
            this.label.appendChild(this.input);
            this.label.appendChild(this.span)
            return this.li;
        };

        this.addItem = function (){
            // Add's or updates an item to localStorage
            // Will update when an item is checked
            let children = this.ul.children;
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
            return this.storage.setItem('todo', userItems);
        };

        this.clearTodoList = function (){
            this.ul.innerHTML = ''
            return this.storage.clear();
        };

        this.todoInput.onkeydown = (e) => {
           if (e.keyCode == 13) { // enter key
               const todo = new Todo();
               if(todo.add(this.todoInput.value)){
                   this.ul.appendChild(todo.add(this.todoInput.value));
                   this.todoInput.value = ''; // input field value
                   return this.addItem()
               };
               return;
           }
       };

        this.ul.id = this.listID;
        this.listDiv.appendChild(this.todoInput);
        this.listDiv.appendChild(this.ul);
        this.listDiv.appendChild(this.bottom);

        this.existingTodo ? this.existingTodo.forEach(todo => {
            this.ul.appendChild(this.setUp(todo.id, todo.text, todo.checked))
        }) : false;

        this.clear.addEventListener('click', () => {
            return this.clearTodoList();
        });

        this.ul.addEventListener('click', e => {
            if(e.target.tagName === 'LABEL'){
                const clicked = document.getElementById(e.target.id);
                clicked.classList.toggle('complete');
            }
            return this.addItem()
        });
    }

    function Todo (){
        this.randomID = Math.random().toString(36).substring(7);
        this.li = document.createElement('li');
        this.label = document.createElement('label');
        this.input = document.createElement('input');
        this.span = document.createElement('span');

        this.add = function(userInput){
            this._hasContent = function(){
                if(userInput){
                    return true;
                }
                else{
                    return false;
                };
            }
            if(this._hasContent(this.userInput)){
                this.label.id = this.randomID;
                this.label.className = 'check-container';
                this.input.type = 'checkbox'
                this.span.className = 'checkmark';

                this.label.textContent = userInput + ` (${new Date().toDateString()})`;

                this.li.appendChild(this.label);
                this.label.appendChild(this.input);
                this.label.appendChild(this.span)
                return this.li;
            }
            return false;
        }
    }

    new List();

})();
