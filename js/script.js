'use strict';

class App {
  #notes = [];
  #mainNotesDiv = document.querySelector('.main-notes');
  #addNoteBtn = document.querySelector('#add-note');
  constructor() {
    this.#addNoteBtn.addEventListener('click', this._createNote.bind(this));
    this._deleteNote();
    this._saveNote();
    this._getLocalStorage();
  }
  _createNote() {
    const now = new Date();
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    const hour = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const time = `${hour}:${minutes}`;
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(now);
    const dataID = (Date.now() + '').slice(-5);
    this._renderNote(dataID, 'Note', '', formattedDate, time, '');
  }
  _renderNote(id, title, content, date, time) {
    const html = `<div
                    class="card col-md-6 mx-2 my-2 note transition"
                    data-id="${id}"
                  >
                    <div class="card-body">
                      <div class="d-flex justify-content-center">
                        <button class="btn m-0 p-0 shadow-none delete-note">
                          <img
                            src="icons/close.png"
                            alt=""
                            style="max-width: 45%"
                            class="m-0 p-0"
                          />
                        </button>
                        <input
                          type="text"
                          class="card-title mt-0 text-center note-title"
                          maxlength="17"
                          value="${title}"
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
                      <label for="content"></label>
                      <textarea
                        class="note-text"
                        id="content"
                        cols="30"
                        rows="8"
                      >
${content}</textarea
                      >
                      <div
                        class="d-flex justify-content-between align-items-center mb-4 mt-2"
                      >
                        <div class="d-flex flex-column justify-content-center">
                          <p class="m-0 note-date">${date}</p>
                          <small class="note-time">${time}</small>
                        </div>
                        <button
                          class="btn shadow-none m-0 p-0 btn-note d-flex justify-content-center align-items-center"
                        >
                          <img
                            src="icons/pen.png"
                            class="d-none edit-btn"
                            alt=""
                            style="max-width: 60%"
                          />
                          <img
                            src="icons/check.png"
                            class="check-btn mw-100"
                            alt
                          />
                        </button>
                      </div>
                    </div>
                  </div>`;
    this.#mainNotesDiv.insertAdjacentHTML('afterbegin', html);
    document.querySelector('textarea').focus();
  }
  _saveNote() {
    this.#mainNotesDiv.addEventListener(
      'click',
      function (e) {
        const clickedBtn = e.target.closest('.btn-note');
        if (!clickedBtn) return;

        /*==========  UI  ==========*/
        const thisTextArea = clickedBtn.parentElement.previousElementSibling;
        const thisInput = clickedBtn
          .closest('.card-body')
          .querySelector('input');

        thisTextArea.classList.toggle('textarea-blur');
        clickedBtn.children[0].classList.toggle('d-none');
        clickedBtn.children[1].classList.toggle('d-none');
        if (!thisTextArea.classList.contains('textarea-blur'))
          thisTextArea.focus();
        thisTextArea.toggleAttribute('readonly');
        thisInput.toggleAttribute('readonly');

        /*==========  Save Data  ==========*/
        const getCardBody = e.target.closest('.card-body');

        const noteID = e.target.closest('.note').dataset.id;
        const noteTitle = getCardBody.querySelector('.note-title').value;
        const noteText = getCardBody.querySelector('textarea').value;
        const noteDate = getCardBody.querySelector('.note-date').textContent;
        const noteTime = getCardBody.querySelector('.note-time').textContent;

        const noteData = { noteTitle, noteText, noteDate, noteTime, noteID };

        // Guaurd cluase if check icon is there do the rest
        if (clickedBtn.children[0].classList.contains('d-none')) return;
        const noteEl = e.target.closest('.note');
        let note = this.#notes.find(note => note.noteID === noteEl.dataset.id);
        const index = this.#notes.indexOf(note);
        index > -1 && this.#notes.splice(index, 1);
        // if (index > -1) this.#notes.splice(index, 1); same as the top line
        this.#notes.push(noteData);
        this._setLocalStorage();
      }.bind(this)
    );
  }
  _deleteNote() {
    /*==========  UI  ==========*/
    this.#mainNotesDiv.addEventListener(
      'click',
      function (e) {
        const btnDelete = document.querySelector('.delete-note');
        const clickedBtn = e.target.closest('.delete-note');
        if (!clickedBtn) return;
        const thisBtn = e.currentTarget;
        const theNoteEl = clickedBtn.parentElement.parentElement.parentElement;
        theNoteEl.style.opacity = '0';
        setTimeout(function () {
          theNoteEl.remove();
        }, 300);

        /*==========  Delete Data  ==========*/
        const noteEl = e.target.closest('.note');
        let note = this.#notes.find(note => note.noteID === noteEl.dataset.id);
        const index = this.#notes.indexOf(note);
        index > -1 && this.#notes.splice(index, 1);

        this._setLocalStorage();
      }.bind(this)
    );
  }
  _setLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(this.#notes));
  }
  _getLocalStorage() {
    const notes = JSON.parse(localStorage.getItem('notes'));

    if (!notes) return;

    this.#notes = notes;
    this.#notes.forEach(note => {
      this._renderNote(
        note.noteID,
        note.noteTitle,
        note.noteText,
        note.noteDate,
        note.noteTime
      );
    });
    // click on all save btns to load them saved
    document.querySelectorAll('.btn-note').forEach(btn => btn.click());
  }
}
const app = new App();
