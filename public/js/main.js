const nav = document.getElementById('nav');
const menu = document.getElementById('menu');
const innerMenu = document.getElementById('inner-menu');
menu.addEventListener('click', (e) => {
    nav.classList.toggle('show-mobile');
    document.getElementById('menu-icon').classList.toggle('hide');
});
innerMenu.addEventListener('click', (e) => {
    nav.classList.toggle('show-mobile');
    document.getElementById('menu-icon').classList.toggle('hide');
})
