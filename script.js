function generateMatrix(matrix) {
    const rows = document.getElementById(`rows${matrix}`).value;
    const cols = document.getElementById(`cols${matrix}`).value;
    const container = document.getElementById(`matrix${matrix}`);
    container.innerHTML = '';
    container.style.display = 'inline-grid';
    container.style.gridTemplateColumns = `repeat(${cols}, 50px)`;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            container.innerHTML += `<input id="${matrix}_${i}_${j}" type="number" step="any">`;
        }
    }
}

function getMatrix(matrix) {
    const rows = document.getElementById(`rows${matrix}`).value;
    const cols = document.getElementById(`cols${matrix}`).value;
    const matrixData = [];

    for (let i = 0; i < rows; i++) {
        matrixData[i] = [];
        for (let j = 0; j < cols; j++) {
            matrixData[i][j] = parseFloat(document.getElementById(`${matrix}_${i}_${j}`).value) || 0;
        }
    }
    return matrixData;
}

function performOperation(operation) {
    const A = getMatrix('A');
    const B = getMatrix('B');
    let result;

    try {
        if (operation === 'add') result = math.add(A, B);
        if (operation === 'subtract') result = math.subtract(A, B);
        if (operation === 'multiply') result = math.multiply(A, B);

        displayResult(result);
    } catch (error) {
        alert('Error in matrix operation: ' + error.message);
    }
}

function calculateDeterminant(matrix) {
    const M = getMatrix(matrix);
    try {
        const det = math.det(M);
        displayResult([[det.toFixed(3)]]);
    } catch (error) {
        alert('Error calculating determinant: ' + error.message);
    }
}

function calculateInverse(matrix) {
    const M = getMatrix(matrix);
    try {
        const inverse = math.inv(M);
        displayResult(inverse);
    } catch (error) {
        alert('Matrix is singular or not invertible.');
    }
}

function calculateEigenvalues(matrix) {
    const M = getMatrix(matrix);
    try {
        const eigen = math.eigs(M);
        displayResult([eigen.values.map(v => v.toFixed(3))]);
    } catch (error) {
        alert('Error calculating eigenvalues: ' + error.message);
    }
}

function generateLaTeX(matrix, matrixName) {
    const M = getMatrix(matrix);
    let latex = `\\begin{bmatrix}`;
    for (let i = 0; i < M.length; i++) {
        latex += M[i].join(' & ');
        if (i !== M.length - 1) latex += ` \\\\ `;
    }
    latex += `\\end{bmatrix}`;

    document.getElementById('latexResult').innerHTML = `LaTeX for Matrix ${matrixName}:<br> \${latex} \`;
    MathJax.typeset();
}

function displayResult(result) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';
    resultContainer.style.display = 'inline-grid';
    resultContainer.style.gridTemplateColumns = `repeat(${result[0].length}, 50px)`;

    result.forEach(row => {
        row.forEach(value => {
            resultContainer.innerHTML += `<div>${parseFloat(value).toFixed(3)}</div>`;
        });
    });
}
