'use strict';
// assigning components to variables
const modalInput = document.querySelector('.modal-input');
const mainNoteDivChild = document.querySelector('.main-notes').childNodes[1];
const addNoteBtn = document.querySelector('#add-note');
let input;
let textarea;
let datePTage;
let hourSmallTag;

// i = -1 because arrays are zero based

let i = -1;
const allNotes = [];

/*==========  implement time  ==========*/

const now = new Date();
const options = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const clock = `${hours}:${minutes}`;
console.log(clock);
const format = new Intl.DateTimeFormat('en-US', options).format(now);

/*==========  create note  ==========*/

const createNote = function (
  titleValue,
  textValue,
  date,
  clock,
  blur = '',
  toggleread
) {
  const div = document.createElement('div');
  div.classList.add('card', 'col-md-6', 'mx-2', 'my-2', 'note', 'transition');
  div.innerHTML = `<div class="card-body">
                      <div class="d-flex justify-content-center">
                        <button class="btn m-0 p-0 shadow-none delete-note">
                          <i class="fa fa-times"></i>
                        </button>
                        <input
                          data-number = "${i}"
                          type="text"
                          class="card-title mt-0 text-center note-title"
                          maxlength="17"
                          value=${titleValue}
                        />
                        <div class="visually-hidden">
                          <span class="change-color"
                            ><i class="fa fa-chevron-left"></i
                          ></span>
                          <ul
                            class="position-absolute list-unstyled change-color-ul"
                          >
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                          </ul>
                        </div>
                      </div>
                      <label for=""></label>
                      <textarea ${toggleread}
                        data-number = "${i}"
                        class="${blur}"
                        cols="30"
                        rows="8"
                      >${textValue}</textarea>
                      <div
                        class="d-flex justify-content-between align-items-center mb-4 mt-2"
                      >
                        <div class="d-flex flex-column justify-content-center">
                          <p class="m-0 date-p">${date}</p>
                          <small class="hour">${clock}</small>
                        </div>
                        <button
                          class="btn shadow-none m-0 p-0 btn-note d-flex justify-content-center align-items-center"
                        >
                          <i class="fas fa-pen d-none edit-btn"></i
                          ><i class="fa fa-check check-btn"></i>
                        </button>
                    </div>
                  </div>`;
  input = div.querySelector('input');
  textarea = div.querySelector('textarea');
  datePTage = div.querySelector('.date-p');
  hourSmallTag = div.querySelector('.hour');
  mainNoteDivChild.prepend(div);
};

// add note button
addNoteBtn.addEventListener('click', function () {
  i++;

  // create note

  createNote('Note', '', format, clock);

  /*==========  save and edit handler  ==========*/
  checkBtn();

  /*==========  delete note  ==========*/

  deleteNote();
});

// save and edit button
const checkBtn = function () {
  const editSaveBtn = document.querySelector('.btn-note');

  editSaveBtn.addEventListener('click', function () {
    const thisTextArea = this.parentElement.previousElementSibling;
    thisTextArea.classList.toggle('textarea-blur');
    this.children[0].classList.toggle('d-none');
    this.children[1].classList.toggle('d-none');
    if (!thisTextArea.classList.contains('textarea-blur')) textarea.focus();
    thisTextArea.toggleAttribute('readonly');

    /*==========  save notes  ==========*/
    const titleValue = input.value;
    const textValue = textarea.value;
    const dateValue = datePTage.textContent;
    const hourValue = hourSmallTag.textContent;
    const note = { titleValue, textValue, dateValue, hourValue, noteNumber: i };
    if (!allNotes[i] && this.children[1].classList.contains('d-none')) {
      allNotes.push(note);

      // console.log(note);
      // console.log(allNotes);
      localStorage.setItem('data', JSON.stringify(allNotes));
    }
    if (note !== allNotes[i] && this.children[1].classList.contains('d-none')) {
      allNotes.pop();
      allNotes.push(note);
      localStorage.setItem('data', JSON.stringify(allNotes));
    }
    console.log(allNotes);
    // console.log(!allNotes[i]);
    // console.log(note !== allNotes[i]);
  });
};

// delete note

const deleteNote = function () {
  const deleteNoteBtn = document.querySelector('.delete-note');
  deleteNoteBtn.addEventListener('click', function () {
    const theNoteEl = this.parentElement.parentElement.parentElement;
    theNoteEl.style.opacity = '0';
    setTimeout(function () {
      theNoteEl.remove();
    }, 300);
  });
};

window.onload = function () {
  const data = JSON.parse(localStorage.getItem('data'));
  console.log(data);

  // Guard clause
  if (!data) return;
  data.forEach(function (el) {
    console.log(el);
    createNote(
      el.titleValue,
      el.textValue,
      el.dateValue,
      el.hourValue,
      'textarea-blur',
      'readonly'
    );
    checkBtn();
    deleteNote();
  });
};
