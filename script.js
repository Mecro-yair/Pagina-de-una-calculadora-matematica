let currentMethod = null;

function toggleCredits() {
    document.getElementById('creditsModal').classList.toggle('show');
}

document.addEventListener('click', function(e) {
    const modal = document.getElementById('creditsModal');
    if (e.target === modal) modal.classList.remove('show');
});

function sumaMatrices(A, B) {
    return A.map((row, i) => row.map((val, j) => val + B[i][j]));
}

function multiplicacionMatrices(A, B) {
    return A.map((row, i) => 
        B[0].map((_, j) => 
            row.reduce((sum, val, k) => sum + val * B[k][j], 0)
        )
    );
}

function determinante(A) {
    const n = A.length;
    if (n === 1) return A[0][0];
    if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
    return A[0].reduce((sum, val, j) => {
        const sub = A.slice(1).map(row => row.filter((_, k) => k !== j));
        return sum + Math.pow(-1, j) * val * determinante(sub);
    }, 0);
}

function matrizInversa(A) {
    const n = A.length;
    const det = determinante(A);
    if (Math.abs(det) < 1e-10) throw new Error("Matriz singular");
    const aug = A.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]);
    for (let k = 0; k < n; k++) {
        const pivot = aug[k][k];
        for (let j = 0; j < 2 * n; j++) aug[k][j] /= pivot;
        for (let i = 0; i < n; i++) {
            if (i !== k) {
                const f = aug[i][k];
                for (let j = 0; j < 2 * n; j++) aug[i][j] -= f * aug[k][j];
            }
        }
    }
    return aug.map(row => row.slice(n));
}

function gaussElimination(A, b) {
    const n = b.length;
    const M = A.map((row, i) => [...row, b[i]]);
    for (let k = 0; k < n; k++) {
        let maxRow = k;
        for (let i = k + 1; i < n; i++) {
            if (Math.abs(M[i][k]) > Math.abs(M[maxRow][k])) maxRow = i;
        }
        [M[k], M[maxRow]] = [M[maxRow], M[k]];
        for (let i = k + 1; i < n; i++) {
            const f = M[i][k] / M[k][k];
            for (let j = k; j <= n; j++) M[i][j] -= f * M[k][j];
        }
    }
    const x = Array(n);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = (M[i][n] - M[i].slice(i + 1, n).reduce((s, v, j) => s + v * x[i + 1 + j], 0)) / M[i][i];
    }
    return x;
}

function gaussJordan(A, b) {
    const n = b.length;
    const M = A.map((row, i) => [...row, b[i]]);
    for (let k = 0; k < n; k++) {
        const p = M[k][k];
        for (let j = 0; j <= n; j++) M[k][j] /= p;
        for (let i = 0; i < n; i++) {
            if (i !== k) {
                const f = M[i][k];
                for (let j = 0; j <= n; j++) M[i][j] -= f * M[k][j];
            }
        }
    }
    return M.map(row => row[n]);
}

function jacobi(A, b, tol = 1e-6, maxIter = 100) {
    const n = b.length;
    let x = Array(n).fill(0);
    for (let iter = 0; iter < maxIter; iter++) {
        const xNew = x.map((_, i) => (b[i] - A[i].reduce((s, v, j) => s + (j !== i ? v * x[j] : 0), 0)) / A[i][i]);
        if (Math.max(...xNew.map((v, i) => Math.abs(v - x[i]))) < tol) return { x: xNew, iterations: iter + 1 };
        x = xNew;
    }
    return { x, iterations: maxIter };
}

function gaussSeidel(A, b, tol = 1e-6, maxIter = 100) {
    const n = b.length;
    let x = Array(n).fill(0);
    for (let iter = 0; iter < maxIter; iter++) {
        const xOld = [...x];
        for (let i = 0; i < n; i++) {
            x[i] = (b[i] - A[i].reduce((s, v, j) => s + (j !== i ? v * x[j] : 0), 0)) / A[i][i];
        }
        if (Math.max(...x.map((v, i) => Math.abs(v - xOld[i]))) < tol) return { x, iterations: iter + 1 };
    }
    return { x, iterations: maxIter };
}

