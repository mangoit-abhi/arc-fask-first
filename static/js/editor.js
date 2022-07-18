var PAIRS = new Array(); // All pairs in the task.
var TEST_PAIR_INDICES = new Array(); // Indices of pairs that form the test set for the task.
var CURRENT_INPUT_GRID = new Grid(16, 16);
var CURRENT_OUTPUT_GRID = new Grid(16, 16);
var CURRENT_PAIR_INDEX = 0;
var MY_CURRENT_PAIR_INDEX = 0;

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
    $('#task_preview').html('');
    $('#task_name').val('');
}

function refreshEditionGrid(jqGrid, dataGrid, mode='input') {
    fillJqGridWithData(jqGrid, dataGrid);
    setUpEditionGridListeners(jqGrid);
    fitCellsToContainer(jqGrid, dataGrid.height, dataGrid.width, EDITION_GRID_HEIGHT, EDITION_GRID_HEIGHT);
    initializeSelectable(mode);
}

function getSelectedSymbol(divmode) {
    getClickValue = $('#' + divmode + '_window').children('#' + divmode + '_grid').siblings('.toolbar').children('.symbol_toolbar-outer').children('#symbol_toolbar').children('#symbol_picker').children('.selected-symbol-preview').attr('symbol');
    return getClickValue;
}

function setUpEditionGridListeners(jqGrid) {
    jqGrid.find('.cell').click(function(event) {
        get_cell = $(event.target);
        selected_cell_grid_id = $(this).parents('.edition_grid').parents().parents().attr('id');
        if(selected_cell_grid_id == 'input_window'){
            divmode = 'input';
        } else if(selected_cell_grid_id == 'output_window'){
            divmode = 'output';
        }

        if(selected_cell_grid_id != undefined){
            symbol = getSelectedSymbol(divmode);

            mode = $('input[name=tool_switching_' + divmode +']:checked').val();
            if (mode == 'floodfill') {
                // If floodfill: fill all connected cells.
                syncFromEditionGridsToNumGrids(divmode);
                htmlGrid = get_cell.parent().parent().parent()[0];
                if (htmlGrid != undefined) {
                    if (htmlGrid.id == 'input_grid') {
                        grid = CURRENT_INPUT_GRID.grid;
                    }
                    else {
                        grid = CURRENT_OUTPUT_GRID.grid;   
                    }
                    floodfillFromLocation(grid, get_cell.attr('x'), get_cell.attr('y'), symbol);
                    syncFromNumGridsToEditionGrids(divmode);
                }
            }
            else if (mode == 'edit') {
                // Else: fill just this cell.
                setCellSymbol(get_cell, symbol);
            }
        }
    });
}

function syncFromEditionGridsToNumGrids(mode='input', pairId='no') {
    if(pairId != 'no'){
        copyJqGridToDataGrid($('#input_grid_'+pairId+' .edition_grid'), CURRENT_INPUT_GRID);
        copyJqGridToDataGrid($('#output_grid_'+pairId+' .edition_grid'), CURRENT_OUTPUT_GRID);
    } else {
        copyJqGridToDataGrid($('#input_grid .edition_grid'), CURRENT_INPUT_GRID);
        copyJqGridToDataGrid($('#output_grid .edition_grid'), CURRENT_OUTPUT_GRID);
    }
}

function syncFromNumGridsToEditionGrids(mode='input', pairId='no') {
    if(pairId != 'no'){
        refreshEditionGrid($('#input_grid_'+pairId+' .edition_grid'), CURRENT_INPUT_GRID, mode);
        refreshEditionGrid($('#output_grid_'+pairId+' .edition_grid'), CURRENT_OUTPUT_GRID, mode);
    } else {
        refreshEditionGrid($('#input_grid .edition_grid'), CURRENT_INPUT_GRID, mode);
        refreshEditionGrid($('#output_grid .edition_grid'), CURRENT_OUTPUT_GRID, mode);
    }
    
}

