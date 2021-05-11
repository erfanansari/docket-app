'use strict';
var App = /** @class */ (function () {
    function App() {
        this.notes = [];
        this.noteContainer = document.querySelector('.note-container');
        this.addNoteBtn = document.querySelector('#add-note');
        this.addNoteBtn.addEventListener('click', this.create.bind(this));
        this["delete"]();
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
    App.prototype.create = function () {
        var now = new Date();
        var options = {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        };
        // @ts-ignore
        var hour = String(now.getHours()).padStart(2, '0');
        // @ts-ignore
        var minutes = String(now.getMinutes()).padStart(2, '0');
        var time = hour + ":" + minutes;
        var formattedDate = new Intl.DateTimeFormat('en-US', options).format(now);
        var dataID = (Date.now() + '').slice(-5);
        this.render(dataID, 'Note', '', formattedDate, time);
    };
    App.prototype.render = function (id, title, content, date, time) {
        var html = "<div\n                    class=\"card col-md-6 mx-2 my-2 note transition\"\n                    data-id=\"" + id + "\"\n                  >\n                    <div class=\"card-body\">\n                      <div class=\"d-flex justify-content-center\">\n                        <button class=\"btn m-0 p-0 shadow-none delete-note\">\n                          <img\n                            alt=\"\"\n                            class=\"m-0 p-0\"\n                            src=\"icons/close.png\"\n                            style=\"max-width: 45%\"\n                          />\n                        </button>\n                        <input\n                          class=\"card-title mt-0 text-center note-title\"\n                          maxlength=\"14\"\n                          type=\"text\"\n                          value=\"" + title + "\"\n                        />\n                      </div>\n                      <label for=\"content\"></label>\n                      <textarea\n                        class=\"note-text\"\n                        cols=\"30\"\n                        dir=\"auto\"\n                        id=\"content\"\n                        rows=\"8\"\n                      >\n" + content + "</textarea\n                      >\n                      <div\n                        class=\"d-flex justify-content-between align-items-center mb-4 mt-2\"\n                      >\n                        <div class=\"d-flex flex-column justify-content-center\">\n                          <p class=\"m-0 note-date\">" + date + "</p>\n                          <small class=\"note-time\">" + time + "</small>\n                        </div>\n                        <button class=\"btn shadow-none m-0 p-0 btn-note d-flex justify-content-center align-items-center\"\n                          \n                        >\n                          <img\n                            alt=\"\"\n                            class=\"d-none edit-btn\"\n                            src=\"icons/pen.png\"\n                            style=\"max-width: 60%\"\n                          />\n                          <img\n                            src=\"icons/check.png\"\n                            class=\"check-btn mw-100\"\n                            alt\n                          />\n                        </button>\n                      </div>\n                    </div>\n                  </div>";
        this.noteContainer.insertAdjacentHTML('afterbegin', html);
        document.querySelector('textarea').focus();
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
            // const [editBtn, saveBtn] = clickedBtn.children;
            var editBtn = clickedBtn.children[0];
            var saveBtn = clickedBtn.children[1];
            editBtn.classList.toggle('d-none');
            saveBtn.classList.toggle('d-none');
            if (!thisTextArea.classList.contains('textarea-blur'))
                thisTextArea.focus();
            thisTextArea.toggleAttribute('readonly');
            thisInput.toggleAttribute('readonly');
            /*==========  Save Data  ==========*/
            var getCardBody = e.target.closest('.card-body');
            var noteEl = e.target.closest('.note');
            var id = noteEl.dataset.id;
            var title = getCardBody.querySelector('.note-title').value;
            var text = getCardBody.querySelector('textarea').value;
            var date = getCardBody.querySelector('.note-date').textContent;
            var time = getCardBody.querySelector('.note-time').textContent;
            var noteData = { title: title, text: text, date: date, time: time, id: id };
            if (editBtn.classList.contains('d-none'))
                return;
            // @ts-ignore
            var note = _this.notes.find(function (note) { return note.id === id; });
            // @ts-ignore
            var index = _this.notes.indexOf(note);
            if (index > -1)
                _this.notes.splice(index, 1);
            // @ts-ignore
            _this.notes.push(noteData);
            _this.setLocalStorage();
        });
    };
    App.prototype["delete"] = function () {
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
            // @ts-ignore
            var note = _this.notes.find(function (note) { return note.id === noteEl.dataset.id; });
            // @ts-ignore
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
            _this.render(note.id, note.title, note.text, note.date, note.time);
        });
        // click on all save buttons to load them saved
        document
            .querySelectorAll('.btn-note')
            .forEach(function (btn) { return btn.click(); });
    };
    return App;
}());
App.getInstance();
