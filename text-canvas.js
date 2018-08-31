//Source: https://vr.with.in/archive/text-2d-canvas/text-canvas.js
var TextCanvas = function( options ) {

  var string = this.string = options.string;
  var fontsize = this.fontsize = options.fontsize || 50;
  this.lineHeight = options.lineHeight || 50;

  var canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;

  var ctx = this.ctx = canvas.getContext('2d');

  var texture = this.texture = new THREE.Texture( canvas );
  texture.needsUpdate = true;

  var planeMat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  });
  var planeGeo = new THREE.PlaneBufferGeometry( 384, 192 );
  planeGeo.computeBoundingBox(); // for hit area

  var plane = this.plane = new THREE.Mesh( planeGeo, planeMat );

  this.update();

  scene.add( plane );

  //

  var boxMat = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    transparent: true,
    opacity: 0
  });
  var hitBox = new THREE.Mesh( planeGeo, boxMat );

  plane.add( hitBox );
  hitBoxes.push( hitBox );

  var wireframe = new THREE.WireframeGeometry( planeGeo );
  var line = this.wire = new THREE.LineSegments( wireframe );
  line.material.color.setHex(0xaaaaaa);
  plane.add( line );

  return this;

};

// http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
TextCanvas.prototype.update = function( str ) {
  var string = this.string = str || this.string;
  var ctx = this.ctx;
  var canvas = ctx.canvas;

  ctx.font = '200 ' + this.fontsize + 'px Arial';

  ctx.clearRect( 0, 0, canvas.width, canvas.height );

  var maxWidth = canvas.width;
  var x = (canvas.width - maxWidth) / 2; // left aligned
  var y = this.fontsize; // start at the top

  var words = string.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = ctx.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += this.lineHeight;
    }
    else {
      line = testLine;
    }
  }
  ctx.fillStyle = '#ffffff';
  ctx.fillText( line, x, y );

  this.plane.material.map.needsUpdate = true;
}