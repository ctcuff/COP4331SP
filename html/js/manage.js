const openButtons = document.querySelectorAll('[data-btn-target]');
const closeButtons = document.querySelectorAll('[data-close-btn]');
const overlay = document.getElementById('overlay');

openButtons.forEach(button => {
    button.addEventListener('click', () => {
        const btn = document.querySelector(button.dataset.btnTarget)
        openButton(btn);
    })
})

overlay.addEventListener('click', () => {
    const buttons = document.querySelectorAll('.btn.active')
    buttons.forEach(button => {
        closeButton(button);
    })
})

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const btn = button.closest('.btn');
        closeButton(btn);
    })
})

function openButton(button)
{
    if (button == null) return;
    button.classList.add('active');
    overlay.classList.add('active');
}

function closeButton(button)
{
    if (button == null) return;
    button.classList.remove('active');
    overlay.classList.remove('active');
}
