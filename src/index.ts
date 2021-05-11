'use strict';

interface Note {
  title: string;
  content: string;
  date: string;
  time: string;
  id: string;
  text: string;
}

class App {
  private notes = [];
  private noteContainer = document.querySelector('.note-container')!;
  private addNoteBtn = document.querySelector('#add-note')!;
  private static instance: App;

  private constructor() {
    this.addNoteBtn.addEventListener('click', this.create.bind(this));
    this.delete();
    this.save();
    this.getLocalStorage();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new App();
    return this.instance;
  }

  private create(this: App) {
    const now = new Date();
    const options: object = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    // @ts-ignore
    const hour = String(now.getHours()).padStart(2, '0');
    // @ts-ignore
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const time = `${hour}:${minutes}`;
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(now);
    const dataID = (Date.now() + '').slice(-5);
    this.render(dataID, 'Note', '', formattedDate, time);
  }

  private render(
    this: App,
    id: string,
    title: string,
    content: string,
    date: string,
    time: string
  ) {
    const html = `<div
                    class="card col-md-6 mx-2 my-2 note transition"
                    data-id="${id}"
                  >
                    <div class="card-body">
                      <div class="d-flex justify-content-center">
                        <button class="btn m-0 p-0 shadow-none delete-note">
                          <img
                            alt=""
                            class="m-0 p-0"
                            src="icons/close.png"
                            style="max-width: 45%"
                          />
                        </button>
                        <input
                          class="card-title mt-0 text-center note-title"
                          maxlength="14"
                          type="text"
                          value="${title}"
                        />
                      </div>
                      <label for="content"></label>
                      <textarea
                        class="note-text"
                        cols="30"
                        dir="auto"
                        id="content"
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
                        <button class="btn shadow-none m-0 p-0 btn-note d-flex justify-content-center align-items-center"
                          
                        >
                          <img
                            alt=""
                            class="d-none edit-btn"
                            src="icons/pen.png"
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
    this.noteContainer.insertAdjacentHTML('afterbegin', html);
    document.querySelector('textarea')!.focus();
  }

  private save() {
    this.noteContainer.addEventListener('click', (e: Event) => {
      const clickedBtn = (e.target as Element).closest('.btn-note')!;
      if (!clickedBtn) return;

      /*==========  UI  ==========*/
      const thisTextArea = clickedBtn.parentElement!
        .previousElementSibling! as HTMLTextAreaElement;
      const thisInput = clickedBtn!
        .closest('.card-body')!
        .querySelector('input')! as HTMLInputElement;

      thisTextArea.classList.toggle('textarea-blur');
      // const [editBtn, saveBtn] = clickedBtn.children;
      const editBtn = clickedBtn.children[0];
      const saveBtn = clickedBtn.children[1];
      editBtn.classList.toggle('d-none');
      saveBtn.classList.toggle('d-none');
      if (!thisTextArea.classList.contains('textarea-blur'))
        thisTextArea.focus();
      thisTextArea.toggleAttribute('readonly');
      thisInput.toggleAttribute('readonly');

      /*==========  Save Data  ==========*/
      const getCardBody = (e.target! as Element).closest('.card-body')!;
      const noteEl = (e.target! as Element).closest('.note')! as HTMLElement;

      const id = noteEl.dataset.id;
      const title = (getCardBody.querySelector(
        '.note-title'
      ) as HTMLInputElement).value;
      const text = getCardBody.querySelector('textarea')!.value;
      const date = getCardBody.querySelector('.note-date')!.textContent;
      const time = getCardBody.querySelector('.note-time')!.textContent;

      const noteData = { title, text, date, time, id };

      if (editBtn.classList.contains('d-none')) return;
      // @ts-ignore
      const note = this.notes.find((note: Note) => note.id === id);
      // @ts-ignore
      const index = this.notes.indexOf(note);
      if (index > -1) this.notes.splice(index, 1);
      // @ts-ignore
      this.notes.push(noteData);
      this.setLocalStorage();
    });
  }

  private delete(this: App) {
    /*==========  UI  ==========*/
    this.noteContainer.addEventListener('click', (e: Event) => {
      const clickedBtn = (e.target as Element)!.closest('.delete-note');
      if (!clickedBtn) return;
      const theNoteEl = clickedBtn.parentElement!.parentElement!.parentElement!;
      theNoteEl.style.opacity = '0';
      setTimeout(function () {
        theNoteEl.remove();
      }, 300);

      /*==========  Delete Data  ==========*/
      const noteEl = (e.target as Element).closest('.note') as HTMLElement;
      // @ts-ignore
      const note = this.notes.find(
        (note: any) => note.id === noteEl.dataset.id
      );
      // @ts-ignore
      const index = this.notes.indexOf(note);
      if (index > -1) this.notes.splice(index, 1);
      this.setLocalStorage();
    });
  }

  private setLocalStorage(this: App) {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  private getLocalStorage(this: App) {
    const notes = JSON.parse(<string>localStorage!.getItem('notes'));

    if (!notes) return;

    this.notes = notes;
    this.notes.forEach((note: Note) => {
      this.render(note.id, note.title, note.text, note.date, note.time);
    });
    // click on all save buttons to load them saved
    document
      .querySelectorAll('.btn-note')
      .forEach(btn => (btn as HTMLButtonElement).click());
  }
}
App.getInstance();