function singleColorNoiseOnGrid(mode) {
    symbol = getSelectedSymbol(mode);
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
    symbol = getSelectedSymbol(mode);
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


function resizeInputGrid(mode='input', pairId='no') {
    if(pairId != 'no'){
        size = $('#input_grid_size_'+pairId).val();
        size = parseSizeTuple(size);
        if (size == undefined) return;
        height = size[0];
        width = size[1];
    
        jqGrid = $('#input_grid_'+pairId+' .edition_grid');
        syncFromEditionGridsToNumGrids(mode,pairId);
        dataGrid = JSON.parse(JSON.stringify(CURRENT_INPUT_GRID.grid));
        CURRENT_INPUT_GRID = new Grid(height, width, dataGrid);
        refreshEditionGrid(jqGrid, CURRENT_INPUT_GRID);
    } else {

        size = $('#input_grid_size').val();
        size = parseSizeTuple(size);
        if (size == undefined) return;
        height = size[0];
        width = size[1];
    
        jqGrid = $('#input_grid .edition_grid');
        syncFromEditionGridsToNumGrids(mode);
        dataGrid = JSON.parse(JSON.stringify(CURRENT_INPUT_GRID.grid));
        CURRENT_INPUT_GRID = new Grid(height, width, dataGrid);
        refreshEditionGrid(jqGrid, CURRENT_INPUT_GRID);
    }
}

function resizeOutputGrid(mode='output', pairId='no') {
    if(pairId != 'no'){
        size = $('#output_grid_size_'+pairId).val();
        size = parseSizeTuple(size);
        height = size[0];
        width = size[1];

        jqGrid = $('#output_grid_'+pairId+' .edition_grid');
        syncFromEditionGridsToNumGrids(mode);
        dataGrid = JSON.parse(JSON.stringify(CURRENT_OUTPUT_GRID.grid));
        CURRENT_OUTPUT_GRID = new Grid(height, width, dataGrid);
        refreshEditionGrid(jqGrid, CURRENT_OUTPUT_GRID);
    } else {
        size = $('#output_grid_size').val();
        size = parseSizeTuple(size);
        height = size[0];
        width = size[1];

        jqGrid = $('#output_grid .edition_grid');
        syncFromEditionGridsToNumGrids(mode);
        dataGrid = JSON.parse(JSON.stringify(CURRENT_OUTPUT_GRID.grid));
        CURRENT_OUTPUT_GRID = new Grid(height, width, dataGrid);
        refreshEditionGrid(jqGrid, CURRENT_OUTPUT_GRID);
    }
}

function resetInputGrid(mode='input' , pairId='no') {
    if(pairId != 'no'){
        syncFromEditionGridsToNumGrids(mode, pairId);
        CURRENT_INPUT_GRID = new Grid(3, 3);
        syncFromNumGridsToEditionGrids(mode, pairId);
        resizeInputGrid(mode, pairId);
    } else {
        syncFromEditionGridsToNumGrids(mode);
        CURRENT_INPUT_GRID = new Grid(3, 3);
        syncFromNumGridsToEditionGrids(mode);
        resizeInputGrid(mode);
    }    
}

function resetOutputGrid(mode='output' , pairId='no') {
    if(pairId != 'no'){
        syncFromEditionGridsToNumGrids(mode, pairId);
        CURRENT_OUTPUT_GRID = new Grid(3, 3);
        syncFromNumGridsToEditionGrids(mode, pairId);
        resizeOutputGrid(mode, pairId);
    } else {
        syncFromEditionGridsToNumGrids(mode);
        CURRENT_OUTPUT_GRID = new Grid(3, 3);
        syncFromNumGridsToEditionGrids(mode);
        resizeOutputGrid(mode);
    }
}

function fillPairPreview(pairId, inputGrid, outputGrid) {
    newPairId = pairId+1;
    var pairSlot = $('#parent_pair_' + pairId);
    if (!pairSlot.length) {
        pairSlot = $('<div id="parent_pair_' + pairId + '" class="parent_pair" index="' + pairId + '"><div id="modify_test_pairs_' + pairId + '" class="delete_mark_as_test_pairs"><button class="delete_pair_btn" onclick="deletePair(' + pairId + ')">Delete Pair</button><button class="select_for_testing_button" onclick="selectPairForTesting(' + pairId + ')">Mark as Test Pair</button></div></div>');
        pairSlot.appendTo('#new_pairs');
    }

    var grids_space_slot = $('#grids_space_' + pairId);
    if (!grids_space_slot.length) {
        grids_space_slot = $('<div class="pair_heading">Pair ' + newPairId + '</div><div id="grids_space_' + pairId + '" class="grids_space" index="' + pairId + '"></div>');
        grids_space_slot.prependTo('#parent_pair_' + pairId);
    }

    var output_window_slot = $('#output_window_' + pairId);
    if (!output_window_slot.length) {
        output_window_slot = $('<div id="output_window_' + pairId + '" class="output_window" index="' + pairId + '"></div>');
        output_window_slot.prependTo('#grids_space_' + pairId);
    }

    var output_grid_slot = $('#output_grid_' + pairId);
    if (!output_grid_slot.length) {
        output_grid_slot = $('<div id="output_grid_' + pairId + '" class="output_grid" index="' + pairId + '"></div>');
        output_grid_slot.prependTo(output_window_slot);
    }

    var input_window_slot = $('#input_window_' + pairId);
    if (!input_window_slot.length) {
        input_window_slot = $('<div id="input_window_' + pairId + '" class="input_window" index="' + pairId + '"></div>');
        input_window_slot.prependTo('#grids_space_' + pairId);
    }

    var input_grid_slot = $('#input_grid_' + pairId);
    if (!input_grid_slot.length) {
        input_grid_slot = $('<div id="input_grid_' + pairId + '" class="input_grid" index="' + pairId + '"></div>');
        input_grid_slot.prependTo(input_window_slot);
    }


    var jqOutputGrid = output_grid_slot.find('#edition_grid_' + pairId);
    if (!jqOutputGrid.length) {
        jqOutputGrid = $('<div id="edition_grid_' + pairId + '" class="edition_grid"></div>');
        jqOutputGrid.prependTo(output_grid_slot);
    }

    var jqEditBtn = output_grid_slot.find('.edit_pair_btn');
    if (!jqEditBtn.length) {
        jqEditBtn = $(`<div class="toolbar">
        <label for="output_grid_size_`+pairId+`">Output grid size: </label>
        <input type="text" id="output_grid_size_`+pairId+`" class="grid_size_field" name="size" value="16x16">
        <button onclick="resizeOutputGrid('output', `+pairId+`)">Resize</button>
        <button onclick="resetOutputGrid('output', `+pairId+`)">Reset grid</button>
        <div class="symbol_toolbar-outer">
            <div id="symbol_toolbar, `+pairId+`" >
                <div id="symbol_picker" class="symbol_picker_cls_0">
                    <div class="symbol_preview symbol_0 selected-symbol-preview" symbol="0"></div>
                    <div class="symbol_preview symbol_1" symbol="1"></div>
                    <div class="symbol_preview symbol_2" symbol="2"></div>
                    <div class="symbol_preview symbol_3" symbol="3"></div>
                    <div class="symbol_preview symbol_4" symbol="4"></div>
                    <div class="symbol_preview symbol_5" symbol="5"></div>
                    <div class="symbol_preview symbol_6" symbol="6"></div>
                    <div class="symbol_preview symbol_7" symbol="7"></div>
                    <div class="symbol_preview symbol_8" symbol="8"></div>
                    <div class="symbol_preview symbol_9" symbol="9"></div>
                </div>
                <div id="symbol_actions">
                    <input type="radio" id="tool_edit" name="tool_switching_output" class="toolbar_button" value="edit" checked>
                    <label for="tool_edit">Edit</label>
                    <input type="radio" id="tool_select" name="tool_switching_output" class="toolbar_button" value="select">
                    <label for="tool_select">Select</label>
                    <input type="radio" id="tool_floodfill" name="tool_switching_output" class="toolbar_button" value="floodfill">
                    <label for="tool_floodfill">Flood fill</label>
                </div>
            </div>
        </div>                                
    </div>
    <div class="toolbar">
        <button onclick="singleColorNoiseOnGrid('output')">Noise (single-color)</button>
        <button onclick="multicolorNoiseOnGrid('output')">Noise (multi-color)</button>
        <div class="toolbar-inner">
            <label for="eval_expr_output">Expression of i, j: </label>
            <input type="text" id="eval_expr_output" name="expr" value="i**2 + j">
            <button onclick="evalExpressionOnOutputGrid()">Eval</button>
        </div>
    </div>`);
        $('#edition_grid_' + pairId).after(jqEditBtn);
    }

    

    var jqInputGrid = input_grid_slot.find('#edition_grid_' + pairId);
    if (!jqInputGrid.length) {
        jqInputGrid = $('<div id="edition_grid_' + pairId + '" class="edition_grid"></div>');
        jqInputGrid.prependTo(input_grid_slot);
    }

    var jqEditBtn1 = input_grid_slot.find('.edit_pair_btn');
    if (!jqEditBtn1.length) {
        jqEditBtn1 = $(`<div class="toolbar" id="toolbar_color_input">
        <label for="input_grid_size_`+pairId+`">Input grid size: </label>
        <input type="text" id="input_grid_size_`+pairId+`" class="grid_size_field" name="size" value="16x16">
        <button onclick="resizeInputGrid('input', `+pairId+`)">Resize</button>
        <button onclick="resetInputGrid('input', `+pairId+`)">Reset grid</button>
        <button onclick="copyToOutput('input', `+pairId+`)">Copy to output</button>
        <div class="symbol_toolbar-outer">
            <div id="symbol_toolbar_`+pairId+`" >
                <div id="symbol_picker" class="symbol_picker_cls_0">
                    <div class="symbol_preview symbol_0 selected-symbol-preview" symbol="0"></div>
                    <div class="symbol_preview symbol_1" symbol="1"></div>
                    <div class="symbol_preview symbol_2" symbol="2"></div>
                    <div class="symbol_preview symbol_3" symbol="3"></div>
                    <div class="symbol_preview symbol_4" symbol="4"></div>
                    <div class="symbol_preview symbol_5" symbol="5"></div>
                    <div class="symbol_preview symbol_6" symbol="6"></div>
                    <div class="symbol_preview symbol_7" symbol="7"></div>
                    <div class="symbol_preview symbol_8" symbol="8"></div>
                    <div class="symbol_preview symbol_9" symbol="9"></div>
                </div>
                <div id="symbol_actions">
                    <input type="radio" id="tool_edit" name="tool_switching_input" class="toolbar_button" value="edit" checked>
                    <label for="tool_edit">Edit</label>
                    <input type="radio" id="tool_select" name="tool_switching_input" class="toolbar_button" value="select">
                    <label for="tool_select">Select</label>
                    <input type="radio" id="tool_floodfill" name="tool_switching_input" class="toolbar_button" value="floodfill">
                    <label for="tool_floodfill">Flood fill</label>
                </div>
            </div>
        </div>
    </div>
    <div class="toolbar" id="toolbar_expression_input">
        <button onclick="singleColorNoiseOnGrid('input')">Noise (single-color)</button>
        <button onclick="multicolorNoiseOnGrid('input')">Noise (multi-color)</button>
        <div class="toolbar-inner">
            <label for="eval_expr_input">Expression of i, j: </label>
            <input type="text" id="eval_expr_input" name="expr" value="i**2 + j">
            <button onclick="evalExpressionOnInputGrid()">Eval</button>
        </div></div>`);
        $('#edition_grid_' + pairId).after(jqEditBtn1);
    }

    fillJqGridWithData(jqInputGrid, inputGrid);
    fitCellsToContainer(jqInputGrid, 16, 16, 470, 470);
    fillJqGridWithData(jqOutputGrid, outputGrid);
    fitCellsToContainer(jqOutputGrid, 16, 16, 470, 470);

    $('.symbol_picker_cls_'+ pairId).click(function(event) {
        symbol_preview = $(event.target);
        $(this).find('.symbol_preview').each(function(i, preview) {
            $(preview).removeClass('selected-symbol-preview');
        })
        symbol_preview.addClass('selected-symbol-preview');

        selected_cell_grid_id = symbol_preview.parent().parent().parent().parent().parent().attr('id');

        if(selected_cell_grid_id == 'input_window'){
            divmode = 'input';
        } else if(selected_cell_grid_id == 'output_window'){
            divmode = 'output';
        }

        toolMode = $('input[name=tool_switching_' + divmode + ']:checked').val();
        if (toolMode == 'select') {
            $('.ui-selected').each(function(i, cell) {
                symbol = getSelectedSymbol(divmode);
                setCellSymbol($(cell), symbol);
            });
        }
    });
    jqGrid = $('#edition_grid_' + pairId);
    setUpEditionGridListeners(jqGrid);
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
            $(btn).html('Remove from test set');
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
            $(btn).html('Add to test set');
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
    return;
  }
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
  };
  reader.readAsText(file);
}


