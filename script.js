// ========================================
// VARIABLES GLOBALES
// ========================================
let metodoActual = null;

// ========================================
// FUNCIONES DE INTERFAZ
// ========================================

function mostrarOcultarCreditos() {
    const modal = document.getElementById('creditsModal');
    modal.classList.toggle('show');
}

document.addEventListener('click', function(evento) {
    const modal = document.getElementById('creditsModal');
    if (evento.target === modal) {
        modal.classList.remove('show');
    }
});

function mostrarResultado(texto, esError, esAdvertencia) {
    const seccionResultado = document.getElementById('resultSection');
    const contenidoResultado = document.getElementById('resultContent');
    
    seccionResultado.className = 'result-section show';
    
    if (esError) {
        seccionResultado.classList.add('error');
    }
    if (esAdvertencia) {
        seccionResultado.classList.add('warning');
    }
    
    contenidoResultado.textContent = texto;
    document.getElementById('plotSection').style.display = 'none';
}

// ========================================
// FUNCIONES DE CONVERSIÓN
// ========================================

function convertirTextoAMatriz(texto) {
    const filas = texto.trim().split('\n');
    const matriz = [];
    
    for (let i = 0; i < filas.length; i++) {
        const fila = filas[i].trim().split(/\s+/);
        const filaNumeros = [];
        
        for (let j = 0; j < fila.length; j++) {
            filaNumeros.push(parseFloat(fila[j]));
        }
        
        matriz.push(filaNumeros);
    }
    
    return matriz;
}

function convertirTextoAVector(texto) {
    const elementos = texto.trim().split(/\s+/);
    const vector = [];
    
    for (let i = 0; i < elementos.length; i++) {
        vector.push(parseFloat(elementos[i]));
    }
    
    return vector;
}

function convertirMatrizATexto(matriz) {
    let texto = '';
    
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            texto += matriz[i][j].toFixed(4);
            if (j < matriz[i].length - 1) {
                texto += '  ';
            }
        }
        if (i < matriz.length - 1) {
            texto += '\n';
        }
    }
    
    return texto;
}

function convertirVectorATexto(vector) {
    let texto = '';
    
    for (let i = 0; i < vector.length; i++) {
        texto += vector[i].toFixed(6);
        if (i < vector.length - 1) {
            texto += '\n';
        }
    }
    
    return texto;
}

// Detecta si los números son absurdos (divergencia)
function hayDivergencia(vector) {
    for (let i = 0; i < vector.length; i++) {
        if (Math.abs(vector[i]) > 1e10 || !isFinite(vector[i])) {
            return true;
        }
    }
    return false;
}

// Verifica si una matriz es diagonalmente dominante
function esDiagonalmenteDominante(matriz) {
    for (let i = 0; i < matriz.length; i++) {
        let suma = 0;
        for (let j = 0; j < matriz.length; j++) {
            if (i !== j) {
                suma += Math.abs(matriz[i][j]);
            }
        }
        if (Math.abs(matriz[i][i]) <= suma) {
            return false;
        }
    }
    return true;
}

// ========================================
// OPERACIONES CON MATRICES
// ========================================

function sumarMatrices(matrizA, matrizB) {
    const filas = matrizA.length;
    const columnas = matrizA[0].length;
    const resultado = [];
    
    for (let i = 0; i < filas; i++) {
        const fila = [];
        for (let j = 0; j < columnas; j++) {
            fila.push(matrizA[i][j] + matrizB[i][j]);
        }
        resultado.push(fila);
    }
    
    return resultado;
}

function multiplicarMatrices(matrizA, matrizB) {
    const filasA = matrizA.length;
    const columnasA = matrizA[0].length;
    const columnasB = matrizB[0].length;
    const resultado = [];
    
    for (let i = 0; i < filasA; i++) {
        const fila = [];
        for (let j = 0; j < columnasB; j++) {
            let suma = 0;
            for (let k = 0; k < columnasA; k++) {
                suma = suma + (matrizA[i][k] * matrizB[k][j]);
            }
            fila.push(suma);
        }
        resultado.push(fila);
    }
    
    return resultado;
}

function calcularDeterminante(matriz) {
    const n = matriz.length;
    
    if (n === 1) {
        return matriz[0][0];
    }
    
    if (n === 2) {
        return (matriz[0][0] * matriz[1][1]) - (matriz[0][1] * matriz[1][0]);
    }
    
    let determinante = 0;
    
    for (let j = 0; j < n; j++) {
        const submatriz = [];
        
        for (let i = 1; i < n; i++) {
            const filaSubmatriz = [];
            for (let k = 0; k < n; k++) {
                if (k !== j) {
                    filaSubmatriz.push(matriz[i][k]);
                }
            }
            submatriz.push(filaSubmatriz);
        }
        
        const signo = (j % 2 === 0) ? 1 : -1;
        determinante += signo * matriz[0][j] * calcularDeterminante(submatriz);
    }
    
    return determinante;
}

function calcularInversa(matriz) {
    const n = matriz.length;
    const det = calcularDeterminante(matriz);
    
    if (Math.abs(det) < 0.0000000001) {
        throw new Error("La matriz no tiene inversa (determinante = 0)");
    }
    
    const aumentada = [];
    for (let i = 0; i < n; i++) {
        const fila = [];
        
        for (let j = 0; j < n; j++) {
            fila.push(matriz[i][j]);
        }
        
        for (let j = 0; j < n; j++) {
            if (i === j) {
                fila.push(1);
            } else {
                fila.push(0);
            }
        }
        
        aumentada.push(fila);
    }
    
    for (let k = 0; k < n; k++) {
        const pivote = aumentada[k][k];
        for (let j = 0; j < 2 * n; j++) {
            aumentada[k][j] = aumentada[k][j] / pivote;
        }
        
        for (let i = 0; i < n; i++) {
            if (i !== k) {
                const factor = aumentada[i][k];
                for (let j = 0; j < 2 * n; j++) {
                    aumentada[i][j] = aumentada[i][j] - (factor * aumentada[k][j]);
                }
            }
        }
    }
    
    const inversa = [];
    for (let i = 0; i < n; i++) {
        const fila = [];
        for (let j = n; j < 2 * n; j++) {
            fila.push(aumentada[i][j]);
        }
        inversa.push(fila);
    }
    
    return inversa;
}

