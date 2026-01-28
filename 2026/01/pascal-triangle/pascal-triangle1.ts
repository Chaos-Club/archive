const generateStringWithSpaces = (count: number): string => {
    return '  '.repeat(count);
  }

export function drawPT(level: number): void {
    if (level < 0 || Number(level) !== level) {
        return;
    }

    for (let i = 0; i <= level; i++) {
        let prev = 1;
        let row = '';
        process.stdout.write(generateStringWithSpaces(level - i));
        for (let j = 0; j <= i; j++) {

           process.stdout.write(`${prev}`);
            prev = prev * (i - j) / (j + 1); 
            

           
        }
      process.stdout.write(`\n`);
    }

}

export function drawSierpinski(level: number): void {
    if (level < 0 || Number(level) !== level) {
        return;
    }

    for (let i = 0; i <= level; i++) {
        let prev = 1;
        let row = '';
        process.stdout.write(generateStringWithSpaces(level - i));
        for (let j = 0; j <= i; j++) {
            // [i, j]
           // console.log(prev);
           process.stdout.write(`${prev % 2 ? 'Q' : '.'}   `);
            prev = prev * (i - j) / (j + 1); 
            

           
        }
      process.stdout.write(`\n`);
    }

}

drawSierpinski(52);
