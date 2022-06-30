MAX_SYMBOL = 9

def validate_task_format(data):
    if type(data) != dict:
        return False
    if len(data.keys()) != 3:
        return False
    if 'train' not in data or 'test' not in data or 'name' not in data:
        return False
    train_pairs = data['train']
    test_pairs = data['test']
    if type(train_pairs) != list or type(test_pairs) != list:
        return False
    if len(train_pairs) < 2 or len(test_pairs) < 1:
        return False
    return all(validate_pair_format(pair) for pair in data['train'] + data['test'])


def validate_pair_format(data):
    if type(data) != dict:
        return False
    if len(data.keys()) != 2:
        return False
    if 'input' not in data or 'output' not in data:
        return False
    return all(validate_grid_format(grid) for grid in [data['input'], data['output']])


def validate_grid_format(data):
    if type(data) != list:
        return False
    for row in data:
        if type(row) != list:
            return False
        if len(row) < 1:
            return False
        if len(row) != len(data[0]):
            return False
        if any(type(s) != int for s in row):
            return False
        if any(s < 0 or s > MAX_SYMBOL for s in row):
            return False
    return True


def compute_min_max_grid_size(task):
    pairs = data['train'] + data['test']
    heights = []
    widths = []
    for p in pairs:
        heights.append(len(p['input']))
        widths.append(len(p['input'][0]))
        heights.append(len(p['output']))
        widths.append(len(p['output'][0]))
    return min(heights + widths), max(heights + widths)