// ========================================
// SISTEMAS DE ECUACIONES LINEALES
// ========================================

function metodoGauss(matrizA, vectorB) {
    const n = vectorB.length;
    
    const aumentada = [];
    for (let i = 0; i < n; i++) {
        const fila = [];
        for (let j = 0; j < n; j++) {
            fila.push(matrizA[i][j]);
        }
        fila.push(vectorB[i]);
        aumentada.push(fila);
    }
    
    for (let k = 0; k < n; k++) {
        let filaMax = k;
        for (let i = k + 1; i < n; i++) {
            if (Math.abs(aumentada[i][k]) > Math.abs(aumentada[filaMax][k])) {
                filaMax = i;
            }
        }
        
        const temp = aumentada[k];
        aumentada[k] = aumentada[filaMax];
        aumentada[filaMax] = temp;
        
        for (let i = k + 1; i < n; i++) {
            const factor = aumentada[i][k] / aumentada[k][k];
            for (let j = k; j <= n; j++) {
                aumentada[i][j] = aumentada[i][j] - (factor * aumentada[k][j]);
            }
        }
    }
    
    const solucion = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        let suma = 0;
        for (let j = i + 1; j < n; j++) {
            suma = suma + (aumentada[i][j] * solucion[j]);
        }
        solucion[i] = (aumentada[i][n] - suma) / aumentada[i][i];
    }
    
    return solucion;
}

function metodoGaussJordan(matrizA, vectorB) {
    const n = vectorB.length;
    
    const aumentada = [];
    for (let i = 0; i < n; i++) {
        const fila = [];
        for (let j = 0; j < n; j++) {
            fila.push(matrizA[i][j]);
        }
        fila.push(vectorB[i]);
        aumentada.push(fila);
    }
    
    for (let k = 0; k < n; k++) {
        const pivote = aumentada[k][k];
        for (let j = 0; j <= n; j++) {
            aumentada[k][j] = aumentada[k][j] / pivote;
        }
        
        for (let i = 0; i < n; i++) {
            if (i !== k) {
                const factor = aumentada[i][k];
                for (let j = 0; j <= n; j++) {
                    aumentada[i][j] = aumentada[i][j] - (factor * aumentada[k][j]);
                }
            }
        }
    }
    
    const solucion = [];
    for (let i = 0; i < n; i++) {
        solucion.push(aumentada[i][n]);
    }
    
    return solucion;
}

function metodoJacobi(matrizA, vectorB) {
    const n = vectorB.length;
    const tolerancia = 0.000001;
    const maxIteraciones = 100;
    
    let x = new Array(n);
    for (let i = 0; i < n; i++) {
        x[i] = 0;
    }
    
    for (let iter = 0; iter < maxIteraciones; iter++) {
        const xNuevo = new Array(n);
        
        for (let i = 0; i < n; i++) {
            let suma = 0;
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    suma = suma + (matrizA[i][j] * x[j]);
                }
            }
            xNuevo[i] = (vectorB[i] - suma) / matrizA[i][i];
        }
        
        let maxDiferencia = 0;
        for (let i = 0; i < n; i++) {
            const diferencia = Math.abs(xNuevo[i] - x[i]);
            if (diferencia > maxDiferencia) {
                maxDiferencia = diferencia;
            }
        }
        
        x = xNuevo;
        
        if (maxDiferencia < tolerancia) {
            return { solucion: x, iteraciones: iter + 1 };
        }
    }
    
    return { solucion: x, iteraciones: maxIteraciones };
}

function metodoGaussSeidel(matrizA, vectorB) {
    const n = vectorB.length;
    const tolerancia = 0.000001;
    const maxIteraciones = 100;
    
    let x = new Array(n);
    for (let i = 0; i < n; i++) {
        x[i] = 0;
    }
    
    for (let iter = 0; iter < maxIteraciones; iter++) {
        const xAnterior = [];
        for (let i = 0; i < n; i++) {
            xAnterior.push(x[i]);
        }
        
        for (let i = 0; i < n; i++) {
            let suma = 0;
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    suma = suma + (matrizA[i][j] * x[j]);
                }
            }
            x[i] = (vectorB[i] - suma) / matrizA[i][i];
        }
        
        let maxDiferencia = 0;
        for (let i = 0; i < n; i++) {
            const diferencia = Math.abs(x[i] - xAnterior[i]);
            if (diferencia > maxDiferencia) {
                maxDiferencia = diferencia;
            }
        }
        
        if (maxDiferencia < tolerancia) {
            return { solucion: x, iteraciones: iter + 1 };
        }
    }
    
    return { solucion: x, iteraciones: maxIteraciones };
}

// ========================================
// ECUACIONES NO LINEALES (1 VARIABLE)
// ========================================

function metodoBiseccion(funcionTexto, a, b) {
    const tolerancia = 0.00000001;
    const maxIteraciones = 100;
    
    const f = function(x) {
        return eval(funcionTexto);
    };
    
    let fa = f(a);
    let fb = f(b);
    
    if (fa * fb > 0) {
        throw new Error("No hay cambio de signo en el intervalo");
    }
    
    const resultados = [];
    
    for (let k = 1; k <= maxIteraciones; k++) {
        const r = (a + b) / 2;
        const fr = f(r);
        
        resultados.push({
            iteracion: k,
            a: a,
            b: b,
            raiz: r,
            fr: fr
        });
        
        if (Math.abs(fr) < tolerancia || (b - a) / 2 < tolerancia) {
            break;
        }
        
        if (fa * fr < 0) {
            b = r;
            fb = fr;
        } else {
            a = r;
            fa = fr;
        }
    }
    
    return resultados;
}

