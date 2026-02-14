async function writeFileCustom(filePath: string, content: string): Promise<Boolean> {
    const fs = require('fs');
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, (err: any) => {
            if(err) resolve(false);
            else resolve(true);
        });
    });
}   
function getFileName(languageType: string, isInput?: boolean): [status:boolean, fileName: string, command: string] { 
    switch (languageType) {
        case 'python':
            return [true,'codes/script.py', 'python3 codes/script.py < codes/input.txt'];
        case 'javascript':
            return [true,'codes/script.js', 'node codes/script.js < codes/input.txt'];
        case 'java':
            return [true,'codes/Main.java', 'javac codes/Main.java && java -cp codes Main < codes/input.txt'];
        case 'cpp':
            return [true,'codes/program.cpp', 'g++ codes/program.cpp -o codes/program && codes/program < codes/input.txt'];
        default:
            return [false, '', 'Unsupported language type'];
    }
}
export { writeFileCustom, getFileName };