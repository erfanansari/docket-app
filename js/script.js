'use strict';
// assigning components to variables
const modalInput = document.querySelector('.modal-input');
const mainNoteDivChild = document.querySelector('.main-notes').childNodes[1];
const addNoteBtn = document.querySelector('#add-note');

/*==========  insert Notes in DOM  ==========*/
addNoteBtn.addEventListener('click', function () {
  /*==========  implement time  ==========*/
  const now = new Date();
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  const hour = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const format = new Intl.DateTimeFormat('en-US', options).format(now);

  const html = `<div class="card col-md-6 mx-2 my-2 note transition">
                    <div class="card-body">
                      <div class="d-flex justify-content-center">
                        <button class="btn m-0 p-0 shadow-none delete-note">
                          <i class="fa fa-times"></i>
                        </button>
                        <input
                          type="text"
                          class="card-title mt-0 text-center note-title"
                          maxlength="17"
                          value="Note title"
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
                      <textarea
                        class=""
                        name=""
                        id=""
                        cols="30"
                        rows="8"
                      ></textarea>
                      <div
                        class="d-flex justify-content-between align-items-center mb-4 mt-2"
                      >
                        <div class="d-flex flex-column justify-content-center">
                          <p class="m-0 date-p">${format}</p>
                          <small class="">${hour}:${minutes}</small>
                        </div>
                        <button
                          class="btn shadow-none m-0 p-0 btn-note d-flex justify-content-center align-items-center"
                        >
                          <i class="fas fa-pen d-none edit-btn"></i
                          ><i class="fa fa-check check-btn"></i>
                        </button>
                      </div>
                    </div>
                  </div>`;
  mainNoteDivChild.insertAdjacentHTML('afterbegin', html);

  const textArea = document.querySelector('textarea');
  textArea.focus();
  const editSaveBtn = document.querySelector('.btn-note');

  /*==========  save and edit handler  ==========*/

  editSaveBtn.addEventListener('click', function () {
    const thisTextArea = this.parentElement.previousElementSibling;
    thisTextArea.classList.toggle('textarea-blur');
    this.children[0].classList.toggle('d-none');
    this.children[1].classList.toggle('d-none');
    if (!thisTextArea.classList.contains('textarea-blur')) textArea.focus();
    thisTextArea.toggleAttribute('readonly');
  });

  const deleteNoteBtn = document.querySelector('.delete-note');
  deleteNoteBtn.addEventListener('click', function () {
    const theNoteEl = this.parentElement.parentElement.parentElement;
    theNoteEl.style.opacity = '0';
    setTimeout(function () {
      theNoteEl.remove();
    }, 300);
  });
});
