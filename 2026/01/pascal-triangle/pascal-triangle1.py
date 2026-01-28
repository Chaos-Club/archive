def generate_spaces(count):
    return '  ' * count


def draw_pt(level):
    # validate input
    if level < 0 or not isinstance(level, int):
        return
    
    for i in range(level + 1):
        prev = 1
        print(generate_spaces(level - i), end='')
        for j in range(i + 1):
            print(f'{prev}   ', end='')
            # calculate next number
            prev = prev * (i - j) // (j + 1)
        print()


def draw_sierpinski(level):
    # validate input
    if level < 0 or not isinstance(level, int):
        return
    
    for i in range(level + 1):
        prev = 1
        print(generate_spaces(level - i), end='')
        for j in range(i + 1):
            # 'Q' for odd, '.' for even
            symbol = 'Q' if prev % 2 else '.'
            print(f'{symbol}   ', end='')
            # calculate next number
            prev = prev * (i - j) // (j + 1)
        print()


if __name__ == '__main__':
    draw_sierpinski(54)