function resetCurrentPair() {
    resetInputGrid();
    resetOutputGrid();
    syncFromNumGridsToEditionGrids();
}

function copyToOutput(mode='input', pairId='no') {
    if(pairId != 'no'){
        syncFromEditionGridsToNumGrids(mode, pairId);

        CURRENT_OUTPUT_GRID = convertSerializedGridToGridObject(CURRENT_INPUT_GRID.grid);

        syncFromNumGridsToEditionGrids(mode, pairId);
        $('#output_grid_size_'+pairId).val(CURRENT_OUTPUT_GRID.height + 'x' + CURRENT_OUTPUT_GRID.width);
    } else {
        syncFromEditionGridsToNumGrids(mode);
        CURRENT_OUTPUT_GRID = convertSerializedGridToGridObject(CURRENT_INPUT_GRID.grid);
        syncFromNumGridsToEditionGrids(mode);
        $('#output_grid_size').val(CURRENT_OUTPUT_GRID.height + 'x' + CURRENT_OUTPUT_GRID.width);
    }
}

function initializeSelectable(mode = 'input') {
    try {
        $('.edition_grid').selectable('destroy');
    }
    catch (e) {
    }
    toolMode = $('input[name=tool_switching_'+ mode +']:checked').val();
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
    $('.symbol_picker_cls').click(function(event) {
        symbol_preview = $(event.target);
        $(this).find('.symbol_preview').each(function(i, preview) {
            $(preview).removeClass('selected-symbol-preview');
        })
        symbol_preview.addClass('selected-symbol-preview');

        selected_cell_grid_id = symbol_preview.parent().parent().parent().parent().parent().attr('id');

        if(selected_cell_grid_id == 'input_window'){
            divmode = 'input';
        } else if(selected_cell_grid_id == 'output_window'){
            divmode = 'output';
        }

        toolMode = $('input[name=tool_switching_' + divmode + ']:checked').val();
        if (toolMode == 'select') {
            $('.ui-selected').each(function(i, cell) {
                symbol = getSelectedSymbol(divmode);
                setCellSymbol($(cell), symbol);
            });
        }
    });

    $('.symbol_picker_cls_0').click(function(event) {
        new_symbol_preview = $(event.target);

        $(this).find('.symbol_preview').each(function(i, preview) {
            $(preview).removeClass('selected-symbol-preview');
        })
        symbol_preview.addClass('selected-symbol-preview');

        selected_cell_grid_id = symbol_preview.parent().parent().parent().parent().parent().attr('id');

        if(selected_cell_grid_id == 'input_waindow'){
            divmode = 'input';
        } else if(selected_cell_grid_id == 'output_window'){
            divmode = 'output';
        }

        toolMode = $('input[name=tool_switching_' + divmode + ']:checked').val();
        if (toolMode == 'select') {
            $('.ui-selected').each(function(i, cell) {
                symbol = getSelectedSymbol(divmode);
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

    $('input[type=radio][name=tool_switching_input]').change(function() {
        initializeSelectable('input');
    });
    $('input[type=radio][name=tool_switching_output]').change(function() {
        initializeSelectable('output');
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