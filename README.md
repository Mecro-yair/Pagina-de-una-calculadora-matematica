Aplicativo Web - Métodos Numéricos
Aplicación web con menú interactivo que integra los 13 algoritmos numéricos vistos en el curso de Modelado Computacional para Ingeniería.

Ver Aplicativo Online
Usa directamente desde tu navegador:

https://mecro-yair.github.io/Pagina-de-una-calculadora-matematica/

No requiere instalación. Solo abre el link y empieza a usar.

Descargar para Uso Offline
Descarga directa:

https://github.com/Mecro-yair/Pagina-de-una-calculadora-matematica/archive/refs/heads/main.zip

Instalación:
Haz clic en el link de arriba
Se descarga main.zip automáticamente
Descomprime el archivo
Abre index.html en tu navegador
¡Listo! Funciona sin internet
Sobre el Proyecto
  Este proyecto fue desarrollado como trabajo final del curso Modelado Computacional para Ingeniería.

El docente solicitó crear un aplicativo web con un menú interactivo que reuniera todos los algoritmos numéricos vistos durante el curso en un solo lugar.

Algoritmos Implementados
  El aplicativo incluye 13 métodos numéricos organizados por categorías:

Operaciones con Matrices
 Suma de matrices
 Multiplicación de matrices
 Cálculo de determinantes
 Matriz inversa
Sistemas de Ecuaciones Lineales
 Método de Gauss (Eliminación Gaussiana)
 Método de Gauss-Jordan
 Método de Jacobi (iterativo)
 Método de Gauss-Seidel (iterativo)
Ecuaciones No Lineales (1 variable)
 Método de Bisección
 Método de la Secante
Sistemas de Ecuaciones No Lineales
 Método de Newton-Raphson
 Método de Punto Fijo
 Método de Newton Modificado
Cómo Usar
Interfaz del Menú
El aplicativo presenta un menú con 13 botones, uno para cada algoritmo:

[Suma Matrices] [Multiplicación] [Determinante] [Inversa]
[Gauss] [Gauss-Jordan] [Jacobi] [Gauss-Seidel]
[Newton-Raphson] [Punto Fijo] [Newton Mod] [Bisección] [Secante]
Proceso Simple (3 pasos):
Selecciona el método haciendo clic en su botón
Ingresa tus datos en los campos que aparecen
Resuelve haciendo clic en "Calcular" o "Resolver"
Ejemplos de Uso
Ejemplo 1: Resolver Sistema de Ecuaciones 2×2
Sistema:

2x + 3y = 8
x - y = 1
Pasos:

Clic en "Gauss"
En "Matriz A" escribe:
2 3
1 -1
En "Vector b" escribe:
8 1
Clic en "Resolver"
Resultado:

x = 2.200000
y = 1.200000

+ Gráfica con las rectas y punto de intersección
Ejemplo 2: Encontrar Raíz de Función
Ecuación: x³ - x - 2 = 0

Pasos:

Clic en "Bisección"
En "Función" escribe:
x**3 - x - 2
En "Intervalo" escribe:
1 2
Clic en "Resolver"
Resultado:

Raíz aproximada: x = 1.5213797
Iteraciones: 27

+ Gráfica de la función con raíz marcada
Ejemplo 3: Multiplicar Matrices
Matrices:

A = [2  3]    B = [1]
    [1  4]        [2]
Pasos:

Clic en "Multiplicación"
En "Matriz A":
2 3
1 4
En "Matriz B":
1
2
Clic en "Calcular"
Resultado:

8
9
Características
 13 algoritmos implementados desde cero
 Menú interactivo fácil de usar
 Gráficas automáticas con Canvas API
 Sin instalación (versión web)
 Funciona offline (versión descargada)
 Responsive design (funciona en celular)
 Validación de datos automática
 Mensajes de error claros con sugerencias
 Resultados precisos (6-10 decimales)
 100% JavaScript puro (sin librerías externas)
Tecnologías Utilizadas
 HTML5 - Estructura del aplicativo
 CSS3 - Diseño moderno con animaciones
 JavaScript (ES6+) - Lógica y algoritmos
 Canvas API - Gráficas 2D
 GitHub Pages - Hosting gratuito
 
