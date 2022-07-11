var introjs = 
introJs().setOptions({
    disableInteraction: true,
    showBullets: true,
    hidePrev: true,
    nextToDone: true,
    doneLabel: 'Let’s start!',
    steps: [{
        title: 'Welcome to the playground!',
        intro: "Here you can solve ARC tasks on your own. </br> Do you want to have a short introduction?"
    },
    {
        intro: "<ul> <b>An ARC task consists of several example tests of how to solve the task and usually one test that you must solve.</b> <li>Each test consists of one input - what it looks like before - and one output - what it should look like after. </li><li>Each test input consists of a grid with a certain height and width, where each of the cells can have one of ten colors.</li> <li>Your task is to find out how to transform the input to achieve the output, based on the examples! </li></ul>"
    },
    {
        element: document.querySelector('#demonstration_examples_view'),
        intro: "<ul> <b>Here you can see the example tests. </b><li>Each line stands for one example. Usually there are between two and five examples.</li> <li>Each example has its input on the left, which shows how it looks at the beginning, and its output on the right, which shows how it should look at the end.</li></ul>"
    },
    {
        element: document.querySelector('.evalution_input-outer'),
        intro: "<ul> <b>Here you see the input(s) for the test(s) you must solve. </b><li>From the examples you must find out how to transform the input to get the correct output.</li></ul> "
    },
    {
        element: document.querySelector('#editor_grid_control_btns'),
        intro: "<ul> <b>Here you can create the correct output for the test input just shown.</b><li>'Resize' allows you to adjust the height and broadness of the output field.</li><li>'Copy from input' lets you copy the input grid into the drawing field.</li> <li>'Reset Grid' lets you empty the grid and make it completely black. </li></ul>"
    },
    {
        element: document.querySelector('#toolbar_symbol_picker'),
        intro: "<ul> <b>Here you can select a color and the edit mode to change the color of the output cells. </b><li>'Edit' lets you fill a cell with the selected color when you click on that cell. </li><li>'Select' lets you fill several cells with one color by first dragging a frame over the cells by holding down the left mouse button and then clicking on that color. </li><li>'Fill' lets you fill a black area all at once.</li></ul>",
        position: 'left'
    },
    {
        element: document.querySelector('#submit_solution_btn'),
        intro: "<ul> <b> Here you can submit your solution to see if you are correct. </b><li>Even though you can make an infinite number of attempts - it's a playground - a task is only considered solved if you find the correct solutions within three submitted attempts.</li></ul>"
    },
    {
        element: document.querySelector('#evaluation_output_editor'),
        intro: "Here you can load another task by opening its *.json file or you can click on 'Random' to open a new random task."
    },
    {
        title: "That's it.",
        intro: " We hope you enjoy the tasks. </br>We wish you all the best!."
    },
]
})

window.onload = function () {
    if (localStorage.getItem("hasCodeRunBefore") === null) 
    {
        localStorage.setItem("hasCodeRunBefore", true);
        introjs.start();
    }
    else if (localStorage.getItem("hasCodeRunBefore") != null)
    {
        $('#tutorialpopup').click(function(){
            introjs.refresh();
        });
    }
}