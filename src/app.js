'use strict';
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.notes = [];
        this.noteContainer = document.querySelector('.note-container');
        this.addNoteBtn = document.querySelector('#add-note');
        this.create = function () {
            var now = new Date();
            var options = {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            };
            var hour = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var time = hour + ":" + minutes;
            var formattedDate = new Intl.DateTimeFormat('en-US', options).format(now);
            var dataID = (Date.now() + '').slice(-5);
            _this.render(dataID, 'Note', '', formattedDate, time);
        };
        this.render = function (id, title, content, date, time) {
            var template = document.getElementById('markup');
            var markup = template.content.cloneNode(true);
            var elements = [
                '.note',
                '.note-title',
                '.note-date',
                '.note-time',
                '.note-content',
            ];
            var _a = __read(elements.map(function (el) {
                return markup.querySelector(el);
            }), 5), containerEl = _a[0], titleEl = _a[1], dateEl = _a[2], timeEl = _a[3], contentEl = _a[4];
            containerEl.setAttribute('data-id', id);
            titleEl.value = title;
            dateEl.textContent = date;
            timeEl.textContent = time;
            contentEl.textContent = content;
            _this.noteContainer.prepend(markup);
            contentEl.focus();
        };
        this.addNoteBtn.addEventListener('click', this.create);
        this.delete();
        this.save();
        this.getLocalStorage();
    }
    App.getInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new App();
        return this.instance;
    };
    App.prototype.save = function () {
        var _this = this;
        this.noteContainer.addEventListener('click', function (e) {
            var clickedBtn = e.target.closest('.btn-note');
            if (!clickedBtn)
                return;
            /*==========  UI  ==========*/
            var thisTextArea = clickedBtn.parentElement
                .previousElementSibling;
            var thisInput = clickedBtn
                .closest('.card-body')
                .querySelector('input');
            thisTextArea.classList.toggle('textarea-blur');
            var _a = __read(clickedBtn.children, 2), editBtn = _a[0], saveBtn = _a[1];
            [editBtn, saveBtn].forEach(function (el) { return el.classList.toggle('d-none'); });
            if (!thisTextArea.classList.contains('textarea-blur'))
                thisTextArea.focus();
            [thisTextArea, thisInput].forEach(function (el) { return el.toggleAttribute('readonly'); });
            /*==========  Save Data  ==========*/
            var event = e.target;
            var getCardBody = event.closest('.card-body');
            var noteEl = event.closest('.note');
            var id = noteEl.dataset.id;
            var title = getCardBody.querySelector('.note-title').value;
            var date = getCardBody.querySelector('.note-date').textContent;
            var time = getCardBody.querySelector('.note-time').textContent;
            var content = getCardBody.querySelector('.note-content').value;
            var noteData = { title: title, date: date, time: time, content: content, id: id };
            if (editBtn.classList.contains('d-none'))
                return;
            var note = _this.notes.find(function (note) { return note.id === id; });
            var index = _this.notes.indexOf(note);
            if (index > -1)
                _this.notes.splice(index, 1);
            _this.notes.push(noteData);
            _this.setLocalStorage();
        });
    };
    App.prototype.delete = function () {
        var _this = this;
        /*==========  UI  ==========*/
        this.noteContainer.addEventListener('click', function (e) {
            var clickedBtn = e.target.closest('.delete-note');
            if (!clickedBtn)
                return;
            var theNoteEl = clickedBtn.parentElement.parentElement.parentElement;
            theNoteEl.style.opacity = '0';
            setTimeout(function () {
                theNoteEl.remove();
            }, 300);
            /*==========  Delete Data  ==========*/
            var noteEl = e.target.closest('.note');
            var note = _this.notes.find(function (note) { return note.id === noteEl.dataset.id; });
            var index = _this.notes.indexOf(note);
            if (index > -1)
                _this.notes.splice(index, 1);
            _this.setLocalStorage();
        });
    };
    App.prototype.setLocalStorage = function () {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    };
    App.prototype.getLocalStorage = function () {
        var _this = this;
        var notes = JSON.parse(localStorage.getItem('notes'));
        if (!notes)
            return;
        this.notes = notes;
        this.notes.forEach(function (note) {
            _this.render(note.id, note.title, note.content, note.date, note.time);
        });
        // click on all save buttons to load them saved
        document
            .querySelectorAll('.btn-note')
            .forEach(function (btn) { return btn.click(); });
    };
    return App;
}());
App.getInstance();
