var introjs = 
introJs().setOptions({
    disableInteraction: true,
    showBullets: true,
    dontShowAgain: true,
    hidePrev: true,
    nextToDone: true,
    doneLabel: 'Let’s start!',
    steps: [{
        intro: "Welcome to the playground! </br></br> Here you can solve ARC tasks on your own. </br></br> Do you want to have a short introduction?"
    },
    {
        intro: "An ARC task consists of several example tests of how to solve the task and usually one test that you must solve. </br></br>Each test consists of one input - what it looks like before - and one output - what it should look like after. </br></br>Each test input consists of a grid with a certain height and width, where each of the cells can have one of ten colors. </br></br>Your task is to find out how to transform the input to achieve the output, based on the examples!"
    },
    {
        element: document.querySelector('#demonstration_examples_view'),
        intro: "Here you can see the example tests. </br></br>Each line stands for one example. Usually there are between two and five examples. </br></br>Each example has its input on the left, which shows how it looks at the beginning, and its output on the right, which shows how it should look at the end"
    },
    {
        element: document.querySelector('.evalution_input-outer'),
        intro: "Here you see the input(s) for the test(s) you must solve. </br></br>From the examples you must find out how to transform the input to get the correct output. "
    },
    {
        element: document.querySelector('#editor_grid_control_btns'),
        intro: "Here you can create the correct output for the test input just shown. </br></br>'Copy from input' lets you copy the input grid into the drawing field. </br></br>'Reset Grid' lets you empty the grid and make it completely black. </br></br>'Resize' allows you to adjust the height and broadness of the output field."
    },
    {
        element: document.querySelector('#symbol_picker'),
        intro: "Here you can select a color and the edit mode to change the color of the output cells. </br></br>'Edit' lets you fill a cell with the selected color when you click on that cell. </br></br>'Select' lets you fill several cells with one color by first dragging a frame over the cells by holding down the left mouse button and then clicking on that color. </br></br>'Fill' lets you fill a black area all at once."
    },
    {
        element: document.querySelector('#submit_solution_btn'),
        intro: "Here you can submit your solution to see if you are correct. </br></br>Even though you can make an infinite number of attempts - it's a playground - a task is only considered solved if you find the correct solutions within three submitted attempts."
    },
    {
        element: document.querySelector('#evaluation_output_editor'),
        intro: "Here you can load another task by opening its *.json file or you can click on 'Random' to open a new random task."
    },
    {
        intro: "That's it. </br></br>We hope you enjoy the tasks. </br></br>We wish you all the best!."
    },
]
})
introjs.start();
