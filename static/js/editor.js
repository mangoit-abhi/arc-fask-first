var PAIRS = new Array(); // All pairs in the task.
var TEST_PAIR_INDICES = new Array(); // Indices of pairs that form the test set for the task.
var CURRENT_INPUT_GRID = new Grid(16, 16);
var CURRENT_OUTPUT_GRID = new Grid(16, 16);
var CURRENT_PAIR_INDEX = 0;
var TASK_NAME = null;

var EDITION_GRID_HEIGHT = 470;
var EDITION_GRID_WIDTH = 470;

function resetTask() {
    // Reset internal task data.
    PAIRS = new Array();
    TEST_PAIR_INDICES = new Array();
    CURRENT_INPUT_GRID = new Grid(16, 16);
    CURRENT_OUTPUT_GRID = new Grid(16, 16);
    CURRENT_PAIR_INDEX = 0;
    // Clear edition grids.
    resetCurrentPair();
    // Empty task preview div.
    $('#new_pairs').html('');
    $('#task_name').val('');
}

function refreshEditionGrid(jqGrid, dataGrid) {
    fillJqGridWithData(jqGrid, dataGrid);
    setUpEditionGridListeners(jqGrid);
    fitCellsToContainer(jqGrid, dataGrid.height, dataGrid.width, EDITION_GRID_HEIGHT, EDITION_GRID_WIDTH);
    initializeSelectable();
}

// function getSelectedSymbol() {
//     selected1 = $('#symbol_picker .selected-symbol-preview')[0];
//     selected2 = $('#output_window .symbol_picker_cls .selected-symbol-preview')[0];
//     return $(selected1).attr('symbol');
// }

function setUpEditionGridListeners(jqGrid) {
    jqGrid.find('.cell').click(function(event) {
        cell = $(event.target);
        //  New updated | color change in grids | Fixation
        selected_cell_grid_id = $(this).parents('.edition_grid').parents().parents().attr('id');
        console.log(selected_cell_grid_id);
        selected_symbol_cell = $('#'+selected_cell_grid_id+' .symbol_picker_cls .selected-symbol-preview')[0];
        console.log(selected_symbol_cell);
        symbol = $(selected_symbol_cell).attr('symbol');
        console.log(symbol);
        //  New updated | color change in grids | Fixation | Ends
        // symbol = getSelectedSymbol(); // Previous Code

        mode = $('input[name=tool_switching]:checked').val();
        if (mode == 'floodfill') {
            // If floodfill: fill all connected cells.
            syncFromEditionGridsToNumGrids();
            htmlGrid = cell.parent().parent().parent()[0];
            if (htmlGrid.id == 'input_grid') {
                grid = CURRENT_INPUT_GRID.grid;
            }
            else {
                grid = CURRENT_OUTPUT_GRID.grid;   
            }
            floodfillFromLocation(grid, cell.attr('x'), cell.attr('y'), symbol);
            syncFromNumGridsToEditionGrids();
        }
        else if (mode == 'edit') {
            // Else: fill just this cell.
            setCellSymbol(cell, symbol);
        }
    });
}

function syncFromEditionGridsToNumGrids() {
    copyJqGridToDataGrid($('#input_grid .edition_grid'), CURRENT_INPUT_GRID);
    copyJqGridToDataGrid($('#output_grid .edition_grid'), CURRENT_OUTPUT_GRID);
}

function syncFromNumGridsToEditionGrids() {
    refreshEditionGrid($('#input_grid .edition_grid'), CURRENT_INPUT_GRID);
    refreshEditionGrid($('#output_grid .edition_grid'), CURRENT_OUTPUT_GRID);
}

function singleColorNoiseOnGrid(mode) {
    symbol = getSelectedSymbol();
    syncFromEditionGridsToNumGrids();
    intensity = 0.05;
    if (mode == 'input') {
        grid = CURRENT_INPUT_GRID;
    }
    else {
        grid = CURRENT_OUTPUT_GRID;
    }
    for (var i = 0; i < grid.height; i ++) {
        for (var j = 0; j < grid.width; j ++) {
            if (Math.random() < intensity) {
                grid.grid[i][j] = symbol;
            }
        }
    }
    syncFromNumGridsToEditionGrids();
}

