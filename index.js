let lines = [
    { id: generateString(5), value: "Hey, you're not permitted in there." },
    {
        id: generateString(5),
        value: "It's restricted. You'll be deactivated for sure..",
    },
    {
        id: generateString(5),
        value: "Don't call me a mindless philosopher, you overweight glob of grease! Now come out before somebody sees you.",
    },
    {
        id: generateString(5),
        value: " Secret mission? What plans? What are you talking about? I'm not getting in there! I'm going to regret this.",
    },
    { id: generateString(5), value: 'There goes another one.' },
    { id: generateString(5), value: 'Hold your fire.' },
    { id: generateString(5), value: 'There are no life forms.' },
];

function generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const scriptElement = document.querySelector('.script');

function render() {
    const html = lines
        .map(
            (line) =>
                `<div class="line-item" key="${line.id}">
                    <div class="line-content">
                        ${line.value}
                    </div>
                    <div class="control-box">
                        <button class="modify-button" key="${line.id}">Modify</button>
                        <button class="remove-button" key="${line.id}">Remove</button>
                    </div>
                </div>`
        )
        .join('');

    scriptElement && (scriptElement.innerHTML = html);
}
render();

// search and mark text
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-button');
const lineContentElements = document.querySelectorAll('.line-content');
let lineItemElements = document.querySelectorAll('.line-item');

searchBtn && searchBtn.addEventListener('click', search);
searchInput && searchInput.addEventListener('keyup', search);
searchInput && searchInput.addEventListener('input', search);

let selectionText = '';

document.addEventListener('selectionchange', (event) => {
    selectionText = document.getSelection().toString();
});

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.code === 'KeyB') {
        searchInput.focus();
        searchInput.value = selectionText;
    }
});

function search() {
    clearAllMarks();
    if (!searchInput.value.trim()) {
        clearAllMarks();
    } else {
        for (let lineElement of lineContentElements) {
            let line = lineElement.innerHTML;
            let search = searchInput.value;
            if (lineElement && line.toLowerCase().includes(search.toLowerCase())) {
                lineElement.innerHTML = mark(search, line);
            } else {
                clearMark(lineElement);
            }
        }
    }
}

function mark(substr, str) {
    let searchPos = str.toLowerCase().indexOf(substr.toLowerCase());
    if (searchPos === -1) return str;

    return (
        str.slice(0, searchPos) +
        `<span class="marked">${str.slice(searchPos, searchPos + substr.length)}</span>` +
        mark(substr, str.slice(searchPos + substr.length))
    );
}

function clearAllMarks() {
    for (let lineElement of lineContentElements) {
        lineElement.innerHTML = lineElement.innerHTML.replaceAll('<span class="marked">', '');
        lineElement.innerHTML = lineElement.innerHTML.replaceAll('</span>', '');
    }
}

function clearMark(lineElement) {
    lineElement.innerHTML = lineElement.innerHTML.replaceAll('<span class="marked">', '');
    lineElement.innerHTML = lineElement.innerHTML.replaceAll('</span>', '');
}
// search and mark text

// crud
const generalInput = document.querySelector('.general-input');
const createBtn = document.querySelector('.create-button');
const submitBtn = document.querySelector('.submit-button');
const removeBtns = document.querySelectorAll('.remove-button');
const modifyBtns = document.querySelectorAll('.modify-button');
let isCreation = true;
let isEdition = false;
let tempId = null;

createBtn && createBtn.addEventListener('click', create);
submitBtn && submitBtn.addEventListener('click', submit);

modifyBtns.forEach((btn) => btn.addEventListener('click', modify));
removeBtns.forEach((btn) => btn.addEventListener('click', remove));

function create() {
    generalInput.value = '';
    isCreation = true;
}

function modify(event) {
    generalInput.value = '';
    isCreation = false;
    isEdition = true;
    tempId = event.target.getAttribute('key');

    const modifiedElement = Array.from(lineItemElements).find(
        (lineElement) => lineElement.getAttribute('key') === event.target.getAttribute('key')
    );

    generalInput.value = modifiedElement.querySelector('.line-content').innerHTML.trim();
}

function remove(event) {
    const removedElement = Array.from(lineItemElements).find(
        (lineElement) => lineElement.getAttribute('key') === event.target.getAttribute('key')
    );

    if (confirm('Are you sure that you want to delete this item?')) {
        removedElement.remove();
        lines.splice(
            lines.indexOf(lines.find((line) => line.id === event.target.getAttribute('key'))),
            1
        );
    }
}

function submit() {
    if (!generalInput.value.trim()) return;
    else {
        if (isCreation) {
            let id = generateString(5);
            let newLineElement = document.createElement('div');

            newLineElement.classList.add('line-item');
            newLineElement.setAttribute('key', id);
            newLineElement.innerHTML = ` 
            <div class="line-content" >${generalInput.value}</div>
            <div class="control-box">
                <button class="modify-button" key="${id}">Modify</button>
                <button class="remove-button" key="${id}">Remove</button>
            </div>`;
            lines.push({ id, value: generalInput.value });
            scriptElement.append(newLineElement);

            generalInput.value = '';
            lineItemElements = document.querySelectorAll('.line-item');
            lineItemElements[lineItemElements.length - 1]
                .querySelector('.modify-button')
                .addEventListener('click', modify);
            lineItemElements[lineItemElements.length - 1]
                .querySelector('.remove-button')
                .addEventListener('click', remove);
        } else {
            if (tempId != null && isEdition) {
                const modifiedElement = Array.from(lineItemElements).find(
                    (lineElement) => lineElement.getAttribute('key') === tempId
                );

                lines.find((line) => line.id === tempId).value = generalInput.value;

                modifiedElement.querySelector('.line-content').innerHTML = generalInput.value;
                tempId = null;
                isEdition = false;
                isCreation = true;
                generalInput.value = '';
            }
        }
    }
}
// crud
