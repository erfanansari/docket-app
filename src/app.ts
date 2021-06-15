'use strict';

interface Note {
  title: string;
  date: string;
  time: string;
  content: string;
  id: string;
}

class App {
  private notes: Note[] = [];
  private noteContainer = document.querySelector('.note-container')!;
  private addNoteBtn = document.querySelector('#add-note')!;
  private static instance: App;

  private constructor() {
    this.addNoteBtn.addEventListener('click', this.create);
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

  private create = () => {
    const now = new Date();
    const options: object = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    const hour = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const time = `${hour}:${minutes}`;
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(now);
    const dataID = (Date.now() + '').slice(-5);
    this.render({
      id: dataID,
      title: 'Note',
      content: '',
      date: formattedDate,
      time,
    });
  };

  private render = ({ id, title, content, date, time }: Note) => {
    const template = document.getElementById('markup')! as HTMLTemplateElement;
    const markup = template.content.cloneNode(true) as HTMLElement;
    const elements = [
      '.note',
      '.note-title',
      '.note-date',
      '.note-time',
      '.note-content',
    ];
    const [containerEl, titleEl, dateEl, timeEl, contentEl] = elements.map(el =>
      markup.querySelector(el)
    );
    containerEl.setAttribute('data-id', id);
    titleEl.value = title;
    dateEl.textContent = date;
    timeEl.textContent = time;
    contentEl.textContent = content;
    this.noteContainer.prepend(markup);
    contentEl.focus();
  };

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
      const [editBtn, saveBtn] = clickedBtn.children;
      [editBtn, saveBtn].forEach(el => el.classList.toggle('d-none'));
      if (!thisTextArea.classList.contains('textarea-blur'))
        thisTextArea.focus();
      [thisTextArea, thisInput].forEach(el => el.toggleAttribute('readonly'));

      /*==========  Save Data  ==========*/
      const event = e.target! as Element;
      const getCardBody = event.closest('.card-body')!;
      const noteEl = event.closest('.note')! as HTMLElement;
      const id = noteEl.dataset.id;
      const title = (getCardBody.querySelector(
        '.note-title'
      ) as HTMLInputElement).value;

      const date = getCardBody.querySelector('.note-date')!.textContent;
      const time = getCardBody.querySelector('.note-time')!.textContent;
      const content = (getCardBody.querySelector(
        '.note-content'
      )! as HTMLTextAreaElement).value;

      const noteData = { title, date, time, content, id } as Note;

      if (editBtn.classList.contains('d-none')) return;
      const note = this.notes.find((note: Note) => note.id === id)!;
      const index = this.notes.indexOf(note);
      if (index > -1) this.notes.splice(index, 1);
      this.notes.push(noteData);
      this.setLocalStorage();
    });
  }

  private delete() {
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
      const note = this.notes.find(
        (note: Note) => note.id === noteEl.dataset.id
      )!;
      const index = this.notes.indexOf(note);
      if (index > -1) this.notes.splice(index, 1);
      this.setLocalStorage();
    });
  }

  private setLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  private getLocalStorage() {
    const notes = JSON.parse(<string>localStorage.getItem('notes')) as Note[];

    if (!notes) return;

    this.notes = notes;
    this.notes.forEach(({ id, title, content, date, time }) => {
      this.render({ id, title, content, date, time });
    });
    // click on all save buttons to load them saved
    document
      .querySelectorAll('.btn-note')
      .forEach(btn => (btn as HTMLButtonElement).click());
  }
}

App.getInstance();