function metodoSecante(funcionTexto, x0, x1) {
    const tolerancia = 0.00000001;
    const maxIteraciones = 100;
    
    const f = function(x) {
        return eval(funcionTexto);
    };
    
    const resultados = [];
    
    for (let k = 1; k <= maxIteraciones; k++) {
        const fx0 = f(x0);
        const fx1 = f(x1);
        
        if (Math.abs(fx1 - fx0) < 0.000000000000001) {
            throw new Error("División por cero en el método");
        }
        
        const x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
        const fx2 = f(x2);
        
        resultados.push({
            iteracion: k,
            x0: x0,
            x1: x1,
            x2: x2,
            fx1: fx1,
            fx2: fx2
        });
        
        if (Math.abs(x2 - x1) < tolerancia || Math.abs(fx2) < tolerancia) {
            break;
        }
        
        x0 = x1;
        x1 = x2;
    }
    
    return resultados;
}

// ========================================
// SISTEMAS NO LINEALES (MÚLTIPLES VARIABLES)
// ========================================

function preprocesarEcuacion(ecuacion, numVars) {
    const vars = ['x', 'y', 'z', 'w', 'u'];
    
    let resultado = ecuacion;
    resultado = resultado.replace(/\bsen\(/g, 'Math.sin(');
    resultado = resultado.replace(/\bcos\(/g, 'Math.cos(');
    resultado = resultado.replace(/\btan\(/g, 'Math.tan(');
    resultado = resultado.replace(/\bln\(/g, 'Math.log(');
    resultado = resultado.replace(/\blog\(/g, 'Math.log10(');
    resultado = resultado.replace(/\bexp\(/g, 'Math.exp(');
    resultado = resultado.replace(/\braiz\(/g, 'Math.sqrt(');
    resultado = resultado.replace(/\bsqrt\(/g, 'Math.sqrt(');
    resultado = resultado.replace(/²/g, '**2');
    resultado = resultado.replace(/³/g, '**3');
    
    for (let i = 0; i < numVars; i++) {
        resultado = resultado.replace(new RegExp('\\b' + vars[i] + '\\b', 'g'), 'v[' + i + ']');
    }
    
    return resultado;
}

function metodoNewton(ecuaciones, inicial) {
    const n = inicial.length;
    const h = 0.00000001;
    const tolerancia = 0.000001;
    const maxIter = 100;
    
    let v = [];
    for (let i = 0; i < n; i++) {
        v.push(inicial[i]);
    }
    
    let iteracion = 0;
    
    for (iteracion = 0; iteracion < maxIter; iteracion++) {
        // Evaluar F(v)
        const fv = [];
        for (let i = 0; i < n; i++) {
            fv.push(eval(ecuaciones[i]));
        }
        
        // Verificar convergencia
        let norma = 0;
        for (let i = 0; i < n; i++) {
            norma += fv[i] * fv[i];
        }
        norma = Math.sqrt(norma);
        
        if (norma < tolerancia) {
            break;
        }
        
        // Calcular Jacobiano
        const J = [];
        for (let i = 0; i < n; i++) {
            const filaJ = [];
            for (let j = 0; j < n; j++) {
                const vTemp = [];
                for (let k = 0; k < n; k++) {
                    vTemp.push(v[k]);
                }
                vTemp[j] += h;
                
                const vOriginal = v;
                v = vTemp;
                const fvh = eval(ecuaciones[i]);
                v = vOriginal;
                
                filaJ.push((fvh - fv[i]) / h);
            }
            J.push(filaJ);
        }
        
        // Resolver J * delta = -F
        const negF = [];
        for (let i = 0; i < n; i++) {
            negF.push(-fv[i]);
        }
        
        const delta = metodoGauss(J, negF);
        
        // Actualizar v
        for (let i = 0; i < n; i++) {
            v[i] = v[i] + delta[i];
        }
        
        // Verificar si delta es pequeño
        let maxDelta = 0;
        for (let i = 0; i < n; i++) {
            if (Math.abs(delta[i]) > maxDelta) {
                maxDelta = Math.abs(delta[i]);
            }
        }
        
        if (maxDelta < tolerancia) {
            break;
        }
    }
    
    return { solucion: v, iteraciones: iteracion + 1 };
}

function metodoPuntoFijo(funcionesG, inicial) {
    const n = inicial.length;
    const tolerancia = 0.00000001;
    const maxIter = 100;
    
    let v = [];
    for (let i = 0; i < n; i++) {
        v.push(inicial[i]);
    }
    
    let iteracion = 0;
    const historial = [];
    
    for (iteracion = 0; iteracion < maxIter; iteracion++) {
        const vNuevo = [];
        
        for (let i = 0; i < n; i++) {
            vNuevo.push(eval(funcionesG[i]));
        }
        
        // Verificar divergencia
        for (let i = 0; i < n; i++) {
            if (!isFinite(vNuevo[i]) || Math.abs(vNuevo[i]) > 1e10) {
                throw new Error("El método diverge");
            }
        }
        
        // Calcular error
        let maxError = 0;
        for (let i = 0; i < n; i++) {
            const error = Math.abs(vNuevo[i] - v[i]);
            if (error > maxError) {
                maxError = error;
            }
        }

        historial.push({
            iteracion: iteracion + 1,
            valores: vNuevo.slice(),
            error: maxError
        });
     
        v = vNuevo;
        
        if (maxError < tolerancia) {
            break;
        }
    }
    
    if (iteracion >= maxIter) {
        throw new Error("No convergió en " + maxIter + " iteraciones");
    }
    
    return { solucion: v, iteraciones: iteracion + 1, historial: historial };
}

function metodoNewtonModificado(ecuaciones, inicial) {
    const n = inicial.length;
    const h = 0.00000001;
    const tolerancia = 0.000001;
    const maxIter = 50;
    
    // Calcular Jacobiano solo una vez en el punto inicial
    const v0 = inicial;
    const fv0 = [];
    for (let i = 0; i < n; i++) {
        const v = v0;
        fv0.push(eval(ecuaciones[i]));
    }
    
    const J0 = [];
    for (let i = 0; i < n; i++) {
        const filaJ = [];
        for (let j = 0; j < n; j++) {
            const vTemp = [];
            for (let k = 0; k < n; k++) {
                vTemp.push(v0[k]);
            }
            vTemp[j] += h;
            
            const v = vTemp;
            const fvh = eval(ecuaciones[i]);
            
            filaJ.push((fvh - fv0[i]) / h);
        }
        J0.push(filaJ);
    }
    
    // Iterar con Jacobiano fijo
    let v = [];
    for (let i = 0; i < n; i++) {
        v.push(inicial[i]);
    }
    
    let iteracion = 0;
    const historial = [];
    
    for (iteracion = 0; iteracion < maxIter; iteracion++) {
        const fv = [];
        for (let i = 0; i < n; i++) {
            fv.push(eval(ecuaciones[i]));
        }
        
        const negF = [];
        for (let i = 0; i < n; i++) {
            negF.push(-fv[i]);
        }
        
        const delta = metodoGauss(J0, negF);
        
        for (let i = 0; i < n; i++) {
            v[i] = v[i] + delta[i];
        }
        
        let maxDelta = 0;
        for (let i = 0; i < n; i++) {
            if (Math.abs(delta[i]) > maxDelta) {
                maxDelta = Math.abs(delta[i]);
            }
        }

        historial.push({
            iteracion: iteracion + 1,
            valores: v.slice(),
            error: maxDelta
        });
        
        if (maxDelta < tolerancia) {
            break;
        }
    }
    
    return { solucion: v, iteraciones: iteracion + 1, historial: historial };
}

// ========================================
// FUNCIONES DE GRAFICACIÓN
// ========================================

function graficarSistema(ecuaciones, solucion) {
    const canvas = document.getElementById('plotCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(0, 0, w, h);
    
    const solX = solucion[0];
    const solY = solucion[1];
    const rango = 4;
    const xMin = solX - rango;
    const xMax = solX + rango;
    const yMin = solY - rango;
    const yMax = solY + rango;
    
    function toPixelX(x) {
        return ((x - xMin) / (xMax - xMin)) * w;
    }
    
    function toPixelY(y) {
        return h - ((y - yMin) / (yMax - yMin)) * h;
    }
    
    // Dibujar cuadrícula
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
    
    // Dibujar ejes
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
    
    // Dibujar ecuaciones
    const colores = ['#f87171', '#60a5fa'];
    const resolucion = 500;
    
    for (let eqIdx = 0; eqIdx < ecuaciones.length; eqIdx++) {
        const grid = [];
        for (let i = 0; i <= resolucion; i++) {
            grid[i] = [];
            for (let j = 0; j <= resolucion; j++) {
                const x = xMin + (xMax - xMin) * i / resolucion;
                const y = yMin + (yMax - yMin) * j / resolucion;
                const v = [x, y];
                try {
                    grid[i][j] = eval(ecuaciones[eqIdx]);
                } catch (e) {
                    grid[i][j] = NaN;
                }
            }
        }
        
        ctx.strokeStyle = colores[eqIdx];
        ctx.lineWidth = 3;
        
        for (let i = 0; i < resolucion; i++) {
            for (let j = 0; j < resolucion; j++) {
                const v00 = grid[i][j];
                const v10 = grid[i + 1][j];
                const v01 = grid[i][j + 1];
                const v11 = grid[i + 1][j + 1];
                
                if (isNaN(v00) || isNaN(v10) || isNaN(v01) || isNaN(v11)) continue;
                
                const signs = [v00 > 0, v10 > 0, v01 > 0, v11 > 0];
                const hayPositivo = signs[0] || signs[1] || signs[2] || signs[3];
                const hayNegativo = !signs[0] || !signs[1] || !signs[2] || !signs[3];
                
                if (hayPositivo && hayNegativo) {
                    const x1 = xMin + (xMax - xMin) * i / resolucion;
                    const x2 = xMin + (xMax - xMin) * (i + 1) / resolucion;
                    const y1 = yMin + (yMax - yMin) * j / resolucion;
                    const y2 = yMin + (yMax - yMin) * (j + 1) / resolucion;
                    
                    const pts = [];
                    if ((v00 > 0) !== (v10 > 0)) {
                        const t = Math.abs(v00) / (Math.abs(v00) + Math.abs(v10));
                        pts.push([x1 + t * (x2 - x1), y1]);
                    }
                    if ((v10 > 0) !== (v11 > 0)) {
                        const t = Math.abs(v10) / (Math.abs(v10) + Math.abs(v11));
                        pts.push([x2, y1 + t * (y2 - y1)]);
                    }
                    if ((v01 > 0) !== (v11 > 0)) {
                        const t = Math.abs(v01) / (Math.abs(v01) + Math.abs(v11));
                        pts.push([x1 + t * (x2 - x1), y2]);
                    }
                    if ((v00 > 0) !== (v01 > 0)) {
                        const t = Math.abs(v00) / (Math.abs(v00) + Math.abs(v01));
                        pts.push([x1, y1 + t * (y2 - y1)]);
                    }
                    
                    if (pts.length >= 2) {
                        ctx.beginPath();
                        ctx.moveTo(toPixelX(pts[0][0]), toPixelY(pts[0][1]));
                        for (let k = 1; k < pts.length; k++) {
                            ctx.lineTo(toPixelX(pts[k][0]), toPixelY(pts[k][1]));
                        }
                        ctx.stroke();
                    }
                }
            }
        }
    }
    
    // Dibujar solución
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
    
    // Etiqueta de solución
    ctx.fillStyle = 'rgba(30, 30, 46, 0.9)';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    const etiqueta = '(' + solX.toFixed(3) + ', ' + solY.toFixed(3) + ')';
    ctx.font = 'bold 12px Arial';
    const anchoEtiqueta = ctx.measureText(etiqueta).width + 16;
    const etiquetaX = toPixelX(solX) + 15;
    const etiquetaY = toPixelY(solY) - 20;
    ctx.fillRect(etiquetaX - 8, etiquetaY - 16, anchoEtiqueta, 24);
    ctx.strokeRect(etiquetaX - 8, etiquetaY - 16, anchoEtiqueta, 24);
    ctx.fillStyle = '#c4b5fd';
    ctx.textAlign = 'left';
    ctx.fillText(etiqueta, etiquetaX, etiquetaY);
    
    // Leyenda
    const leyendaX = 15;
    const leyendaY = 15;
    ctx.fillStyle = 'rgba(30, 30, 46, 0.95)';
    ctx.strokeStyle = '#3d3d54';
    ctx.lineWidth = 2;
    ctx.fillRect(leyendaX - 5, leyendaY - 5, 140, 75);
    ctx.strokeRect(leyendaX - 5, leyendaY - 5, 140, 75);
    
    ctx.font = 'bold 13px Arial';
    ctx.strokeStyle = colores[0];
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(leyendaX, leyendaY + 5);
    ctx.lineTo(leyendaX + 25, leyendaY + 5);
    ctx.stroke();
    ctx.fillStyle = '#e5e5e5';
    ctx.textAlign = 'left';
    ctx.fillText('Ecuación 1', leyendaX + 35, leyendaY + 9);
    
    ctx.strokeStyle = colores[1];
    ctx.beginPath();
    ctx.moveTo(leyendaX, leyendaY + 28);
    ctx.lineTo(leyendaX + 25, leyendaY + 28);
    ctx.stroke();
    ctx.fillStyle = '#e5e5e5';
    ctx.fillText('Ecuación 2', leyendaX + 35, leyendaY + 32);
    
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(leyendaX + 12, leyendaY + 54, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#e5e5e5';
    ctx.fillText('Solución', leyendaX + 35, leyendaY + 58);
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

function preprocesarFuncion(texto) {
    let resultado = texto;
    
    resultado = resultado.replace(/\bsen\(/g, 'Math.sin(');
    resultado = resultado.replace(/\bcos\(/g, 'Math.cos(');
    resultado = resultado.replace(/\btan\(/g, 'Math.tan(');
    resultado = resultado.replace(/\bln\(/g, 'Math.log(');
    resultado = resultado.replace(/\blog\(/g, 'Math.log10(');
    resultado = resultado.replace(/\bexp\(/g, 'Math.exp(');
    resultado = resultado.replace(/\braiz\(/g, 'Math.sqrt(');
    resultado = resultado.replace(/\bsqrt\(/g, 'Math.sqrt(');
    resultado = resultado.replace(/²/g, '**2');
    resultado = resultado.replace(/³/g, '**3');
    
    return resultado;
}

// ========================================
// FUNCIONES DE RESOLUCIÓN
// ========================================

function resolverOperacionMatrices() {
    try {
        const textoA = document.getElementById('matrixA').value;
        const textoB = document.getElementById('matrixB').value;
        
        const matrizA = convertirTextoAMatriz(textoA);
        const matrizB = convertirTextoAMatriz(textoB);
        
        if (metodoActual === 'suma') {
            if (matrizA.length !== matrizB.length || matrizA[0].length !== matrizB[0].length) {
                mostrarResultado('❌ Error: Las matrices deben tener las mismas dimensiones para sumar.\n💡 Para multiplicar, las columnas de A deben igualar las filas de B.', true);
                return;
            }
            const resultado = sumarMatrices(matrizA, matrizB);
            mostrarResultado('Resultado de A + B:\n\n' + convertirMatrizATexto(resultado));
            
        } else if (metodoActual === 'multiplicacion') {
            if (matrizA[0].length !== matrizB.length) {
                mostrarResultado('❌ Error: Para A×B, columnas de A (' + matrizA[0].length + ') deben igualar filas de B (' + matrizB.length + ').\n💡 Verifica las dimensiones o prueba B×A.', true);
                return;
            }
            const resultado = multiplicarMatrices(matrizA, matrizB);
            mostrarResultado('Resultado de A × B:\n\n' + convertirMatrizATexto(resultado));
        }
        
    } catch (error) {
        mostrarResultado('❌ Error: ' + error.message, true);
    }
}

function resolverOperacionMatrizUnica() {
    try {
        const texto = document.getElementById('matrix').value;
        const matriz = convertirTextoAMatriz(texto);
        
        if (matriz.length !== matriz[0].length) {
            mostrarResultado('❌ Error: La matriz debe ser cuadrada (n×n).\nIngresa una matriz con igual cantidad de filas y columnas.', true);
            return;
        }
        
        if (metodoActual === 'determinante') {
            const det = calcularDeterminante(matriz);
            mostrarResultado('Determinante = ' + det.toFixed(6));
            
        } else if (metodoActual === 'inversa') {
            const det = calcularDeterminante(matriz);
            if (Math.abs(det) < 0.0000000001) {
                mostrarResultado('❌ Matriz singular: No tiene inversa (det ≈ 0).\n💡 Para sistemas lineales Ax=b, usa "Gauss" o "Gauss-Jordan".', true);
                return;
            }
            const inversa = calcularInversa(matriz);
            mostrarResultado('Matriz Inversa:\n\n' + convertirMatrizATexto(inversa));
        }
        
    } catch (error) {
        mostrarResultado('❌ Error: ' + error.message, true);
    }
}

function resolverSistemaLineal() {
    try {
        const textoA = document.getElementById('matrixA').value;
        const textoB = document.getElementById('vectorB').value;
        
        const matrizA = convertirTextoAMatriz(textoA);
        const vectorB = convertirTextoAVector(textoB);
        
        if (matrizA.length !== vectorB.length) {
            mostrarResultado('❌ Error: Dimensiones incompatibles.\nLa matriz A y el vector b deben tener el mismo número de filas.', true);
            return;
        }
        
        if (matrizA.length !== matrizA[0].length) {
            mostrarResultado('❌ Error: La matriz debe ser cuadrada.\n💡 Para sistemas rectangulares, usa otros métodos especializados.', true);
            return;
        }
        
        let resultado;
        let texto = '';
        
        if (metodoActual === 'gauss') {
            resultado = metodoGauss(matrizA, vectorB);
            texto = 'Solución (Método de Gauss):\n\n' + convertirVectorATexto(resultado);
            
        } else if (metodoActual === 'gauss-jordan') {
            resultado = metodoGaussJordan(matrizA, vectorB);
            texto = 'Solución (Método de Gauss-Jordan):\n\n' + convertirVectorATexto(resultado);
            
        } else if (metodoActual === 'jacobi') {
            resultado = metodoJacobi(matrizA, vectorB);
            
            if (hayDivergencia(resultado.solucion)) {
                let mensaje = '❌ Método divergió ';
                if (!esDiagonalmenteDominante(matrizA)) {
                    mensaje += '(matriz no diag. dominante)';
                } else {
                    mensaje += '(números inválidos)';
                }
                mensaje += '\n💡 Usa "Gauss" para solución garantizada';
                mostrarResultado(mensaje, true);
                return;
            }
            
            texto = 'Solución (Método de Jacobi):\n\n' + convertirVectorATexto(resultado.solucion);
            texto += '\n\nIteraciones: ' + resultado.iteraciones;
            if (resultado.iteraciones >= 100) {
                texto += '\n\n⚠️ No convergió. Prueba "Gauss"';
            }
            
        } else if (metodoActual === 'gauss-seidel') {
            resultado = metodoGaussSeidel(matrizA, vectorB);
            
            if (hayDivergencia(resultado.solucion)) {
                let mensaje = '❌ Método divergió ';
                if (!esDiagonalmenteDominante(matrizA)) {
                    mensaje += '(matriz no diag. dominante)';
                } else {
                    mensaje += '(números inválidos)';
                }
                mensaje += '\n💡 Usa "Gauss" o "Gauss-Jordan"';
                mostrarResultado(mensaje, true);
                return;
            }
            
            texto = 'Solución (Método de Gauss-Seidel):\n\n' + convertirVectorATexto(resultado.solucion);
            texto += '\n\nIteraciones: ' + resultado.iteraciones;
            if (resultado.iteraciones >= 100) {
                texto += '\n\n⚠️ No convergió. Prueba "Gauss"';
            }
        }
        
        mostrarResultado(texto);
        
    } catch (error) {
        mostrarResultado('❌ Error: ' + error.message, true);
    }
}

function resolverEcuacionNoLineal() {
    try {
        let funcionTexto = document.getElementById('function').value;
        const intervaloTexto = document.getElementById('interval').value;
        
        funcionTexto = preprocesarFuncion(funcionTexto);
        
        const intervalo = convertirTextoAVector(intervaloTexto);
        const a = intervalo[0];
        const b = intervalo[1];
        
        let resultados;
        let texto = '';
        
        if (metodoActual === 'biseccion') {
            resultados = metodoBiseccion(funcionTexto, a, b);
            
            texto = 'Método de Bisección:\n\n';
            texto += 'Iter\ta\t\tb\t\tr\t\tf(r)\n';
            texto += '-'.repeat(60) + '\n';
            
            for (let i = 0; i < Math.min(6, resultados.length); i++) {
                const r = resultados[i];
                texto += r.iteracion + '\t' + r.a.toFixed(6) + '\t' + 
                        r.b.toFixed(6) + '\t' + r.raiz.toFixed(6) + '\t' + 
                        r.fr.toFixed(8) + '\n';
            }
            
            if (resultados.length > 6) {
                texto += '...\n';
                const ultimo = resultados[resultados.length - 1];
                texto += ultimo.iteracion + '\t\t\t\t' + ultimo.raiz.toFixed(6) + '\t' + 
                        ultimo.fr.toFixed(8) + '\n';
            }
            
            const ultimo = resultados[resultados.length - 1];
            texto += '\nRaíz aproximada: ' + ultimo.raiz.toFixed(10);
            texto += '\nIteraciones: ' + resultados.length;
            
        } else if (metodoActual === 'secante') {
            resultados = metodoSecante(funcionTexto, a, b);
            
            texto = 'Método de la Secante:\n\n';
            texto += 'Iter\tx0\t\tx1\t\tx2\t\tf(x2)\n';
            texto += '-'.repeat(60) + '\n';
            
            for (let i = 0; i < resultados.length; i++) {
                const r = resultados[i];
                texto += r.iteracion + '\t' + r.x0.toFixed(6) + '\t' + 
                        r.x1.toFixed(6) + '\t' + r.x2.toFixed(6) + '\t' + 
                        r.fx2.toFixed(8) + '\n';
            }
            
            const ultimo = resultados[resultados.length - 1];
            texto += '\nRaíz aproximada: ' + ultimo.x2.toFixed(10);
            texto += '\nIteraciones: ' + resultados.length;
        }
        
        mostrarResultado(texto);
        
    } catch (error) {
        if (error.message === "No hay cambio de signo en el intervalo") {
            mostrarResultado('❌ No hay cambio de signo en [a,b].\n💡 Prueba otro intervalo o usa "Secante" si tienes puntos cercanos a la raíz.', true);
        } else if (error.message === "División por cero en el método") {
            mostrarResultado('❌ División por cero en Secante.\n💡 Usa "Bisección" con intervalo que tenga cambio de signo.', true);
        } else {
            mostrarResultado('❌ Error: ' + error.message, true);
        }
    }
}

function resolverSistemaNoLineal() {
    try {
        const textoEcuaciones = document.getElementById('equations').value;
        const textoInicial = document.getElementById('initial').value;
        
        const lineasEcuaciones = textoEcuaciones.trim().split('\n');
        const ecuacionesLimpias = [];
        for (let i = 0; i < lineasEcuaciones.length; i++) {
            const linea = lineasEcuaciones[i].trim();
            if (linea.length > 0) {
                ecuacionesLimpias.push(linea);
            }
        }
        
        const inicial = convertirTextoAVector(textoInicial);
        
        if (ecuacionesLimpias.length !== inicial.length) {
            mostrarResultado('❌ Error: El número de ecuaciones debe igualar el número de variables.\nTienes ' + ecuacionesLimpias.length + ' ecuaciones y ' + inicial.length + ' variables.', true);
            return;
        }
        
        const ecuacionesProcesadas = [];
        for (let i = 0; i < ecuacionesLimpias.length; i++) {
            ecuacionesProcesadas.push(preprocesarEcuacion(ecuacionesLimpias[i], inicial.length));
        }
        
        const resultado = metodoNewton(ecuacionesProcesadas, inicial);
        
        const vars = ['x', 'y', 'z', 'w', 'u'];
        let texto = 'Solución (Método de Newton):\n\n';
        for (let i = 0; i < resultado.solucion.length; i++) {
            texto += vars[i] + ' = ' + resultado.solucion[i].toFixed(10) + '\n';
        }
        texto += '\nIteraciones: ' + resultado.iteraciones;
        
        mostrarResultado(texto);
        
        if (inicial.length === 2) {
            document.getElementById('plotSection').style.display = 'block';
            setTimeout(function() {
                graficarSistema(ecuacionesProcesadas, resultado.solucion);
            }, 100);
        }
        
    } catch (error) {
        mostrarResultado('❌ Error: ' + error.message + '\n💡 Verifica las ecuaciones y el punto inicial.', true);
    }
}

function resolverPuntoFijo() {
    try {
        const textoFunciones = document.getElementById('equations').value;
        const textoInicial = document.getElementById('initial').value;
        
        const lineasFunciones = textoFunciones.trim().split('\n');
        const funcionesLimpias = [];
        for (let i = 0; i < lineasFunciones.length; i++) {
            const linea = lineasFunciones[i].trim();
            if (linea.length > 0) {
                funcionesLimpias.push(linea);
            }
        }
        
        const inicial = convertirTextoAVector(textoInicial);
        
        if (funcionesLimpias.length !== inicial.length) {
            mostrarResultado('❌ Error: El número de funciones debe igualar el número de variables.\nTienes ' + funcionesLimpias.length + ' funciones y ' + inicial.length + ' variables.', true);
            return;
        }
        
        const funcionesProcesadas = [];
        for (let i = 0; i < funcionesLimpias.length; i++) {
            funcionesProcesadas.push(preprocesarEcuacion(funcionesLimpias[i], inicial.length));
        }
        
        const resultado = metodoPuntoFijo(funcionesProcesadas, inicial);
        
        const vars = ['x', 'y', 'z', 'w', 'u'];
        let texto = 'Solución (Método de Punto Fijo):\n\n';
        for (let i = 0; i < resultado.solucion.length; i++) {
            texto += vars[i] + ' = ' + resultado.solucion[i].toFixed(10) + '\n';
        }
        texto += '\nIteraciones: ' + resultado.iteraciones;

        if (resultado.historial.length > 0) {
            texto += '\n\n--- Últimas 5 Iteraciones ---\n';
            const inicio = Math.max(0, resultado.historial.length - 5);
            
            // Encabezado de la tabla
            texto += 'iter\t';
            for (let j = 0; j < resultado.solucion.length; j++) {
                texto += vars[j] + '\t\t';
            }
            texto += 'error\n';
            texto += '-'.repeat(80) + '\n';
            
            // Filas de datos
            for (let i = inicio; i < resultado.historial.length; i++) {
                const iter = resultado.historial[i];
                texto += iter.iteracion + '\t';
                for (let j = 0; j < iter.valores.length; j++) {
                    texto += iter.valores[j].toFixed(7) + '\t';
                }
                texto += iter.error.toExponential(4) + '\n';
            }
        }
        
        if (resultado.iteraciones > 50) {
            texto += '\n\n Convergencia lenta. Prueba "Ec. No Lineales" (Newton) para más velocidad.';
        }
        
        mostrarResultado(texto);
        
    } catch (error) {
        if (error.message === "El método diverge") {
            mostrarResultado(' El método diverge.\n💡 Reformula las ecuaciones o usa "Ec. No Lineales" (Newton) que es más robusto.', true);
        } else if (error.message.includes("No convergió")) {
            mostrarResultado(' No convergió en 100 iteraciones.\n💡 Usa "Ec. No Lineales" (Newton) que converge más rápido.', true);
        } else {
            mostrarResultado(' Error: ' + error.message, true);
        }
    }
}

function resolverNewtonModificado() {
    try {
        const textoEcuaciones = document.getElementById('equations').value;
        const textoInicial = document.getElementById('initial').value;
        
        const lineasEcuaciones = textoEcuaciones.trim().split('\n');
        const ecuacionesLimpias = [];
        for (let i = 0; i < lineasEcuaciones.length; i++) {
            const linea = lineasEcuaciones[i].trim();
            if (linea.length > 0) {
                ecuacionesLimpias.push(linea);
            }
        }
        
        const inicial = convertirTextoAVector(textoInicial);
        
        if (ecuacionesLimpias.length !== inicial.length) {
            mostrarResultado(' Error: El número de ecuaciones debe igualar el número de variables.', true);
            return;
        }
        
        const ecuacionesProcesadas = [];
        for (let i = 0; i < ecuacionesLimpias.length; i++) {
            ecuacionesProcesadas.push(preprocesarEcuacion(ecuacionesLimpias[i], inicial.length));
        }
        
        const resultado = metodoNewtonModificado(ecuacionesProcesadas, inicial);
        
        const vars = ['x', 'y', 'z', 'w', 'u'];
        let texto = 'Solución (Newton Modificado):\n\n';
        for (let i = 0; i < resultado.solucion.length; i++) {
            texto += vars[i] + ' = ' + resultado.solucion[i].toFixed(10) + '\n';
        }
        texto += '\nIteraciones: ' + resultado.iteraciones;
        texto += '\n\n Jacobiano calculado solo en x₀';

        if (resultado.historial.length > 0) {
            texto += '\n\n--- Últimas 5 Iteraciones ---\n';
            const inicio = Math.max(0, resultado.historial.length - 5);
            
            // Encabezado de la tabla
            texto += 'iter\t';
            for (let j = 0; j < resultado.solucion.length; j++) {
                texto += vars[j] + '\t\t';
            }
            texto += 'error\n';
            texto += '-'.repeat(80) + '\n';
            
            // Filas de datos
            for (let i = inicio; i < resultado.historial.length; i++) {
                const iter = resultado.historial[i];
                texto += iter.iteracion + '\t';
                for (let j = 0; j < iter.valores.length; j++) {
                    texto += iter.valores[j].toFixed(7) + '\t';
                }
                texto += iter.error.toExponential(4) + '\n';
            }
        }
        mostrarResultado(texto);
        
    } catch (error) {
        mostrarResultado('❌ Error: ' + error.message + '\n💡 Prueba "Ec. No Lineales" (Newton completo) si no converge.', true);
    }
}

// ========================================
// CREAR INTERFAZ
// ========================================

function crearInterfazEntrada(metodo) {
    const seccion = document.getElementById('inputSection');
    let html = '';
    
    if (metodo === 'suma' || metodo === 'multiplicacion') {
        html = `
            <div class="input-group">
                <label>Matriz A:</label>
                <textarea id="matrixA" placeholder="Ejemplo:&#10;1 2&#10;3 4"></textarea>
                <div class="help-text">Separar elementos con espacios, filas con Enter</div>
            </div>
            <div class="input-group">
                <label>Matriz B:</label>
                <textarea id="matrixB" placeholder="Ejemplo:&#10;5 6&#10;7 8"></textarea>
            </div>
            <button class="solve-btn" onclick="resolverOperacionMatrices()">Calcular</button>
        `;
        
    } else if (metodo === 'determinante' || metodo === 'inversa') {
        html = `
            <div class="input-group">
                <label>Matriz (debe ser cuadrada):</label>
                <textarea id="matrix" placeholder="Ejemplo:&#10;4 2&#10;3 1"></textarea>
                <div class="help-text">Separar elementos con espacios, filas con Enter</div>
            </div>
            <button class="solve-btn" onclick="resolverOperacionMatrizUnica()">Calcular</button>
        `;
        
    } else if (metodo === 'gauss' || metodo === 'gauss-jordan' || 
                metodo === 'jacobi' || metodo === 'gauss-seidel') {
        html = `
            <div class="input-group">
                <label>Matriz de coeficientes A:</label>
                <textarea id="matrixA" placeholder="Ejemplo:&#10;2 3&#10;1 -1"></textarea>
                <div class="help-text">Sistema Ax = b</div>
            </div>
            <div class="input-group">
                <label>Vector de términos independientes b:</label>
                <input type="text" id="vectorB" placeholder="Ejemplo: 8 1">
                <div class="help-text">Separar valores con espacios</div>
            </div>
            <button class="solve-btn" onclick="resolverSistemaLineal()">Resolver</button>
        `;
        
    } else if (metodo === 'biseccion' || metodo === 'secante') {
        html = `
            <div class="input-group">
                <label>Función f(x) = 0:</label>
                <input type="text" id="function" placeholder="Ejemplo: x**3 - x - 2">
                <div class="help-text">Usar: sen(), cos(), ln(), exp(), raiz(), ** para potencias</div>
            </div>
            <div class="input-group">
                <label>Intervalo [a, b]:</label>
                <input type="text" id="interval" placeholder="Ejemplo: 1 2">
                <div class="help-text">Dos valores separados por espacio</div>
            </div>
            <button class="solve-btn" onclick="resolverEcuacionNoLineal()">Resolver</button>
        `;
        
    } else if (metodo === 'no-lineal') {
        html = `
            <div class="input-group">
                <label>Ecuaciones (f(x,y,...) = 0):</label>
                <textarea id="equations" placeholder="Ejemplo:&#10;x**2 + y**2 - 4&#10;exp(x) + y - 1"></textarea>
                <div class="help-text">Una ecuación por línea. Variables: x, y, z. Funciones: sen(), cos(), ln(), exp(), raiz()</div>
            </div>
            <div class="input-group">
                <label>Punto inicial:</label>
                <input type="text" id="initial" placeholder="Ejemplo: 0.5 0.5">
                <div class="help-text">Valores iniciales separados por espacios</div>
            </div>
            <button class="solve-btn" onclick="resolverSistemaNoLineal()">Resolver</button>
        `;
        
    } else if (metodo === 'punto-fijo') {
        html = `
            <div class="input-group">
                <label>Funciones g(x, y, ...):</label>
                <textarea id="equations" placeholder="Ejemplo:&#10;cos(y)&#10;sen(x)"></textarea>
                <div class="help-text">Sistema x = g(x). Una función por línea</div>
            </div>
            <div class="input-group">
                <label>Punto inicial:</label>
                <input type="text" id="initial" placeholder="Ejemplo: 0.5 0.5">
                <div class="help-text">Valores iniciales separados por espacios</div>
            </div>
            <button class="solve-btn" onclick="resolverPuntoFijo()">Resolver</button>
        `;
        
    } else if (metodo === 'newton-mod') {
        html = `
            <div class="input-group">
                <label>Ecuaciones (f(x,y,...) = 0):</label>
                <textarea id="equations" placeholder="Ejemplo:&#10;x**2 + y**2 - 4&#10;x - y"></textarea>
                <div class="help-text">Jacobiano calculado solo en x₀</div>
            </div>
        
            <div class="input-group">
                <label>Punto inicial:</label>
                <input type="text" id="initial" placeholder="Ejemplo: 1 1">
                <div class="help-text">Valores iniciales separados por espacios</div>
            </div>
        
            <button class="solve-btn" onclick="resolverNewtonModificado()">Resolver</button>
        `;
    }
    
    seccion.innerHTML = html;
}

// ========================================
// INICIALIZACIÓN
// ========================================

const botones = document.querySelectorAll('.method-btn');

for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener('click', function() {
        for (let j = 0; j < botones.length; j++) {
            botones[j].classList.remove('active');
        }
        
        this.classList.add('active');
        metodoActual = this.getAttribute('data-method');
        crearInterfazEntrada(metodoActual);
        document.getElementById('resultSection').classList.remove('show');
        document.getElementById('plotSection').style.display = 'none';
    });
}

botones[0].click();