function multicolorNoiseOnGrid(mode) {
    syncFromEditionGridsToNumGrids();
    intensity = 0.05;
    if (mode == 'input') {
        grid = CURRENT_INPUT_GRID;
    }
    else {
        grid = CURRENT_OUTPUT_GRID;
    }
    for (var i = 0; i < grid.height; i ++) {
        for (var j = 0; j < grid.width; j ++) {
            if (Math.random() < intensity) {
                symbol = Math.floor(Math.random() * 9 + 1);
                grid.grid[i][j] = symbol;
            }
        }
    }
    syncFromNumGridsToEditionGrids();
}

function drawGridlinesOnGrid(mode, height, width) {
    symbol = getSelectedSymbol();
    syncFromEditionGridsToNumGrids();
    if (mode == 'input') {
        grid = CURRENT_INPUT_GRID;
    }
    else {
        grid = CURRENT_OUTPUT_GRID;
    }
    for (var i = 0; i < grid.height; i ++) {
        for (var j = 0; j < grid.width; j ++) {
            if ((i - height) % (height + 1) == 0) {
                grid.grid[i][j] = symbol;
            }
            if ((j - width) % (width + 1) == 0) {
                grid.grid[i][j] = symbol;
            }
        }
    }
    syncFromNumGridsToEditionGrids();
}

function evalExpressionOnGrid(mode, expr) {
    // expr must be of the form "i ** 2 + j"
    syncFromEditionGridsToNumGrids();
    if (mode == 'input') {
        grid = CURRENT_INPUT_GRID;
    }
    else {
        grid = CURRENT_OUTPUT_GRID;
    }
    for (var i = 0; i < grid.height; i ++) {
        for (var j = 0; j < grid.width; j ++) {
            grid.grid[i][j] = eval(expr) % 10;
        }
    }
    syncFromNumGridsToEditionGrids();
}

function evalExpressionOnInputGrid() {
    expr = $('#eval_expr_input').val();
    evalExpressionOnGrid("input", expr);
}

function evalExpressionOnOutputGrid() {
    expr = $('#eval_expr_output').val();
    evalExpressionOnGrid("output", expr);
}


function resizeInputGrid() {
    size = $('#input_grid_size').val();
    size = parseSizeTuple(size);
    if (size == undefined) return;
    height = size[0];
    width = size[1];

    jqGrid = $('#input_grid .edition_grid');
    syncFromEditionGridsToNumGrids();
    dataGrid = JSON.parse(JSON.stringify(CURRENT_INPUT_GRID.grid));
    CURRENT_INPUT_GRID = new Grid(height, width, dataGrid);
    refreshEditionGrid(jqGrid, CURRENT_INPUT_GRID);
}

function resizeOutputGrid() {
    size = $('#output_grid_size').val();
    size = parseSizeTuple(size);
    height = size[0];
    width = size[1];

    jqGrid = $('#output_grid .edition_grid');
    syncFromEditionGridsToNumGrids();
    dataGrid = JSON.parse(JSON.stringify(CURRENT_OUTPUT_GRID.grid));
    CURRENT_OUTPUT_GRID = new Grid(height, width, dataGrid);
    refreshEditionGrid(jqGrid, CURRENT_OUTPUT_GRID);
}

function resetInputGrid() {
    syncFromEditionGridsToNumGrids();
    CURRENT_INPUT_GRID = new Grid(3, 3);
    syncFromNumGridsToEditionGrids();
    resizeInputGrid();
}

function resetOutputGrid() {
    syncFromEditionGridsToNumGrids();
    CURRENT_OUTPUT_GRID = new Grid(3, 3);
    syncFromNumGridsToEditionGrids();
    resizeOutputGrid();
}

