def generate_pt(level):
    # validate input
    if level < 0 or not isinstance(level, int):
        return None
    
    result = [[1]]
    if level == 0:
        return result
    
    # build each row by summing adjacent numbers
    for i in range(1, level + 1):
        row = [1]
        for j in range(1, i + 1):
            previous_row = result[i - 1]
            if len(previous_row) > j:
                # sum two adjacent numbers
                new_element = previous_row[j - 1] + previous_row[j]
                row.append(new_element)
            else:
                # last element is always 1
                row.append(1)
        result.append(row)
    
    return result


def display_pt(level):
    pt = generate_pt(level)
    if pt is None:
        return
    
    # find max number width
    max_num = pt[-1][len(pt[-1]) // 2]
    num_width = len(str(max_num))
    
    # calculate last row width
    last_row_width = len(pt[-1]) * (num_width + 2) - 2
    
    # print each row centered
    for row in pt:
        padded_numbers = '  '.join(str(num).rjust(num_width) for num in row)
        leading_spaces = ' ' * ((last_row_width - len(padded_numbers)) // 2)
        print(leading_spaces + padded_numbers)


if __name__ == '__main__':
    display_pt(15)