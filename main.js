var vertexShaderSource = `#version 300 es
 
in vec4 a_position;
in vec4 a_color;
 
 
 uniform mat4 u_matrix;
 
 out vec4 v_color;
 

 
  void main() {
  
   
   gl_Position = u_matrix * a_position;
   
   v_color = a_color;
  }
`;
 
var fragmentShaderSource = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
in vec4 v_color;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  outColor = v_color;
}
`;

var canvas = document.querySelector("#c");
var gl = canvas.getContext("webgl2");
 if (!gl) { console.log('error')}
 
canvas.width = 1000;
canvas.height = 700;

 function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

var program = createProgram(gl, vertexShader, fragmentShader);
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
 
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var colorLocation = gl.getUniformLocation(program, "u_color");

var matrixLocation = gl.getUniformLocation(program, "u_matrix");

var positionBuffer = gl.createBuffer();

var translation = [400, 300, 0];
// in radians
var rotation = [0, 0, 0];
var scale = [1, 1, 1,];
var color = [Math.random(), Math.random(), Math.random(), 1];
var fudgeFactor = 1;

var XSpin = 0;
var YSpin = 0;
var ZSpin = 0;

var vao = gl.createVertexArray();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bindVertexArray(vao);
gl.enableVertexAttribArray(positionAttributeLocation);

var size = 3;
var type = gl.FLOAT;
var normalize = true;
var stride = 0;
var offset = 0;

gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);
 
setGeometry(gl);

var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);

  // Turn on the attribute
  gl.enableVertexAttribArray(colorAttributeLocation);

  // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
  var size = 3;          // 3 components per iteration
  var type = gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
  var normalize = true;  // convert from 0-255 to 0.0-1.0
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      colorAttributeLocation, size, type, normalize, stride, offset);

var translationXSlider = document.getElementById("xSlider");
var translationYSlider = document.getElementById("ySlider");
var translationZSlider = document.getElementById("zSlider");
var XrotationAngleInDegsSlider = document.getElementById("XangleInDegsSlider");
var YrotationAngleInDegsSlider = document.getElementById("YangleInDegsSlider");
var ZrotationAngleInDegsSlider = document.getElementById("ZangleInDegsSlider");
var scaleXSlider = document.getElementById("scaleX");
var scaleYSlider = document.getElementById("scaleY");
var scaleZSlider = document.getElementById("scaleZ");
var depthSlider = document.getElementById("depthSlider");

var XSpinSlider = document.getElementById("XSpinSlider");
var YSpinSlider = document.getElementById("YSpinSlider");
var ZSpinSlider = document.getElementById("ZSpinSlider");

function refreshNonRotationalValues(){
translation[0] = translationXSlider.value;
translation[1] = translationYSlider.value;
translation[2] = translationZSlider.value;

scale[0] = scaleXSlider.value*0.01;
scale[1] = scaleYSlider.value*0.01;
scale[2] = scaleZSlider.value*0.01;
fudgeFactor = depthSlider.value *0.1;
XSpin = XSpinSlider.value*0.1;
YSpin = YSpinSlider.value*0.1;
ZSpin = ZSpinSlider.value*0.1;
}

function refreshXRotationalValue(){

rotation[0] = (XrotationAngleInDegsSlider.value*3.14/180);
}
function refreshYRotationalValue(){
  
rotation[1] = (YrotationAngleInDegsSlider.value*3.14/180);
}
function refreshZRotationalValue(){

rotation[2] = (ZrotationAngleInDegsSlider.value*3.14/180);
}


refreshNonRotationalValues();
refreshXRotationalValue();
refreshYRotationalValue();
refreshZRotationalValue();

translationXSlider.oninput = function() {refreshNonRotationalValues(); drawScene()};
translationYSlider.oninput = function() {refreshNonRotationalValues(); drawScene()};
translationZSlider.oninput = function() {refreshNonRotationalValues(); drawScene()};
XrotationAngleInDegsSlider.oninput = function() {refreshXRotationalValue(); drawScene()};
YrotationAngleInDegsSlider.oninput = function() {refreshYRotationalValue(); drawScene()};
ZrotationAngleInDegsSlider.oninput = function() {refreshZRotationalValue(); drawScene()};
scaleXSlider.oninput = function() {refreshNonRotationalValues(); drawScene()};
scaleYSlider.oninput = function() {refreshNonRotationalValues(); drawScene()};
scaleZSlider.oninput = function() {refreshNonRotationalValues(); drawScene()};
depthSlider.oninput = function() {refreshNonRotationalValues(); drawScene()};
XSpinSlider.oninput = function() {refreshNonRotationalValues(); drawScene()};
YSpinSlider.oninput = function() {refreshNonRotationalValues(); drawScene()};
ZSpinSlider.oninput = function() {refreshNonRotationalValues(); drawScene()};

function makeZToWMatrix(fudgeFactor) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, fudgeFactor,
    0, 0, 0, 1,
  ];
}

var m4 = {
  
    orthographic: function(left, right, bottom, top, near, far) {
    return [
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0,
 
      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1,
    ];
  },
  
  projection: function(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },
  
  identity: function() {
    return[
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
      ];
  },
   translation: function(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       tx, ty, tz, 1,
    ];
  },
 
  xRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
 
    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },
 
  yRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
 
    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },
 
  zRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
 
    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },
 
  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  },

   multiply: function(a, b) {
    var b00 = b[0 ];
    var b01 = b[1];
    var b02 = b[2];
    var b03 = b[3];
    var b10 = b[4];
    var b11 = b[5];
    var b12 = b[6];
    var b13 = b[7];
    var b20 = b[8];
    var b21 = b[9];
    var b22 = b[10];
    var b23 = b[11];
    var b30 = b[12];
    var b31 = b[13];
    var b32 = b[14];
    var b33 = b[15];
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    var a30 = a[12];
    var a31 = a[13];
    var a32 = a[14];
    var a33 = a[15];
 
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },
  
  translate: function(m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },
 
  xRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },
 
  yRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },
 
  zRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },
 
  scale: function(m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },
  
};


drawScene();
function drawScene(){

//webglUtils.resizeCanvasToDisplaySize(gl.canvas);
function resizeCanvasToDisplaySize(canvas) {
  if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
}

console.log("hello");


 gl.enable(gl.CULL_FACE);
 gl.enable(gl.DEPTH_TEST);

resizeCanvasToDisplaySize(canvas);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

gl.useProgram(program);

gl.bindVertexArray(vao);

//gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

gl.uniform4fv(colorLocation, color);

// Compute the matrices
    
    var moveOriginMatrix = m4.translation(-50, -75, -15);
 
    // Multiply the matrices.
  //   var matrix = m3.identity();
  //
  // for (var i = 0; i < 5; ++i) {

  //      matrix = m3.multiply(matrix, translationMatrix);
  //      matrix = m3.multiply(matrix, rotationMatrix);
  //      matrix = m3.multiply(matrix, scaleMatrix);
  
var left = 0;
var right = gl.canvas.clientWidth;
var bottom = gl.canvas.clientHeight;
var top = 0;
var near = 1000;
var far = -1000;

  var matrix = makeZToWMatrix(fudgeFactor);
  matrix = m4.multiply(matrix, m4.orthographic(left, right, bottom, top, near, far));
 
  matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
  matrix = m4.xRotate(matrix, rotation[0]);
  matrix = m4.yRotate(matrix, rotation[1]);
  matrix = m4.zRotate(matrix, rotation[2]);
  matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

  matrix = m4.multiply(matrix, moveOriginMatrix);
   
 
        // Set the matrix.
        gl.uniformMatrix4fv(matrixLocation, false, matrix);
 
        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 14*6;
        // above - sides x 6 (two triangles, six points)
        gl.drawArrays(primitiveType, offset, count);
        
        
         displayMatrixResultsAtTop();
        function displayMatrixResultsAtTop(){
  document.getElementById("row1").innerHTML = "[" + matrix[0] + ", "+ matrix[1] +", "+ matrix [2] + ", " + matrix[3]+"]";
  document.getElementById("row2").innerHTML = "[" + matrix[4] + ", "+ matrix[5] +", "+ matrix [6] + ", " + matrix[7]+"]";
  document.getElementById("row3").innerHTML = "[" + matrix[8] + ", "+ matrix[9] +", "+ matrix [10] + ", " + matrix[11]+"]";
  document.getElementById("row4").innerHTML = "[" + matrix[12] + ", "+ matrix[13] +", "+ matrix [14] + ", " + matrix[15]+"]";
}

      }


function setGeometry(gl) {
 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
   
          // main column
        0,   0,  0,
          0, 150,  0,
          30,   0,  0,
          0, 150,  0,
          30, 150,  0,
          30,   0,  0,

          // top rung front
          30,   0,  0,
          30,  30,  0,
          100,   0,  0,
          30,  30,  0,
          100,  30,  0,
          100,   0,  0,

          // middle rung front
          30,  120,  0,
          30,  150,  0,
          100,  120,  0,
          30,  150,  0,
          100,  150,  0,
          100,  120,  0,

          // left column back
            0,   0,  30,
           30,   0,  30,
            0, 150,  30,
            0, 150,  30,
           30,   0,  30,
           30, 150,  30,

          // top rung back
           30,   0,  30,
          100,   0,  30,
           30,  30,  30,
           30,  30,  30,
          100,   0,  30,
          100,  30,  30,

          // middle rung back
           30,  120,  30,
           100,  120,  30,
           30,  150,  30,
           30,  150,  30,
           100,  120,  30,
           100,  150,  30,

          // top
            0,   0,   0,
          100,   0,   0,
          100,   0,  30,
            0,   0,   0,
          100,   0,  30,
            0,   0,  30,

          // top rung right
          100,   0,   0,
          100,  30,   0,
          100,  30,  30,
          100,   0,   0,
          100,  30,  30,
          100,   0,  30,

          // under top rung
          30,   30,   0,
          30,   30,  30,
          100,  30,  30,
          30,   30,   0,
          100,  30,  30,
          100,  30,   0,

          // between top rung and middle
          30,   30,   0,
          30,   120,  30,
          30,   30,  30,
          30,   30,   0,
          30,   120,   0,
          30,   120,  30,

          // top of middle rung
          30,   120,   0,
          100,   120,  30,
          30,   120,  30,
          30,   120,   0,
          100,   120,   0,
          100,   120,  30,

          // right of middle rung
          100,   120,   0,
          100,   150,  30,
          100,   120,  30,
          100,   120,   0,
          100,   150,   0,
          100,   150,  30,

          // bottom of middle rung.
          0,   150,   0,
          0,   150,  30,
          100,   150,  30,
          0,   150,   0,
          100,   150,  30,
          100,   150,   0,

          // left side
          0,   0,   0,
          0,   0,  30,
          0, 150,  30,
          0,   0,   0,
          0, 150,  30,
          0, 150,   0,
      ]),
      gl.STATIC_DRAW);
}

// Fill the current ARRAY_BUFFER buffer with colors for the 'F'.
function setColors(gl) {
  
    var frontColor = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    var backColor = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    var rightRungColor = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    var betweenColor = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    var topColor = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    var bottomColor = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    var topRungBottomColor = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    var bottomRungTopColor = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    var topRungRightColor = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    var bottomRungRightColor = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    var leftRungColor = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
        
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
        
      
          // left column front
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],

          // top rung front
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],

          // middle rung front
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],
        frontColor[0],frontColor[1],frontColor[2],

          // left column back
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],

          // top rung back
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],

          // middle rung back
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],
        backColor[0], backColor[1], backColor[2],

          // top
        topColor[0], topColor[1], topColor[2],
        topColor[0], topColor[1], topColor[2],
        topColor[0], topColor[1], topColor[2],
        topColor[0], topColor[1], topColor[2],
        topColor[0], topColor[1], topColor[2],
        topColor[0], topColor[1], topColor[2],

          // top rung right
        topRungRightColor[0], topRungRightColor[1], topRungRightColor[2],
        topRungRightColor[0], topRungRightColor[1], topRungRightColor[2],
        topRungRightColor[0], topRungRightColor[1], topRungRightColor[2],
        topRungRightColor[0], topRungRightColor[1], topRungRightColor[2],
        topRungRightColor[0], topRungRightColor[1], topRungRightColor[2],
        topRungRightColor[0], topRungRightColor[1], topRungRightColor[2],

          // under top rung
        topRungBottomColor[0], topRungBottomColor[1], topRungBottomColor[2],
        topRungBottomColor[0], topRungBottomColor[1], topRungBottomColor[2],
        topRungBottomColor[0], topRungBottomColor[1], topRungBottomColor[2],
        topRungBottomColor[0], topRungBottomColor[1], topRungBottomColor[2],
        topRungBottomColor[0], topRungBottomColor[1], topRungBottomColor[2],
        topRungBottomColor[0], topRungBottomColor[1], topRungBottomColor[2],

          // between top rung and middle
        betweenColor[0], betweenColor[1], betweenColor[2],
        betweenColor[0], betweenColor[1], betweenColor[2],
        betweenColor[0], betweenColor[1], betweenColor[2],
        betweenColor[0], betweenColor[1], betweenColor[2],
        betweenColor[0], betweenColor[1], betweenColor[2],
        betweenColor[0], betweenColor[1], betweenColor[2],

          // top of middle rung
        bottomRungTopColor[0], bottomRungTopColor[1], bottomRungTopColor[2],
        bottomRungTopColor[0], bottomRungTopColor[1], bottomRungTopColor[2],
        bottomRungTopColor[0], bottomRungTopColor[1], bottomRungTopColor[2],
        bottomRungTopColor[0], bottomRungTopColor[1], bottomRungTopColor[2],
        bottomRungTopColor[0], bottomRungTopColor[1], bottomRungTopColor[2],
        bottomRungTopColor[0], bottomRungTopColor[1], bottomRungTopColor[2],

          // right of middle rung
        bottomRungRightColor[0], bottomRungRightColor[1], bottomRungRightColor[2],
        bottomRungRightColor[0], bottomRungRightColor[1], bottomRungRightColor[2],
        bottomRungRightColor[0], bottomRungRightColor[1], bottomRungRightColor[2],
        bottomRungRightColor[0], bottomRungRightColor[1], bottomRungRightColor[2],
        bottomRungRightColor[0], bottomRungRightColor[1], bottomRungRightColor[2],
        bottomRungRightColor[0], bottomRungRightColor[1], bottomRungRightColor[2],

          // bottom of middle rung.
        bottomColor[0], bottomColor[1], bottomColor[2],
        bottomColor[0], bottomColor[1], bottomColor[2],
        bottomColor[0], bottomColor[1], bottomColor[2],
        bottomColor[0], bottomColor[1], bottomColor[2],
        bottomColor[0], bottomColor[1], bottomColor[2],
        bottomColor[0], bottomColor[1], bottomColor[2],

          // left side
        leftRungColor[0], leftRungColor[1], leftRungColor[2],
        leftRungColor[0], leftRungColor[1], leftRungColor[2],
        leftRungColor[0], leftRungColor[1], leftRungColor[2],
        leftRungColor[0], leftRungColor[1], leftRungColor[2],
        leftRungColor[0], leftRungColor[1], leftRungColor[2],
        leftRungColor[0], leftRungColor[1], leftRungColor[2],
        
      ]),
          gl.STATIC_DRAW);
}


requestAnimationFrame(update);
      
var then = 0;

function update(now){

now *=0.001
var deltaTime = now - then;
then = now;
drawScene();
rotation[0] = rotation[0] + (XSpin*3.14/180)*deltaTime*100;
rotation[1] = rotation[1] + (YSpin*3.14/180)*deltaTime*100;
rotation[2] = rotation[2] + (ZSpin*3.14/180)*deltaTime*100;

requestAnimationFrame(update);

};