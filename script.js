const add = d=> document.querySelector(d);
const addBox = add(".add-box"), popupBox = add(".popup-box"), popupTitle = popupBox.querySelector("header p"), 
closeIcon = popupBox.querySelector("header i"), titleTag = popupBox.querySelector("input"), 
descTag = popupBox.querySelector("textarea"), addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"];

const notes = JSON.parse(localStorage.getItem("notes") || "[]");

let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    add("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    add("body").style.overflow = "auto";
});

const showNotes = () => {
    if(!notes) return;
    add(".note")?.forEach(li => li.remove());
    notes.forEach((n, id) => {
        const fD = n.description.replaceAll("\n", '<br/>');
        const lT = `<li class="note"><div class="details"><p>${n.title}</p><span>${fD}</span></div><div class="bottom-content"><span>${n.date}</span><div class="settings"><i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i><ul class="menu"><li onclick="updateNote(${id}, '${n.title}', '${fD}')"><i class="uil uil-pen"></i>Edit</li><li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li></ul></div></div></li>`;
        addBox.insertAdjacentHTML("afterend", lT);
    });
};
showNotes();

const showMenu = elem => {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => { if(e.target.tagName != "I" || e.target != elem) { elem.parentElement.classList.remove("show"); } });
};

const deleteNote = nId => {
    const cDel = confirm("Are you sure you want to delete this note?");
    if(!cDel) return;
    notes.splice(nId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
};

const updateNote = (nId, title, fD) => {
    const d = fD.replaceAll('<br/>', '\r\n');
    updateId = nId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = d;
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
};

addBtn.addEventListener("click", e => {
    e.preventDefault();
    const t = titleTag.value.trim(), d = descTag.value.trim();
    if(t || d) {
        const currentDate = new Date(), m = months[currentDate.getMonth()], day = currentDate.getDate(), year = currentDate.getFullYear();
        const noteInfo = {title: t, description: d, date: `${m} ${day}, ${year}`}
        if(!isUpdate) { notes.push(noteInfo); } 
        else { isUpdate = false; notes[updateId] = noteInfo; }
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
    }
});