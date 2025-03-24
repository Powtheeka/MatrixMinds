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

// Get matrix data
function getMatrix(matrix) {
    const rows = parseInt(document.getElementById(`rows${matrix}`).value);
    const cols = parseInt(document.getElementById(`cols${matrix}`).value);
    const matrixData = [];

    for (let i = 0; i < rows; i++) {
        matrixData[i] = [];
        for (let j = 0; j < cols; j++) {
            // Parse the input and handle empty fields properly
            const value = document.getElementById(`${matrix}_${i}_${j}`).value;
            matrixData[i][j] = value === '' ? 0 : parseFloat(value);
        }
    }

    // Debug: Log matrix for validation
    console.log(`Matrix Data for ${matrix}:`, matrixData);
    return matrixData;
}

// Perform matrix operations
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

// Calculate Determinant
function calculateDeterminant(matrix) {
    const M = getMatrix(matrix);
    try {
        const det = math.det(M);
        displayResult([[det.toFixed(3)]]);
    } catch (error) {
        alert('Error calculating determinant: ' + error.message);
    }
}

// Calculate Inverse
function calculateInverse(matrix) {
    const M = getMatrix(matrix);
    try {
        const det = math.det(M);
        if (det === 0) {
            alert(`Matrix ${matrix} is singular and not invertible.`);
            return;
        }
        const inverse = math.inv(M);
        displayResult(inverse);
    } catch (error) {
        alert('Matrix is singular or not invertible.');
    }
}

// Calculate Eigenvalues
function calculateEigenvalues(matrix) {
    const M = getMatrix(matrix);
    try {
        const eigen = math.eigs(M);
        const realValues = eigen.values.map(v => parseFloat(math.re(v).toFixed(3))); // Extract real part
        displayResult([realValues]);
    } catch (error) {
        alert('Error calculating eigenvalues: ' + error.message);
    }
}

// ➕ NEW: Calculate Eigenvectors
function calculateEigenvectors(matrix) {
    const M = getMatrix(matrix);
    try {
        const eigen = math.eigs(M);
        displayResult(eigen.vectors);
    } catch (error) {
        alert('Error calculating eigenvectors: ' + error.message);
    }
}

// ➕ NEW: Diagonalization
function diagonalizeMatrix(matrix) {
    const M = getMatrix(matrix);
    try {
        const eigen = math.eigs(M);
        const D = math.diag(eigen.values);
        const P = eigen.vectors;
        const P_inv = math.inv(P);

        // Display D, P, and P⁻¹ in a formatted manner
        document.getElementById('result').innerHTML = `
            <strong>D:</strong><br>${formatMatrix(D._data || D)}
            <br><br>
            <strong>P:</strong><br>${formatMatrix(P._data || P)}
            <br><br>
            <strong>P⁻¹:</strong><br>${formatMatrix(P_inv._data || P_inv)}
        `;
    } catch (error) {
        alert('Error in diagonalizing the matrix: ' + error.message);
    }
}

// ➕ NEW: Calculate Rank
function calculateRank(matrix) {
    const M = getMatrix(matrix);
    try {
        const qr = math.qr(M);  // Using QR decomposition to determine rank
        const R = qr.R._data || qr.R; // Extract R matrix correctly
        const rank = R.filter(row => row.some(value => Math.abs(value) > 1e-10)).length;
        displayResult([[`Rank: ${rank}`]]);
    } catch (error) {
        alert('Error calculating rank: ' + error.message);
    }
}

// ➕ NEW: Calculate Index and Signature
function calculateIndexSignature(matrix) {
    const M = getMatrix(matrix);
    try {
        const eigen = math.eigs(M);
        const eigenvalues = eigen.values.map(v => parseFloat(v));

        // Count positive, negative, and zero eigenvalues
        let positive = 0, negative = 0, zero = 0;
        eigenvalues.forEach(v => {
            if (Math.abs(v) < 1e-10) {
                zero++;
            } else if (v > 0) {
                positive++;
            } else {
                negative++;
            }
        });

        // Display Index, Signature, and Eigenvalue info
        displayResult([
            [`Positive Eigenvalues: ${positive}`],
            [`Negative Eigenvalues: ${negative}`],
            [`Zero Eigenvalues: ${zero}`],
            [`Signature: ${positive - negative}`]
        ]);
    } catch (error) {
        alert('Error calculating index and signature: ' + error.message);
    }
}

// Generate LaTeX Output
function generateLaTeX(matrix, matrixName) {
    const M = getMatrix(matrix);
    let latex = `\\begin{bmatrix}`;
    for (let i = 0; i < M.length; i++) {
        latex += M[i].join(' & ');
        if (i !== M.length - 1) latex += ` \\\\ `;
    }
    latex += `\\end{bmatrix}`;

    document.getElementById('latexResult').innerHTML = `LaTeX for Matrix ${matrixName}:<br> \\[${latex}\\]`;
    MathJax.typeset();
}

// 📚 Helper function to format matrices for display
function formatMatrix(matrix) {
    let html = '<table border="1" cellspacing="0" cellpadding="5">';
    matrix.forEach(row => {
        html += '<tr>';
        row.forEach(value => {
            html += `<td>${parseFloat(value).toFixed(3)}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';
    return html;
}

// Display Results
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