function bisection(f, a, b, tol = 1e-8, maxIt = 100) {
    let fa = f(a), fb = f(b);
    if (fa * fb > 0) throw new Error("No hay cambio de signo");
    const rows = [];
    for (let k = 1; k <= maxIt; k++) {
        const r = (a + b) / 2, fr = f(r);
        rows.push({ k, a, b, r, fr });
        if (Math.abs(fr) < tol || (b - a) / 2 < tol) break;
        if (fa * fr < 0) { b = r; fb = fr; } else { a = r; fa = fr; }
    }
    return rows;
}

function secant(f, x0, x1, tol = 1e-8, maxIt = 100) {
    const rows = [];
    for (let k = 1; k <= maxIt; k++) {
        const fx0 = f(x0), fx1 = f(x1);
        if (Math.abs(fx1 - fx0) < 1e-15) throw new Error("Denominador cero");
        const x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0), fx2 = f(x2);
        rows.push({ k, x0, x1, x2, fx1, fx2 });
        if (Math.abs(x2 - x1) < tol || Math.abs(fx2) < tol) break;
        x0 = x1; x1 = x2;
    }
    return rows;
}

function parseMatrix(s) { return s.trim().split('\n').map(r => r.trim().split(/\s+/).map(parseFloat)); }
function parseVector(s) { return s.trim().split(/\s+/).map(parseFloat); }
function formatMatrix(M) { return M.map(r => r.map(x => x.toFixed(4)).join('  ')).join('\n'); }
function formatVector(v) { return v.map(x => x.toFixed(6)).join('\n'); }

function showResult(content, isError = false, isWarning = false) {
    const sec = document.getElementById('resultSection');
    const cont = document.getElementById('resultContent');
    sec.className = 'result-section show';
    if (isError) sec.classList.add('error');
    if (isWarning) sec.classList.add('warning');
    cont.textContent = content;
    document.getElementById('plotSection').style.display = 'none';
}