function fillPairPreview(pairId, inputGrid, outputGrid) {
    var pairSlot = $('#parent_pair_' + pairId);
    if (!pairSlot.length) {
        pairSlot = $('<div id="parent_pair_' + pairId + '" class="parent_pair" index="' + pairId + '"><div id="pair_preview_' + pairId + '" class="pair_preview" index="' + pairId + '"></div><div id="modify_test_pairs_' + pairId + '" class="delete_mark_as_test_pairs"><button class="delete_pair_btn" onclick="deletePair(' + pairId + ')">Delete Pair</button><button class="select_for_testing_button" onclick="selectPairForTesting(' + pairId + ')">Mark as Test Pair</button></div></div>');
        pairSlot.appendTo('#new_pairs');
    }
    var jqInputGrid = pairSlot.find('.input_preview');
    if (!jqInputGrid.length) {
        jqInputGrid = $('<div class="input_preview"></div>');
        jqInputGrid.prependTo(pairSlot);
    }
    var jqOutputGrid = pairSlot.find('.output_preview');
    if (!jqOutputGrid.length) {
        jqOutputGrid = $('<div class="output_preview"></div>');
        jqOutputGrid.prependTo(pairSlot);
    }
    // var jqEditBtn = pairSlot.find('.edit_pair_btn');
    // if (!jqEditBtn.length) {
    //     jqEditBtn = $('<button class="edit_pair_btn" onclick="editPair(' + pairId + ')">Edit pair</button>');
    //     jqEditBtn.appendTo(pairSlot);
    // }
    // var jqDelBtn = pairSlot.find('.delete_pair_btn');
    // if (!jqDelBtn.length) {
    //     jqDelBtn = $('<button class="delete_pair_btn" onclick="deletePair(' + pairId + ')">Delete pair</button>');
    //     jqDelBtn.appendTo(pairSlot);
    // }
    // var jqSelectForTestingBtn = pairSlot.find('.select_for_testing_button');
    // if (!jqSelectForTestingBtn.length) {
    //     jqSelectForTestingBtn = $('<button class="select_for_testing_button" onclick="selectPairForTesting(' + pairId + ')">Mark as Test Pair</button>');
    //     jqSelectForTestingBtn.appendTo(pairSlot);
    // }

    fillJqGridWithData(jqInputGrid, inputGrid);
    fitCellsToContainer(jqInputGrid, inputGrid.height, inputGrid.width, 200, 200);
    fillJqGridWithData(jqOutputGrid, outputGrid);
    fitCellsToContainer(jqOutputGrid, outputGrid.height, outputGrid.width, 200, 200);
}

function stashCurrentPair() {
    syncFromEditionGridsToNumGrids();
    fillPairPreview(CURRENT_PAIR_INDEX, CURRENT_INPUT_GRID, CURRENT_OUTPUT_GRID);

    pair = {'input': CURRENT_INPUT_GRID.grid,
            'output': CURRENT_OUTPUT_GRID.grid};
    if (PAIRS.length < CURRENT_PAIR_INDEX) {
        PAIRS.push(JSON.parse(JSON.stringify(pair)));
    }
    else {
        PAIRS[CURRENT_PAIR_INDEX] = pair;
    }

    if (PAIRS.length == 1) {
        infoMsg('Now create a second pair and save it.')
    }
    if (PAIRS.length == 2) {
        infoMsg('Now create a third pair and save it.')
    }
    if ((PAIRS.length > 2) & (TEST_PAIR_INDICES.length == 0)) {
        infoMsg('At some point, click "ADD TO TEST SET" to add one or more pairs to the test set for the task.')
    }
    if ((PAIRS.length > 2) & (TEST_PAIR_INDICES.length > 0)) {
        infoMsg('Once your task is ready, click "SAVE" to save it to the ARC server.')
    }
}

function newPair() {
    stashCurrentPair();
    CURRENT_PAIR_INDEX = PAIRS.length;
    CURRENT_INPUT_GRID = new Grid(16, 16);
    CURRENT_OUTPUT_GRID = new Grid(16, 16);
    syncFromNumGridsToEditionGrids(); 
}

function editPair(pairId) {
    if (PAIRS.length > pairId) {
        pair = PAIRS[pairId];
        values = pair['input'];
        CURRENT_INPUT_GRID = convertSerializedGridToGridObject(values);
        values = pair['output'];
        CURRENT_OUTPUT_GRID = convertSerializedGridToGridObject(values);
        CURRENT_PAIR_INDEX = pairId;
        syncFromNumGridsToEditionGrids();

        $('#input_grid_size').val(CURRENT_INPUT_GRID.height + 'x' + CURRENT_INPUT_GRID.width);
        $('#output_grid_size').val(CURRENT_OUTPUT_GRID.height + 'x' + CURRENT_OUTPUT_GRID.width);
    }
}

function deletePair(pairId) {
    // We don't alter existing pair indices;
    // indices are expected to be immutable IDs.
    if (PAIRS.length > pairId) {
        PAIRS[pairId] = null;
        // Delete preview of pair.
        pairSlot = $('#parent_pair_' + pairId);
        pairSlot.remove();
    }
}

