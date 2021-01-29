"use strict"
// assigning components to variables
const modalInput = document.querySelector('.modal-input');
const mainNoteDivChild = document.querySelector('.main-notes').childNodes[1];
const welcomeDiv = document.querySelector('.welcome-div')
const continueBtn = document.querySelector('#continue');
const addNoteBtn = document.querySelector('#add-note');
// welcome input
// document.addEventListener('readystatechange', () => document.querySelector('.modal-trigger').click())

// insert welcome in DOM
continueBtn.addEventListener('click', function () {
    const enteredName = modalInput.value;
    const html = `<h5>Welcome ${enteredName}</h5>`;
    welcomeDiv.insertAdjacentHTML('afterbegin', html);
})

// insert Notes in DOM
addNoteBtn.addEventListener('click', function () {
    const html = `   <div class="card col-md-6 mx-2 my-2 note"
                                     style="transition: all ease 0.3s; max-width: 23%">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-center">
                                            <button class="btn m-0 p-0 shadow-none delete-note"><i class="fa fa-times"
                                            ></i></button>
                                            <input type="text" class="card-title mt-0 text-center note-title" maxlength="17" value="Note title">
                                            <div class="visually-hidden"><span class="change-color"><i class="fa fa-chevron-left"></i></span>
                                                <ul class="position-absolute list-unstyled change-color-ul">
                                                    <li>1</li>
                                                    <li>2</li>
                                                    <li>3</li>
                                                    <li>4</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <label for=""></label>
                                        <textarea class="" name="" id="" cols="30"
                                                  rows="8"></textarea>
                                        <div class="d-flex justify-content-between align-items-center mb-4 mt-2">
                                            <p class="m-0 date-p">May 25,2020</p>
                                            <button class="btn shadow-none m-0 p-0 btn-note d-flex justify-content-center align-items-center">
                                                <i
                                                        class="fas fa-pen d-none edit-btn"></i><i
                                                    class="fa fa-check check-btn"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>`;
    mainNoteDivChild.insertAdjacentHTML('afterbegin', html)

    const textArea = document.querySelector('textarea');
    textArea.focus()
    const editCheckBtn = document.querySelector('.btn-note')

    // save and edit handler
    editCheckBtn.addEventListener('click', function () {
        const thisTextArea = this.parentElement.previousElementSibling;
        thisTextArea.classList.toggle('textarea-blur');
        this.children[0].classList.toggle('d-none')
        this.children[1].classList.toggle('d-none')
        if (!thisTextArea.classList.contains('textarea-blur'))
            textArea.focus();
        thisTextArea.toggleAttribute('readonly')
    })


    const deleteNoteBtn = document.querySelector('.delete-note');
    deleteNoteBtn.addEventListener('click', function () {
        const theNoteEl = this.parentElement.parentElement.parentElement;
        theNoteEl.style.opacity = '0';
        setTimeout(function () {
            theNoteEl.remove();
        }, 300)
    })

    // check characters in title and submit by enter
    const noteTitle = document.querySelector('.note-title');
    noteTitle.addEventListener('keydown',function (e){
        if(e.key==='Enter'){e.preventDefault()
            textArea.focus();
        }
    })
})