Estructura del Proyecto
Pagina-de-una-calculadora-matematica/

- index.html      
- styles.css      
- script.js        
- README.md        
Archivos:
 index.html 

Define la estructura HTML
Contiene el menú de 13 botones
Áreas de entrada y resultados
Canvas para gráficas
Modal de créditos
styles.css 

Diseño moderno con degradados
Animaciones y transiciones
Responsive design
Colores: morado (
#7c3aed) y azul
script.js 

1,800+ líneas de código
45+ funciones JavaScript
Implementación de los 13 algoritmos
Validaciones y manejo de errores
Generación de gráficas
Formato de Entrada de Datos
  Para Matrices:
  Separa números con ESPACIO
  Cada fila en nueva LÍNEA
  
  Ejemplo:
  1 2 3
  4 5 6
  7 8 9
  
  Para Vectores:
  Números separados por ESPACIO en una línea
  
  Ejemplo:
  5 10 15
  Para Funciones:
  Usa ** para potencias
  Funciones disponibles: sen(), cos(), ln(), exp(), raiz()
  
  Ejemplos:
  x**3 - 2*x + 1
  sen(x) + cos(x)
  exp(x) - raiz(x)
Casos de Uso
Este aplicativo es útil para:

 Estudiantes: Verificar tareas y estudiar métodos numéricos
 Profesores: Demostrar algoritmos en clase
 Laboratorio: Práctica de métodos computacionales
 Exámenes: Comprobar resultados rápidamente
 Autoaprendizaje: Entender cómo funcionan los algoritmos
Limitaciones
Máximo 5 variables en sistemas no lineales (x, y, z, w, u)
Máximo 100 iteraciones en métodos iterativos
Gráficas solo para sistemas 2×2 y funciones de 1 variable
Tolerancia fija: 1×10⁻⁶

Solución de Problemas
Problema: "Los estilos no cargan"
Solución:

Verifica que styles.css esté en la misma carpeta
Recarga la página con Ctrl + F5
Problema: "Los botones no funcionan"
Solución:

Verifica que script.js esté en la misma carpeta
Asegúrate que JavaScript esté habilitado
Abre consola (F12) para ver errores
Problema: "Matriz singular"
Solución:

Tu matriz no tiene inversa (determinante = 0)
Usa el método de Gauss en lugar de inversa
Problema: "No converge (Jacobi/Gauss-Seidel)"
Solución:

Tu matriz no es diagonalmente dominante
Usa el método de Gauss que siempre funciona

Autores
Proyecto desarrollado por estudiantes de Ingeniería - UNJBG:

Oscar Alejandro Ticona Fernandez
Danny Yair Luque Pari
Wesley Rivaldo Laura Choquejahua
Yhulian Nayeli Maquera Flores
Alexandra Valeria Choque Onofre
Docente:
MSc.Ing. Jorge R. Chambilla Araca

Institución:
Universidad Nacional Jorge Basadre Grohmann
Facultad de Ingeniería
IV Ciclo - 2025

Curso:
Modelado Computacional para Ingeniería

Licencia
Proyecto Académico - Universidad Nacional Jorge Basadre Grohmann

Este proyecto fue desarrollado como trabajo final del curso de Modelado Computacional para Ingeniería.

Uso permitido:
 Usar con fines educativos
 Estudiar el código
 Modificar para aprender
 Compartir con compañeros de clase
 
Uso NO permitido:
 Vender el proyecto
 Usar comercialmente sin autorización
 Quitar los créditos de autoría
 
Contacto
Aplicativo Web: https://mecro-yair.github.io/Pagina-de-una-calculadora-matematica/
Repositorio GitHub: https://github.com/Mecro-yair/Pagina-de-una-calculadora-matematica
Descarga Directa: https://github.com/Mecro-yair/Pagina-de-una-calculadora-matematica/archive/refs/heads/main.zip

Agradecimientos
Al MSc.Ing. Jorge R. Chambilla Araca por su guía y enseñanza durante el curso
A la Universidad Nacional Jorge Basadre Grohmann por el apoyo institucional
A GitHub por el hosting gratuito vía GitHub Pages