function selectPairForTesting(pairId) {
    preview_div = $('#parent_pair_' + pairId)
    // Case 1: pair isn't yet in test set. Add it.
    if ($.inArray(pairId, TEST_PAIR_INDICES) == -1) {
        if (PAIRS.length > pairId) {
            TEST_PAIR_INDICES.push(pairId);
        }
        // Modify text on button
        preview_div.find('.select_for_testing_button').each(function(i, btn) {
            $(btn).html('Unmark as Test Pair');
        })
        // Highlight pair preview
        preview_div.addClass('selected_for_testing');
    }
    // Case 2: pair in test set. Remove it.
    else {
        for (var i = 0; i < TEST_PAIR_INDICES.length; i++) {
            if (TEST_PAIR_INDICES[i] == pairId) {
                TEST_PAIR_INDICES.splice(i, 1);
                break;
            }
        }
        // Modify text on button
        preview_div.find('.select_for_testing_button').each(function(i, btn) {
            $(btn).html('Mark as Test Pair');
        })
        // Un-highlight pair preview
        preview_div.removeClass('selected_for_testing');
    }

    if ((PAIRS.length > 2) & (TEST_PAIR_INDICES.length > 0)) {
        infoMsg('Once your task is ready, click "SAVE" to save it to the ARC server.')
    }
}

function checkTaskComplete() {
    // Check that there are at least 3 pairs.
    if (PAIRS.length < 3) {
        alert('To save a task, you need at least 3 pairs.');
        return false;
    }
    // Check that at least one pair is selected for testing.
    if (TEST_PAIR_INDICES.length < 1) {
        alert('To save a task, you need at least 1 pair selected for testing.');
        return false;
    }
    return true;

}

function getTaskData() {
    if (!checkTaskComplete()) {return;}

    // Prepare dict containing two arrays of pairs: "train" and "test".    
    var taskDict = {};
    taskDict['train'] = new Array();
    taskDict['test'] = new Array();
    for (var i = 0; i < PAIRS.length; i++) {
        if (PAIRS[i] != null) {
            pair = PAIRS[i];
            if ($.inArray(i, TEST_PAIR_INDICES) >= 0) {
                taskDict['test'].push(pair);
            }
            else {
                taskDict['train'].push(pair);
            }
        }
    }

    // Get task name.
    if (TASK_NAME == null) {
        task_name = $('#task_name').val();
    }
    else {
        task_name = TASK_NAME;
    }
    if (task_name.length < 1) {
        task_name = (Math.random() + 1).toString(36).substring(7);
    }
    taskDict['name'] = task_name;
    return taskDict;
}

function downloadTask() {
    taskDict = getTaskData();
    data = JSON.stringify(taskDict);
    filename = taskDict['name'] + '.json';
    saveFile(data, filename);
}

function saveTask() {
    if (confirm('Are you sure your task is ready to be saved? A saved task cannot be further edited.')) {
        taskDict = getTaskData();
        sendJSON(taskDict, '/create_task', function(data) {
            if (data != 'OK') {
                alert('Unable to save task.');
                errorMsg('Unable to save task.')
            } else {
                infoMsg('Task saved! Now make a new one.');
                resetTask();
            }
        });
    } else {
        errorMsg('Finish your task before saving it.');
    }
}


function loadTask(e) {
    var file = e.target.files[0];
    if (!file) {
        return false;
    }
    var validExtensions = ['json', 'JSON'];
    var fileName = file.name;
    var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
    if ($.inArray(fileNameExt, validExtensions) == -1){
        $('#error_display').append('Invalid file type only json file allowed');
        return false;
    }
    else {
        var reader = new FileReader();
        reader.onload = function(e) {
        var contents = e.target.result;

        contents = JSON.parse(contents);
        // Actually load taks from JSON.
        resetTask();

        name = contents['name'];
        $('#task_name').val(name);
        train = contents['train'];
        test = contents['test'];
        pairs = train.concat(test);
        for (var i = 0; i < pairs.length; i++) {
            pair = pairs[i];
            values = pair['input'];
            input_grid = convertSerializedGridToGridObject(values)
            values = pair['output'];
            output_grid = convertSerializedGridToGridObject(values)
            fillPairPreview(i, input_grid, output_grid);
            PAIRS.push(pair);
        }
        for (var i = 0; i < test.length; i++) {
            selectPairForTesting(train.length + i);
        }
        editPair(0);
        $('#load_task_file_input')[0].value = "";
        display_task_name(file.name);
    }
  };
  reader.readAsText(file);
}


