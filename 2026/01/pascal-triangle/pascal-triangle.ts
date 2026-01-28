type PascalTriangle = Array<Array<number>> | null;
export function generatePT(level: number): PascalTriangle {
    if (level < 0 || Number(level) !== level) {
        return null;
    }
    const result = [[1]];
    if (level == 0) {
        return result;
    }

    for (let i = 1; i <= level; i++) {
        const row = [1];
        for (let j = 1; j <= i; j++) {
            // [i, j]
            const previousRow = result[i - 1];
            
            if (previousRow.length > j) {
                let newElement = previousRow[j - 1];
                newElement += previousRow[j];
                row.push(newElement);
            } else {
                row.push(1);
            }
           
        }
        result.push(row);
    }

    return result;
}

const generateStringWithSpaces = (count: number): string => {
    return '  '.repeat(count);
  }

const pt = generatePT(14);


pt?.forEach((element: Array<number>) => {
    console.log(generateStringWithSpaces(pt?.length - element.length) + element.join('   '));
});
