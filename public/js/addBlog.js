(function(){
    const prompt = document.getElementById('writing-prompt')
    const content = document.getElementById('blog-content')

    prompt.addEventListener('keyup', () => {
        content.innerHTML = marked(prompt.value);
    })
})();