function resetCurrentPair() {
    resetInputGrid();
    resetOutputGrid();
    syncFromNumGridsToEditionGrids();
}

function copyToOutput() {
    syncFromEditionGridsToNumGrids();
    CURRENT_OUTPUT_GRID = convertSerializedGridToGridObject(CURRENT_INPUT_GRID.grid);
    syncFromNumGridsToEditionGrids();
    $('#output_grid_size').val(CURRENT_OUTPUT_GRID.height + 'x' + CURRENT_OUTPUT_GRID.width);
}

function initializeSelectable() {
    try {
        $('.edition_grid').selectable('destroy');
    }
    catch (e) {
    }
    toolMode = $('input[name=tool_switching]:checked').val();
    if (toolMode == 'select') {
        $('.edition_grid').selectable(
            {
                autoRefresh: false,
                filter: '> .row > .cell',
                start: function(event, ui) {
                    $('.ui-selected').each(function(i, e) {
                        $(e).removeClass('ui-selected');
                    });
                }
            }
        );
        infoMsg('After selecting an area, you can press C to copy it, or you can pick a color to fill the area.');
    }
}

// Initial event binding.

$(document).ready(function () {
    // $('#symbol_picker').find('.symbol_preview').click(function(event) {
    $('.symbol_picker_cls').click(function(event) {
        symbol_preview = $(event.target);
        $(this).find('.symbol_preview').each(function(i, preview) {
            $(preview).removeClass('selected-symbol-preview');
        })
        symbol_preview.addClass('selected-symbol-preview');

        toolMode = $('input[name=tool_switching]:checked').val();
        if (toolMode == 'select') {
            $('.ui-selected').each(function(i, cell) {
                symbol = getSelectedSymbol();
                setCellSymbol($(cell), symbol);
            });
        }
    });

    resizeInputGrid();
    resizeOutputGrid();

    $('.edition_grid').each(function(i, jqGrid) {
        setUpEditionGridListeners($(jqGrid));
    });

    $('#load_task_file_input').on('change', function(event) {
        loadTask(event);
    });

    $('input[type=radio][name=tool_switching]').change(function() {
        initializeSelectable();
    });

    $('body').keydown(function(event) {
        if (event.which == 67) {
            $('.previously-copied').each(function(i, e) {
                $(e).removeClass('previously-copied');
            })
            $('.ui-selected').each(function(i, e) {
                $(e).addClass('previously-copied');
            });
            infoMsg('Area copied! After clicking a target location, press V to paste the copied area.');
        }
        if (event.which == 86) {
            selected = $('.ui-selected');
            editionGrid = $(selected.parent().parent()[0]);

            if (selected.length == 1) {
                targetx = parseInt(selected.attr('x'));
                targety = parseInt(selected.attr('y'));

                prev = $('.previously-copied');
                if (prev.length == 0) {
                    return;
                }
                xs = [];
                ys = [];
                for (var i = 0; i < prev.length; i ++) {
                    xs.push(parseInt($(prev[i]).attr('x')));
                    ys.push(parseInt($(prev[i]).attr('y')));
                }
                minx = Math.min(...xs);
                miny = Math.min(...ys);
                for (var i = 0; i < prev.length; i ++) {
                    symbol = $(prev[i]).attr('symbol');
                    x = parseInt($(prev[i]).attr('x'));
                    newx = x - minx + targetx;
                    y = parseInt($(prev[i]).attr('y'));
                    newy = y - miny + targety;
                    res = editionGrid.find('[x="' + newx + '"][y="' + newy + '"] ');
                    if (res.length == 1) {
                        cell = $(res[0]);
                        setCellSymbol(cell, symbol);
                    }
                }
                // At end of copy event, clear selection
                $('.ui-selected').each(function(i, e) {
                    $(e).removeClass('ui-selected');
                });
            }
        }
    });
});


// Generic utils.

function saveFile(data, filename) {
    var link = document.createElement('a');
    var file = new Blob([data], {type: 'text/plain'});
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
}

function sendJSON(data, url, cbk) {
    $.ajax(url, {data : JSON.stringify(data),
                 contentType : 'application/json',
                 type : 'POST'}).done(cbk);
}

function display_task_name(task_name) {
    $('#task_name').val(task_name) 
}