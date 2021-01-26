'use strict'
const modalInput = document.querySelector('.modal-input');
const mainNoteDiv = document.querySelector('.main-notes').childNodes[1];
const welcomeDiv = document.querySelector('.welcome-div')
const continueBtn = document.querySelector('#continue');
const addNoteBtn = document.querySelector('#add-note');
// document.addEventListener('readystatechange',()=>document.querySelector('.modal-trigger').click())


continueBtn.addEventListener('click', function () {
    const enteredName = modalInput.value;

    const html = `<h5>Welcome back ${enteredName}</h5>`;
    welcomeDiv.insertAdjacentHTML('afterbegin', html);
})

addNoteBtn.addEventListener('click', () => {
    const html = `<div class="card col-md-6 mx-2 my-2" style=" max-width: 23%">
                                    <div class="card-body">

                                        <h5 class="card-title my-0">Card title</h5>
                                        <label for=""></label>
                                        <textarea class="" name="" id="" cols="30"
                                                  rows="8"></textarea>
                                        <div class="d-flex justify-content-between align-items-center mb-4 mt-2">
                                            <p class="m-0 date-p">May 25,2020</p>
                                            <button class="btn shadow-none m-0 p-0 btn-edit"><i
                                                    class="fas fa-pen"></i></button>
                                        </div>
                                    </div>
                                </div>`;
    mainNoteDiv.insertAdjacentHTML('afterbegin', html)
})