function preprocessEq(eq, n) {
    const vars = ['x', 'y', 'z', 'w', 'u', 'v', 't', 's', 'r', 'q'];
    let p = eq.trim()
        .replace(/\bsen\(/g, 'Math.sin(')
        .replace(/\bcos\(/g, 'Math.cos(')
        .replace(/\btan\(/g, 'Math.tan(')
        .replace(/\bln\(/g, 'Math.log(')
        .replace(/\blog\(/g, 'Math.log10(')
        .replace(/\bexp\(/g, 'Math.exp(')
        .replace(/\b(raiz|sqrt)\(/g, 'Math.sqrt(')
        .replace(/²/g, '**2').replace(/³/g, '**3');
    for (let i = 0; i < n; i++) p = p.replace(new RegExp(`\\b${vars[i]}\\b`, 'g'), `v[${i}]`);
    return p;
}

function solveMatrixOperation() {
    try {
        const A = parseMatrix(document.getElementById('matrixA').value);
        const B = parseMatrix(document.getElementById('matrixB').value);
        
        if (currentMethod === 'suma' && (A.length !== B.length || A[0].length !== B[0].length)) {
            showResult('⚠️ ERROR DE DIMENSIONES\n\nPara sumar matrices, ambas deben tener las mismas dimensiones.\n\n💡 SUGERENCIA: Si deseas combinar estas matrices, considera usar "Multiplicación" (las columnas de A deben igualar las filas de B).', true);
            return;
        }
        
        if (currentMethod === 'multiplicacion' && A[0].length !== B.length) {
            showResult(`⚠️ ERROR DE DIMENSIONES\n\nPara multiplicar A×B, el número de columnas de A (${A[0].length}) debe igualar el número de filas de B (${B.length}).\n\n💡 SUGERENCIA: Verifica las dimensiones o intenta multiplicar B×A si tiene sentido para tu problema.`, true);
            return;
        }
        
        const result = currentMethod === 'suma' ? sumaMatrices(A, B) : multiplicacionMatrices(A, B);
        showResult(`Resultado de A ${currentMethod === 'suma' ? '+' : '×'} B:\n\n${formatMatrix(result)}`);
    } catch (e) { showResult('Error: ' + e.message, true); }
}

function solveMatrixSingle() {
    try {
        const M = parseMatrix(document.getElementById('matrix').value);
        
        if (M.length !== M[0].length) {
            showResult(`⚠️ MATRIZ NO CUADRADA\n\nLa matriz es de ${M.length}×${M[0].length}. ${currentMethod === 'determinante' ? 'El determinante' : 'La inversa'} solo se puede calcular para matrices cuadradas (n×n).\n\n💡 SUGERENCIA: Para matrices rectangulares, considera usar la pseudoinversa (no disponible aquí) o reformula tu problema.`, true);
            return;
        }
        
        if (currentMethod === 'determinante') {
            showResult('Determinante: ' + determinante(M).toFixed(6));
        } else {
            const det = determinante(M);
            if (Math.abs(det) < 1e-10) {
                showResult('⚠️ MATRIZ SINGULAR (NO INVERTIBLE)\n\nEl determinante es prácticamente cero, por lo que esta matriz no tiene inversa.\n\n💡 SUGERENCIA: Si necesitas resolver un sistema lineal Ax=b, usa "Gauss" o "Gauss-Jordan" que pueden identificar si el sistema tiene solución única, infinitas soluciones, o ninguna.', true);
                return;
            }
            showResult('Matriz Inversa:\n\n' + formatMatrix(matrizInversa(M)));
        }
    } catch (e) { showResult('Error: ' + e.message, true); }
}

function solveLinearSystem() {
    try {
        const A = parseMatrix(document.getElementById('matrixA').value);
        const b = parseVector(document.getElementById('vectorB').value);
        
        if (A.length !== b.length) {
            showResult(`⚠️ DIMENSIONES INCOMPATIBLES\n\nLa matriz A tiene ${A.length} filas pero el vector b tiene ${b.length} elementos. Deben coincidir.\n\nVerifica tu entrada de datos.`, true);
            return;
        }
        
        if (A.length !== A[0].length) {
            showResult(`⚠️ SISTEMA RECTANGULAR\n\nLa matriz es ${A.length}×${A[0].length}. Los métodos disponibles requieren matrices cuadradas.\n\n💡 SUGERENCIA: Para sistemas sobredeterminados o subdeterminados, considera usar mínimos cuadrados u otros métodos especializados.`, true);
            return;
        }
        
        if (['jacobi', 'gauss-seidel'].includes(currentMethod)) {
            let diagonalDominante = true;
            for (let i = 0; i < A.length; i++) {
                const suma = A[i].reduce((s, v, j) => s + (i !== j ? Math.abs(v) : 0), 0);
                if (Math.abs(A[i][i]) <= suma) {
                    diagonalDominante = false;
                    break;
                }
            }
            if (!diagonalDominante) {
                showResult(`⚠️ MATRIZ NO DIAGONALMENTE DOMINANTE\n\nLos métodos iterativos (Jacobi/Gauss-Seidel) pueden no converger para esta matriz.\n\n💡 SUGERENCIA: Usa "Gauss" o "Gauss-Jordan" que garantizan encontrar la solución exacta en menos iteraciones para sistemas pequeños como este.`, false, true);
            }
        }
        
        let result, output;
        if (currentMethod === 'gauss') {
            result = gaussElimination(A, b);
            output = 'Solución (Gauss):\n\n' + formatVector(result);
        } else if (currentMethod === 'gauss-jordan') {
            result = gaussJordan(A, b);
            output = 'Solución (Gauss-Jordan):\n\n' + formatVector(result);
        } else if (currentMethod === 'jacobi') {
            result = jacobi(A, b);
            output = `Solución (Jacobi):\n\n${formatVector(result.x)}\n\nIteraciones: ${result.iterations}`;
            if (result.iterations >= 100) {
                output += '\n\n⚠️ ADVERTENCIA: Se alcanzó el máximo de iteraciones. Considera usar Gauss-Seidel (converge más rápido) o métodos directos.';
            }
        } else {
            result = gaussSeidel(A, b);
            output = `Solución (Gauss-Seidel):\n\n${formatVector(result.x)}\n\nIteraciones: ${result.iterations}`;
            if (result.iterations >= 100) {
                output += '\n\n⚠️ ADVERTENCIA: Se alcanzó el máximo de iteraciones. Usa "Gauss" o "Gauss-Jordan" para una solución exacta.';
            }
        }
        showResult(output);
    } catch (e) { showResult('Error: ' + e.message, true); }
}

function solveNonLinear() {
    try {
        const eqs = document.getElementById('equations').value.trim().split('\n').filter(e => e.trim());
        const initial = parseVector(document.getElementById('initial').value);
        const proc = eqs.map(eq => preprocessEq(eq, initial.length));
        const f = v => proc.map(eq => eval(eq));
        let v = [...initial];
        const h = 1e-8, tol = 1e-6, maxIter = 100;
        let finalIter = 0;
        for (let iter = 0; iter < maxIter; iter++) {
            finalIter = iter + 1;
            const fv = f(v);
            if (Math.sqrt(fv.reduce((s, x) => s + x * x, 0)) < tol) break;
            const J = fv.map((_, i) => v.map((_, j) => {
                const vh = [...v]; vh[j] += h;
                return (f(vh)[i] - fv[i]) / h;
            }));
            const delta = gaussElimination(J, fv.map(x => -x));
            v = v.map((x, i) => x + delta[i]);
            if (Math.max(...delta.map(Math.abs)) < tol) break;
        }
        const err = Math.sqrt(f(v).reduce((s, x) => s + x * x, 0));
        const vars = ['x', 'y', 'z', 'w', 'u'];
        let output = 'Solución aproximada:\n\n';
        v.forEach((val, i) => output += `${vars[i]} = ${val.toFixed(10)}\n`);
        output += `\nIteraciones: ${finalIter}\nError residual: ${err.toExponential(4)}`;
        showResult(output);
        if (initial.length === 2) {
            document.getElementById('plotSection').style.display = 'block';
            setTimeout(() => plotSystem(proc, v), 100);
        }
    } catch (e) { showResult('Error: ' + e.message, true); }
}

function solvePuntoFijo() {
    try {
        const gFuncs = document.getElementById('equations').value.trim().split('\n').filter(e => e.trim());
        const initial = parseVector(document.getElementById('initial').value);
        if (gFuncs.length !== initial.length) throw new Error("Número de funciones debe igualar variables");
        const proc = gFuncs.map(g => preprocessEq(g, initial.length));
        const g = v => proc.map(eq => eval(eq));
        let v = [...initial];
        const tol = 1e-8, maxIter = 100;
        let finalIter = 0, history = [];
        
        let diverging = false;
        for (let k = 1; k <= maxIter; k++) {
            finalIter = k;
            const vNew = g(v);
            const err = Math.max(...vNew.map((x, i) => Math.abs(x - v[i])));
            history.push({ iter: k, vNew, err });
            
            if (vNew.some(x => !isFinite(x))) {
                diverging = true;
                break;
            }
            
            if (k > 10 && err > history[k - 2].err * 0.95) {
                diverging = true;
            }
            
            v = vNew;
            if (err < tol) break;
        }
        
        if (diverging || finalIter >= maxIter) {
            showResult('⚠️ MÉTODO DE PUNTO FIJO DIVERGIENDO\n\nLa iteración no converge a una solución. Esto ocurre cuando |g\'(x)| >= 1 cerca de la raíz.\n\n💡 SUGERENCIAS:\n- Reformula las ecuaciones de otra forma (x = g(x))\n- Usa "Ec. No Lineales" (Newton multivariable) que es más robusto\n- Prueba "Newton Modificado" si tienes un buen punto inicial\n- Verifica que el sistema tenga solución real', false, true);
            return;
        }
        
        const vars = ['x', 'y', 'z', 'w', 'u'];
        let output = 'Solución (Punto Fijo):\n\n';
        v.forEach((val, i) => output += `${vars[i]} = ${val.toFixed(10)}\n`);
        output += `\nIteraciones: ${finalIter}\nError final: ${history[history.length - 1].err.toExponential(4)}`;
        
        if (finalIter > 50) {
            output += '\n\n💡 NOTA: Convergencia lenta. Newton o Newton Modificado convergen más rápido.';
        }
        
        showResult(output);
    } catch (e) { showResult('Error: ' + e.message, true); }
}

function solveNewtonModificado() {
    try {
        const eqs = document.getElementById('equations').value.trim().split('\n').filter(e => e.trim());
        const initial = parseVector(document.getElementById('initial').value);
        if (eqs.length !== initial.length) throw new Error("Número de ecuaciones debe igualar variables");
        const proc = eqs.map(eq => preprocessEq(eq, initial.length));
        const f = v => proc.map(eq => eval(eq));
        const h = 1e-8;
        const f0 = f(initial);
        const J0 = f0.map((_, i) => initial.map((_, j) => {
            const vh = [...initial]; vh[j] += h;
            return (f(vh)[i] - f0[i]) / h;
        }));
        let v = [...initial];
        const tol = 1e-8, maxIter = 50;
        let finalIter = 0, history = [];
        for (let k = 1; k <= maxIter; k++) {
            finalIter = k;
            const fv = f(v);
            const delta = gaussElimination(J0, fv.map(x => -x));
            v = v.map((x, i) => x + delta[i]);
            const err = Math.max(...delta.map(Math.abs));
            const resnorm = Math.sqrt(fv.reduce((s, x) => s + x * x, 0));
            history.push({ iter: k, err, resnorm });
            if (err < tol && resnorm < tol) break;
        }
        const vars = ['x', 'y', 'z', 'w', 'u'];
        let output = 'Solución (Newton Modificado):\n\n';
        v.forEach((val, i) => output += `${vars[i]} = ${val.toFixed(10)}\n`);
        output += `\nIteraciones: ${finalIter}\nError: ${history[history.length - 1].err.toExponential(4)}`;
        output += `\nNorma residual: ${history[history.length - 1].resnorm.toExponential(4)}`;
        output += '\n\nNOTA: Jacobiano calculado solo en x₀';
        showResult(output);
    } catch (e) { showResult('Error: ' + e.message, true); }
}

function solveRootFinding() {
    try {
        let funcStr = document.getElementById('function').value
            .replace(/\bsen\(/g, 'Math.sin(').replace(/\bcos\(/g, 'Math.cos(')
            .replace(/\btan\(/g, 'Math.tan(').replace(/\bln\(/g, 'Math.log(')
            .replace(/\blog\(/g, 'Math.log10(').replace(/\bexp\(/g, 'Math.exp(')
            .replace(/\b(raiz|sqrt)\(/g, 'Math.sqrt(').replace(/²/g, '**2').replace(/³/g, '**3');
        const f = x => eval(funcStr);
        const [a, b] = parseVector(document.getElementById('interval').value);
        
        const fa = f(a), fb = f(b);
        
        if (Math.abs(fa) < 1e-6) {
            showResult(`✓ El punto inicial a=${a} ya es una raíz aproximada\n\nf(${a}) ≈ ${fa.toExponential(4)}\n\nNo es necesario aplicar el método.`);
            return;
        }
        
        if (Math.abs(fb) < 1e-6) {
            showResult(`✓ El punto inicial b=${b} ya es una raíz aproximada\n\nf(${b}) ≈ ${fb.toExponential(4)}\n\nNo es necesario aplicar el método.`);
            return;
        }
        
        if (currentMethod === 'biseccion' && fa * fb > 0) {
            showResult(`⚠️ NO HAY CAMBIO DE SIGNO\n\nf(${a}) = ${fa.toFixed(4)}\nf(${b}) = ${fb.toFixed(4)}\n\nEl método de Bisección requiere que f(a) y f(b) tengan signos opuestos.\n\n💡 SUGERENCIAS:\n- Prueba otro intervalo donde la función cambie de signo\n- Usa "Secante" si tienes dos puntos cercanos a la raíz\n- Grafica la función para visualizar dónde cruza el eje x`, false, true);
            return;
        }
        
        let rows, output;
        if (currentMethod === 'biseccion') {
            rows = bisection(f, a, b);
            output = 'Método de Bisección:\n\nIter\ta\t\tb\t\tr\t\tf(r)\n';
            rows.slice(0, 6).forEach(r => output += `${r.k}\t${r.a.toFixed(6)}\t${r.b.toFixed(6)}\t${r.r.toFixed(6)}\t${r.fr.toFixed(8)}\n`);
            if (rows.length > 6) output += `...\n${rows[rows.length - 1].k}\t${rows[rows.length - 1].r.toFixed(6)}\t\t\t${rows[rows.length - 1].fr.toFixed(8)}\n`;
            output += `\nRaíz aproximada: ${rows[rows.length - 1].r.toFixed(10)}\nIteraciones: ${rows.length}`;
        } else {
            rows = secant(f, a, b);
            output = 'Método de la Secante:\n\nIter\tx0\t\tx1\t\tx2\t\tf(x2)\n';
            rows.forEach(r => output += `${r.k}\t${r.x0.toFixed(6)}\t${r.x1.toFixed(6)}\t${r.x2.toFixed(6)}\t${r.fx2.toFixed(8)}\n`);
            output += `\nRaíz aproximada: ${rows[rows.length - 1].x2.toFixed(10)}\nIteraciones: ${rows.length}`;
            
            if (rows.length >= 50) {
                output += '\n\n💡 NOTA: Convergencia lenta. Si tienes el intervalo con cambio de signo, Bisección puede ser más confiable.';
            }
        }
        showResult(output);
    } catch (e) { 
        if (e.message === "Denominador cero") {
            showResult('⚠️ DIVISIÓN POR CERO EN SECANTE\n\nLos valores f(x₀) y f(x₁) son iguales, causando división por cero.\n\n💡 SUGERENCIAS:\n- Elige puntos iniciales más separados\n- Usa "Bisección" si conoces un intervalo con cambio de signo\n- Verifica que la función no sea constante en ese rango', false, true);
        } else {
            showResult('Error: ' + e.message, true);
        }
    }
}

function plotSystem(eqs, sol) {
    const canvas = document.getElementById('plotCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    
    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(0, 0, w, h);
    
    const [solX, solY] = sol;
    const range = 4;
    const xMin = solX - range, xMax = solX + range;
    const yMin = solY - range, yMax = solY + range;
    
    const toPixelX = x => ((x - xMin) / (xMax - xMin)) * w;
    const toPixelY = y => h - ((y - yMin) / (yMax - yMin)) * h;
    
    ctx.strokeStyle = '#2a2a3e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 20; i++) {
        ctx.beginPath();
        ctx.moveTo(toPixelX(xMin + (xMax - xMin) * i / 20), 0);
        ctx.lineTo(toPixelX(xMin + (xMax - xMin) * i / 20), h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, toPixelY(yMin + (yMax - yMin) * i / 20));
        ctx.lineTo(w, toPixelY(yMin + (yMax - yMin) * i / 20));
        ctx.stroke();
    }
    
    ctx.strokeStyle = '#4a4a5e';
    ctx.lineWidth = 2;
    if (yMin <= 0 && yMax >= 0) {
        ctx.beginPath();
        ctx.moveTo(0, toPixelY(0));
        ctx.lineTo(w, toPixelY(0));
        ctx.stroke();
    }
    if (xMin <= 0 && xMax >= 0) {
        ctx.beginPath();
        ctx.moveTo(toPixelX(0), 0);
        ctx.lineTo(toPixelX(0), h);
        ctx.stroke();
    }
    
    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
        const x = xMin + (xMax - xMin) * i / 4;
        const yPos = (yMin <= 0 && yMax >= 0) ? toPixelY(0) + 15 : h - 5;
        ctx.fillText(x.toFixed(1), toPixelX(x), yPos);
    }
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const y = yMin + (yMax - yMin) * i / 4;
        const xPos = (xMin <= 0 && xMax >= 0) ? toPixelX(0) - 5 : 35;
        ctx.fillText(y.toFixed(1), xPos, toPixelY(y) + 4);
    }
    
    const colors = ['#f87171', '#60a5fa'];
    const gridSize = 500;
    
    eqs.forEach((eq, idx) => {
        const grid = [];
        for (let i = 0; i <= gridSize; i++) {
            grid[i] = [];
            for (let j = 0; j <= gridSize; j++) {
                const x = xMin + (xMax - xMin) * i / gridSize;
                const y = yMin + (yMax - yMin) * j / gridSize;
                const v = [x, y];
                try { grid[i][j] = eval(eq); } catch { grid[i][j] = NaN; }
            }
        }
        
        ctx.strokeStyle = colors[idx];
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const v00 = grid[i][j], v10 = grid[i + 1][j];
                const v01 = grid[i][j + 1], v11 = grid[i + 1][j + 1];
                
                if ([v00, v10, v01, v11].some(isNaN)) continue;
                
                const signs = [v00 > 0, v10 > 0, v01 > 0, v11 > 0];
                if (signs.some(s => s) && signs.some(s => !s)) {
                    const x1 = xMin + (xMax - xMin) * i / gridSize;
                    const x2 = xMin + (xMax - xMin) * (i + 1) / gridSize;
                    const y1 = yMin + (yMax - yMin) * j / gridSize;
                    const y2 = yMin + (yMax - yMin) * (j + 1) / gridSize;
                    
                    const pts = [];
                    if ((v00 > 0) !== (v10 > 0)) pts.push([x1 + Math.abs(v00) / (Math.abs(v00) + Math.abs(v10)) * (x2 - x1), y1]);
                    if ((v10 > 0) !== (v11 > 0)) pts.push([x2, y1 + Math.abs(v10) / (Math.abs(v10) + Math.abs(v11)) * (y2 - y1)]);
                    if ((v01 > 0) !== (v11 > 0)) pts.push([x1 + Math.abs(v01) / (Math.abs(v01) + Math.abs(v11)) * (x2 - x1), y2]);
                    if ((v00 > 0) !== (v01 > 0)) pts.push([x1, y1 + Math.abs(v00) / (Math.abs(v00) + Math.abs(v01)) * (y2 - y1)]);
                    
                    if (pts.length >= 2) {
                        ctx.beginPath();
                        ctx.moveTo(toPixelX(pts[0][0]), toPixelY(pts[0][1]));
                        for (let k = 1; k < pts.length; k++) ctx.lineTo(toPixelX(pts[k][0]), toPixelY(pts[k][1]));
                        ctx.stroke();
                    }
                }
            }
        }
    });
    
    ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(toPixelX(solX), toPixelY(solY), 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#1e1e2e';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(30, 30, 46, 0.9)';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    const label = `(${solX.toFixed(3)}, ${solY.toFixed(3)})`;
    ctx.font = 'bold 12px Arial';
    const labelWidth = ctx.measureText(label).width + 16;
    const labelX = toPixelX(solX) + 15;
    const labelY = toPixelY(solY) - 20;
    ctx.fillRect(labelX - 8, labelY - 16, labelWidth, 24);
    ctx.strokeRect(labelX - 8, labelY - 16, labelWidth, 24);
    ctx.fillStyle = '#c4b5fd';
    ctx.textAlign = 'left';
    ctx.fillText(label, labelX, labelY);
    
    const legendX = 15, legendY = 15;
    ctx.fillStyle = 'rgba(30, 30, 46, 0.95)';
    ctx.strokeStyle = '#3d3d54';
    ctx.lineWidth = 2;
    ctx.fillRect(legendX - 5, legendY - 5, 140, 75);
    ctx.strokeRect(legendX - 5, legendY - 5, 140, 75);
    ctx.font = 'bold 13px Arial';
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(legendX, legendY + 5);
    ctx.lineTo(legendX + 25, legendY + 5);
    ctx.stroke();
    ctx.fillStyle = '#e5e5e5';
    ctx.textAlign = 'left';
    ctx.fillText('Ecuación 1', legendX + 35, legendY + 9);
    ctx.strokeStyle = colors[1];
    ctx.beginPath();
    ctx.moveTo(legendX, legendY + 28);
    ctx.lineTo(legendX + 25, legendY + 28);
    ctx.stroke();
    ctx.fillStyle = '#e5e5e5';
    ctx.fillText('Ecuación 2', legendX + 35, legendY + 32);
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(legendX + 12, legendY + 54, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#e5e5e5';
    ctx.fillText('Solución', legendX + 35, legendY + 58);
}

function createInputUI(method) {
    const sec = document.getElementById('inputSection');
    let html = '';
    if (['suma', 'multiplicacion'].includes(method)) {
        html = `<div class="input-group"><label>Matriz A:</label><textarea id="matrixA" placeholder="1 2&#10;3 4"></textarea></div>
                <div class="input-group"><label>Matriz B:</label><textarea id="matrixB" placeholder="5 6&#10;7 8"></textarea></div>
                <button class="solve-btn" onclick="solveMatrixOperation()">Calcular</button>`;
    } else if (['determinante', 'inversa'].includes(method)) {
        html = `<div class="input-group"><label>Matriz:</label><textarea id="matrix" placeholder="4 2&#10;3 1"></textarea></div>
                <button class="solve-btn" onclick="solveMatrixSingle()">Calcular</button>`;
    } else if (['gauss', 'gauss-jordan', 'jacobi', 'gauss-seidel'].includes(method)) {
        html = `<div class="input-group"><label>Matriz A:</label><textarea id="matrixA" placeholder="2 3&#10;1 -1"></textarea></div>
                <div class="input-group"><label>Vector b:</label><input type="text" id="vectorB" placeholder="8 1"></div>
                <button class="solve-btn" onclick="solveLinearSystem()">Resolver</button>`;
    } else if (method === 'no-lineal') {
        html = `<div class="input-group"><label>Ecuaciones:</label><textarea id="equations" placeholder="x**2 + y**2 - 4&#10;exp(x) + y - 1"></textarea>
                <div class="help-text">Variables: x, y, z. Funciones: sen(), cos(), ln(), exp(), raiz()</div></div>
                <div class="input-group"><label>Punto inicial:</label><input type="text" id="initial" placeholder="0.5 0.5"></div>
                <button class="solve-btn" onclick="solveNonLinear()">Resolver</button>`;
    } else if (method === 'punto-fijo') {
        html = `<div class="input-group"><label>Funciones g(x):</label><textarea id="equations" placeholder="cos(y)&#10;sen(x)"></textarea>
                <div class="help-text">Sistema x = g(x). Escribir cada componente de g.</div></div>
                <div class="input-group"><label>Punto inicial:</label><input type="text" id="initial" placeholder="0.5 0.5"></div>
                <button class="solve-btn" onclick="solvePuntoFijo()">Resolver</button>`;
    } else if (method === 'newton-mod') {
        html = `<div class="input-group"><label>Ecuaciones f(x) = 0:</label><textarea id="equations" placeholder="x**2 + y + z - 4&#10;y**2 + z + x - 5"></textarea>
                <div class="help-text">Jacobiano calculado solo en x₀</div></div>
                <div class="input-group"><label>Punto inicial:</label><input type="text" id="initial" placeholder="1 1 1"></div>
                <button class="solve-btn" onclick="solveNewtonModificado()">Resolver</button>`;
    } else if (['biseccion', 'secante'].includes(method)) {
        html = `<div class="input-group"><label>Función f(x):</label><input type="text" id="function" placeholder="x**3 - x - 2">
                <div class="help-text">Funciones: sen(), cos(), ln(), exp(), raiz()</div></div>
                <div class="input-group"><label>Intervalo [a, b]:</label><input type="text" id="interval" placeholder="1 2"></div>
                <button class="solve-btn" onclick="solveRootFinding()">Resolver</button>`;
    }
    sec.innerHTML = html;
}

document.querySelectorAll('.method-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentMethod = this.dataset.method;
        createInputUI(currentMethod);
        document.getElementById('resultSection').classList.remove('show');
        document.getElementById('plotSection').style.display = 'none';
    });
});

document.querySelector('.method-btn').click();