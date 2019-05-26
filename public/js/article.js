const sidebar = document.getElementById('sidebar');
const h1 = document.getElementsByTagName('h1');
const h2 = document.getElementsByTagName('h2');
const h3 = document.getElementsByTagName('h3');
const h4 = document.getElementsByTagName('h4');
const h5 = document.getElementsByTagName('h5');
const h6 = document.getElementsByTagName('h6');

let headings = [...h1, ...h2, ...h3, ...h4, ...h5, ...h6];
headings = headings.sort((a, b) => (
    a.offsetTop - b.offsetTop
))
function createSidebarLinks(heading){
    const li = document.createElement('li');
    const a = document.createElement('a');
    li.appendChild(a);
    a.textContent = heading.textContent;
    a.href = '#' + heading.id;
    return li;
}

const sidebarLinks = headings.map(ele => createSidebarLinks(ele));
sidebarLinks.forEach(link => {
    sidebar.appendChild(link);
})
