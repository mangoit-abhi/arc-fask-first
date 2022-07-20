var introjs = 
introJs().setOptions({
    disableInteraction: true,
    showBullets: true,
    hidePrev: true,
    nextToDone: true,
    doneLabel: 'Let’s start!',
    steps: [{
        title: 'Welcome to the Task Editor! ',
        intro: "Here you can create your own ARC tasks and submit them to be part of the new ARC 2 dataset. </br> The new ARC 2 dataset should be more diverse and even more challenging than the current one and should be generated by all of you. Hence, we are happy to get as creative and challenging tasks as possible from you. "
    },
    {
        element: document.querySelector('#grids_space'),
        intro: "Here you can draw your own test set. </br>The test input is on the left, and the result is on the right. "
    },
    {
        element: document.querySelector('#toolbar_color_input'),
        intro: "<b>Here you can determine the grid size and draw with different colors.</b><ul><li>In the upper row, you can resize the grid (from 1x1 to 30x30 cells), reset the grid back to an empty black one, and copy the grid from the other side.</li><li>In the bottom row, you can select different colors and color the grid cells with three different modes.</li></ul>"
    },
    {
        element: document.querySelector('#toolbar_expression_input'),
        intro: "<b>Here you can fill the grid with noise and patterns.</b> <ul><li>With the two noise functions in the upper row, you can add noise in the selected color or randomly in all colors.</li><li>In the bottom row, you can draw patterns by writing a formula in the field, where 'i' is for the rows and 'j' for the columns. Try out different functions to draw your own patterns.</li></ul>"
    },
    {
        element: document.querySelector('#delete_mark_as_test_pairs'),
        intro: "Here you can delete the pair or mark it as a test pair. </br>Deleting the pair allows you to remove it from your ARC task, e.g., in case you have drawn another, better pair. </br>Marking a pair as a test pair means that the user does not get the pair as a training example where they see the input and the output, but that they only get the input and have to find the solution, i.e., the output result, themselves. Note that you can mark several pairs as test pairs. "
    },
    {
        element: document.querySelector('#new_pair_button'),
        intro: "Here you can add a new pair to your test set. </br> Your test can have three or more pairs. </br>Provide enough pairs to ensure that the solution is derivable and that there is only one possible solution, but also try to give as few training pairs as possible to make the test more challenging. "
    },
    {
        element: document.querySelector('#task_toolbar'),
        intro: "<b>Here you can download, open and submit your task.</b> </li><li>In the text field, you can enter a name for your task.</li><li>'Download task' allows you to save the task locally on your computer.</li><li>'Open' allows you to open the .json file of a downloaded task.</li><li>'Submit to ARC 2' allows you to submit the item for the ARC 2 test set. </li></ul>Please do not submit an assignment until it is completely finished; the submission cannot be changed afterward."
    },
    {
        intro: "<b>That's it. We look forward to receiving your test submissions!</b> <br/>Please ensure that all submissions meet the following requirements, or we will not be able to include them in the ARC 2 test set: <ul><li>The test must be solvable only through the application of core knowledge (objectness, goal-directedness, numbers and counting, basic geometry and topology) </li><li>Each test should require a new, unique solution that is different from all other previous tests. </li><li>There must be exactly one solution for each test.</li></ul>"
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