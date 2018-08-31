var socket;
var player;
var refresh_time = 0;
var wait=0, direction = -1;
var leftWall = -8, rightWall = 8, topWall = 3, bottomWall = -5;
//Fruits
var Fruits = [];
var Fruit, Apple, Banana, Cherry, Orange, Pear, Pretzel, Strawberry, Grapes;
//GHOST
var ghosts = [];
var Inky,Blinky,Pinky,Clyde;
var BlinkyL1,BlinkyL2,BlinkyU1,BlinkyU2,BlinkyR1,BlinkyR2,BlinkyD1,BlinkyD2;
var PinkyL1,PinkyL2,PinkyU1,PinkyU2,PinkyR1,PinkyR2,PinkyD1,PinkyD2;
var InkyL1,InkyL2,InkyU1,InkyU2,InkyR1,InkyR2,InkyD1,InkyD2;
var ClydeL1,ClydeL2,ClydeU1,ClydeU2,ClydeR1,ClydeR2,ClydeD1,ClydeD2;
//Laser
var Lasers,LDir,lag=-1;

function setup() {
			// create a scene, that will hold all our elements such as objects, cameras and lights.
			var scene = new THREE.Scene();				
			
			// create a camera, which defines where we're looking at.
			var camera = new THREE.PerspectiveCamera(45, 800/ 500, 0.1, 1000);
			camera.position.set(0,0,50);
			scene.add(camera);
	
			// create a render and set the size
			var renderer = new THREE.WebGLRenderer({ antialias: true} );
			renderer.setClearColor(new THREE.Color(0x000000, 0.0));
			//set the size
			renderer.setSize(700, 700);
			//renderer.shadowMapEnabled = true	
			
			//Later change this back to false
			var endGame = true; //The Game is over and you'll have to restart
			
			
			var controls = new THREE.TrackballControls( camera );
				controls.rotateSpeed = 1.0;
				controls.zoomSpeed = 1.2;
				controls.panSpeed = 0.8;
				controls.noZoom = false;
				controls.noPan = false;
				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3; 
			
		//Audio
			/* var wingFlap = new Audio('FlapPyBird-master/assets/audio/wing.ogg');
			wingFlap.volume=0.1;
			*/			
			
		
			var gamepad = new Gamepad();
		
			gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
				// a new gamepad connected
				console.log("connected");
			});
			
			gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
				// gamepad disconnected
			});

			gamepad.bind(Gamepad.Event.UNSUPPORTED, function(device) {
				// an unsupported gamepad connected (add new mapping)
			});

			gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
				// e.control of gamepad e.gamepad pressed down
				//console.log(e.control + " was pressed");
				//START_FORWARD 
				if(e.control == "START_FORWARD"){
					ghosts[0].direction = -1;
				}
				else if(e.control == "FACE_2" && lag <step){
					shootLaser();
					console.log("Shoot!!!");
					lag = step + 2;
				}
			});
			
			gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
				// e.control of gamepad e.gamepad released
			});

			gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
				// e.axis changed to value e.value for gamepad e.gamepad
				
				if(e.axis == "LEFT_STICK_X" && e.value == -1){
					ghosts[0].direction = 2;
					Blinky.material = BlinkyL1;
				}
				else if(e.axis == "LEFT_STICK_X" && e.value == 1){
					ghosts[0].direction = 3;
					Blinky.material = BlinkyR1;
				}
				if(e.axis == "LEFT_STICK_Y" && e.value == -1){
					ghosts[0].direction = 0;
					Blinky.material = BlinkyU1;
				}
				else if(e.axis == "LEFT_STICK_Y" && e.value == 1){
					ghosts[0].direction = 1;
					Blinky.material = BlinkyD1;
				}
				//console.log(e.axis + " was set to "+ e.value);
			});

			gamepad.bind(Gamepad.Event.TICK, function(gamepads) {
				// gamepads were updated (around 60 times a second)
			});
			
			
			
			
			
			if (!gamepad.init()) {
				// Your browser does not support gamepads, get the latest Google Chrome or Firefox
				console.log("no no no ");
			}
			else
				console.log("YES! ");
		
		
		
		
		
		
		
		
		
		//Keyboard Functions
		var onKeyDown = function(event) {
			if (event.keyCode == 38) {
				//Inky.position.y+=1;
				ghosts[2].direction = 0;
				Inky.material = InkyU1;
			}
			else if (event.keyCode == 40) {
				//Inky.position.y-=1;
				ghosts[2].direction = 1;
				Inky.material = InkyD1;
			}
			else if (event.keyCode == 37) {
				//Inky.position.x-=1;
				ghosts[2].direction = 2;
				Inky.material = InkyL1;
			}
			else if (event.keyCode == 39) {
				//Inky.position.x+=1;
				ghosts[2].direction = 3;
				Inky.material = InkyR1;
			}			
			else if (event.keyCode == 27) { //when 'esc' is pressed
				wait = step + 5;
				ghosts[2].direction = -1;			
			}
			else if (event.keyCode == 17 && step >wait) { //when 'esc' is pressed
							wait = step + 1.5;							
							
							Fruit.material = Fruits[Math.floor(Math.random()*Fruits.length)];		
						}					
		}; 
		
		document.addEventListener('keydown', onKeyDown, false);	

        //add spotlight for the shadows
			var spotLight = new THREE.SpotLight(0xffffff);
			spotLight.position.set(0, 50, 150);
			spotLight.castShadow = false;
			spotLight.intensity =2;
			scene.add(spotLight);

        //add the output of the renderer to the html element
			document.getElementById("WebGL-output").appendChild(renderer.domElement);
			//controls = new THREE.OrbitControls(camera, renderer.domElement);
			
        //orbit = new THREE.OrbitControls(camera, webGLRenderer.domElement);
		
        //call the render function
			renderer.render(scene, camera);
			
		//call the render function
			var step = 0;		
			//console.log("sad");
			renderScene();
			//load_Fruits();
			load_Ghost();
			loadX();
			//load_Walls();

			function renderScene(){
				//Render steps
					step += 0.1;
					
					//render using requestAnimationFrame
					requestAnimationFrame(renderScene);
					renderer.render(scene, camera);			
					
					//Move all the players
					scene.traverse(function (e) {
						if (e == Blinky){		
							if (ghosts[0].direction == 3 ){
								Blinky.position.x+=0.05;
								
								if(Blinky.position.x >= rightWall )
									RandomDirection(0);
								
								if(ghosts[0].Delay < step){
									if(ghosts[0].Model == 0){
											Blinky.material = BlinkyR1;
											ghosts[0].Model = 1;
											ghosts[0].Delay = step + 1;
										}
										else{
											Blinky.material = BlinkyR2;
											ghosts[0].Model = 0;
											ghosts[0].Delay = step + 1;
										}
								}
							}
							else if (ghosts[0].direction == 2 ){
								Blinky.position.x-=0.05;
								
								if(Blinky.position.x <= leftWall )
									RandomDirection(0);
								
								if(ghosts[0].Delay < step){
									if(ghosts[0].Model == 0){
											Blinky.material = BlinkyL1;
											ghosts[0].Model = 1;
											ghosts[0].Delay = step + 1;
										}
										else{
											Blinky.material = BlinkyL2;
											ghosts[0].Model = 0;
											ghosts[0].Delay = step + 1;
										}
								}
							}
							else if (ghosts[0].direction == 1 ){
								Blinky.position.y-=0.05;
								
								if(Blinky.position.y <= bottomWall )
									RandomDirection(0);
								
								if(ghosts[0].Delay < step){
									if(ghosts[0].Model == 0){
											Blinky.material = BlinkyD1;
											ghosts[0].Model = 1;
											ghosts[0].Delay = step + 1;
										}
										else{
											Blinky.material = BlinkyD2;
											ghosts[0].Model = 0;
											ghosts[0].Delay = step + 1;
										}
								}
								
							}
							else if (ghosts[0].direction == 0 ){
								Blinky.position.y+=0.05;
								
								if(Blinky.position.y >= topWall )
									RandomDirection(0);
								
								if(ghosts[0].Delay < step){
									if(ghosts[0].Model == 0){
											Blinky.material = BlinkyU1;
											ghosts[0].Model = 1;
											ghosts[0].Delay = step + 1;
										}
										else{
											Blinky.material = BlinkyU2;
											ghosts[0].Model = 0;
											ghosts[0].Delay = step + 1;
										}
								}
							}
							
						}
						else if (e == Pinky){		
							if (ghosts[1].direction == 3 ){
								Pinky.position.x+=0.05;
								
								if(Pinky.position.x >= rightWall )
									RandomDirection(1);
								
								if(ghosts[1].Delay < step){
									if(ghosts[1].Model == 0){
											Pinky.material = PinkyR1;
											ghosts[1].Model = 1;
											ghosts[1].Delay = step + 1;
										}
										else{
											Pinky.material = PinkyR2;
											ghosts[1].Model = 0;
											ghosts[1].Delay = step + 1;
										}
								}
							}
							else if (ghosts[1].direction == 2 ){
								Pinky.position.x-=0.05;
								
								if(Pinky.position.x <= leftWall )
									RandomDirection(1);
								
								if(ghosts[1].Delay < step){
									if(ghosts[1].Model == 0){
											Pinky.material = PinkyL1;
											ghosts[1].Model = 1;
											ghosts[1].Delay = step + 1;
										}
										else{
											Pinky.material = PinkyL2;
											ghosts[1].Model = 0;
											ghosts[1].Delay = step + 1;
										}
								}								
							}
							else if (ghosts[1].direction == 1 ){
								Pinky.position.y-=0.05;
								
								if(Pinky.position.y <= bottomWall )
									RandomDirection(1);
								
								if(ghosts[1].Delay < step){
									if(ghosts[1].Model == 0){
											Pinky.material = PinkyD1;
											ghosts[1].Model = 1;
											ghosts[1].Delay = step + 1;
										}
										else{
											Pinky.material = PinkyD2;
											ghosts[1].Model = 0;
											ghosts[1].Delay = step + 1;
										}
								}
							}
							else if (ghosts[1].direction == 0 ){
								Pinky.position.y+=0.05;
								
								if(Pinky.position.y >= topWall )
									RandomDirection(1);
								
								//Moving Scripts
								if(ghosts[1].Delay < step){
									
									if(ghosts[1].Model == 0){
										Pinky.material = PinkyU1;
										ghosts[1].Model = 1;
										ghosts[1].Delay = step + 1;
									}
									else{
										Pinky.material = PinkyU2;
										ghosts[1].Model = 0;
										ghosts[1].Delay = step + 1;
									}
									
								}
							
							}
							
						}
						else if (e == Inky){		
							if (ghosts[2].direction == 3 ){
								Inky.position.x+=0.05;
								
								if(Inky.position.x >= rightWall )
									RandomDirection(2);
								
								//Moving Scripts
								if(ghosts[2].Delay < step){
									
									if(ghosts[2].Model == 0){
										Inky.material = InkyR2;
										ghosts[2].Model = 1;
										ghosts[2].Delay = step + 1;
									}
									else{
										Inky.material = InkyR1;
										ghosts[2].Model = 0;
										ghosts[2].Delay = step + 1;
									}
									
								}
							
							}
							else if (ghosts[2].direction == 2 ){
								Inky.position.x-=0.05;
								
								if(Inky.position.x <= leftWall )
									RandomDirection(2);
								
								//Moving Scripts
								if(ghosts[2].Delay < step){
									
									if(ghosts[2].Model == 0){
										Inky.material = InkyL2;
										ghosts[2].Model = 1;
										ghosts[2].Delay = step + 1;
									}
									else{
										Inky.material = InkyL1;
										ghosts[2].Model = 0;
										ghosts[2].Delay = step + 1;
									}
									
								}
							
								
							}
							else if (ghosts[2].direction == 1 ){
								Inky.position.y-=0.05;
								
								if(Inky.position.y <= bottomWall )
									RandomDirection(2);
								
								//Moving Scripts
								if(ghosts[2].Delay < step){
									
									if(ghosts[2].Model == 0){
										Inky.material = InkyD2;
										ghosts[2].Model = 1;
										ghosts[2].Delay = step + 1;
									}
									else{
										Inky.material = InkyD1;
										ghosts[2].Model = 0;
										ghosts[2].Delay = step + 1;
									}									
								}
								
							}
							else if (ghosts[2].direction == 0 ){
								Inky.position.y+=0.05;
								
								if(Inky.position.y >= topWall )
									RandomDirection(2);
								
								//Moving Scripts
								if(ghosts[2].Delay < step){
									
									if(ghosts[2].Model == 0){
										Inky.material = InkyU2;
										ghosts[2].Model = 1;
										ghosts[2].Delay = step + 1;
									}
									else{
										Inky.material = InkyU1;
										ghosts[2].Model = 0;
										ghosts[2].Delay = step + 1;
									}
									
								}
							}
							
						}
						else if (e == Clyde){		
							if (ghosts[3].direction == 3 ){
								Clyde.position.x+=0.05;
								//Inky.material = InkyR1;
								if(Clyde.position.x >= rightWall )
									RandomDirection(3);
								
								//Moving Script
								if(ghosts[3].Delay < step){
									if(ghosts[3].Model == 0){
										Clyde.material = ClydeR2;
										ghosts[3].Model = 1;
										ghosts[3].Delay = step + 1;
									}
									else{
										Clyde.material = ClydeR1;
										ghosts[3].Model = 0;
										ghosts[3].Delay = step + 1;
									}
									
								}
							}
							else if (ghosts[3].direction == 2 ){
								Clyde.position.x-=0.05;
								
								if(Clyde.position.x <= leftWall )
									RandomDirection(3);
								
								//Moving Script
								if(ghosts[3].Delay < step){
									if(ghosts[3].Model == 0){
										Clyde.material = ClydeL2;
										ghosts[3].Model = 1;
										ghosts[3].Delay = step + 1;
									}
									else{
										Clyde.material = ClydeL1;
										ghosts[3].Model = 0;
										ghosts[3].Delay = step + 1;
									}
									
								}
								
								
								
							}
							else if (ghosts[3].direction == 1 ){
								Clyde.position.y-=0.05;
								
								if(Clyde.position.y <= bottomWall )
									RandomDirection(3);
								
								// Moving Script
								if(ghosts[3].Delay < step){
									if(ghosts[3].Model == 0){
										Clyde.material = ClydeD2;
										ghosts[3].Model = 1;
										ghosts[3].Delay = step + 1;
									}
									else{
										Clyde.material = ClydeD1;
										ghosts[3].Model = 0;
										ghosts[3].Delay = step + 1;
									}
									
								}
							}
							else if (ghosts[3].direction == 0 ){
								Clyde.position.y+=0.05;
								
								if(Clyde.position.y >= topWall )
									RandomDirection(3);
								
								//Moving Script
								if(ghosts[3].Delay < step){
									if(ghosts[3].Model == 0){
										Clyde.material = ClydeU2;
										ghosts[3].Model = 1;
										ghosts[3].Delay = step + 1;
									}
									else{
										Clyde.material = ClydeU1;
										ghosts[3].Model = 0;
										ghosts[3].Delay = step + 1;
									}									
								}
							}
						}
						else if( e == Lasers){
							if(LDir == 3)
								Lasers.position.x+=0.175;
							else if(LDir == 2)
								Lasers.position.x-=0.175;
							else if(LDir == 0)
								Lasers.position.y+=0.155;
							else
								Lasers.position.y-=0.155;
							
							if( (lag - 0.2) < step)
								scene.remove(Lasers);
							
							if((Math.abs(Lasers.position.x-Pinky.position.x)<0.5) && (Math.abs(Lasers.position.y-Pinky.position.y) <0.5)){
								scene.remove(Pinky);
								scene.remove(Lasers);
							}
							else if((Math.abs(Lasers.position.x-Inky.position.x) <0.5) && (Math.abs(Lasers.position.y-Inky.position.y) <0.5)){
								scene.remove(Inky);
								scene.remove(Lasers);
							}
							else if((Math.abs(Lasers.position.x-Clyde.position.x) <0.5) && (Math.abs(Lasers.position.y-Clyde.position.y) <0.5)){
								scene.remove(Clyde);
								scene.remove(Lasers);
							}
						}
					});					
			}
			
			function RandomDirection(gNum){ //gNum the number of the ghosts
				//Randomly finds a new direction from before
				direction = (Math.floor(Math.random()*20))%4;
				
				//Blinky
				if (direction == 0 && ghosts[gNum].Name == "Blinky") {
					ghosts[gNum].direction = 0;
					Blinky.material = BlinkyU1;
				}
				else if (direction == 1 && ghosts[gNum].Name == "Blinky") {
					ghosts[gNum].direction = 1;
					Blinky.material = BlinkyD1;
				}
				else if (direction == 2 && ghosts[gNum].Name == "Blinky") {
					ghosts[gNum].direction = 2;
					Blinky.material = BlinkyL1;
				}
				else if (direction == 3 && ghosts[gNum].Name == "Blinky") {
					ghosts[gNum].direction = 3;
					Blinky.material = BlinkyR1;
				}
				//Pinky
				else if (direction == 0 && ghosts[gNum].Name == "Pinky") {
					ghosts[gNum].direction = 0;
					Pinky.material = PinkyU1;
				}
				else if (direction == 1 && ghosts[gNum].Name == "Pinky") {
					ghosts[gNum].direction = 1;
					Pinky.material = PinkyD1;
				}
				else if (direction == 2 && ghosts[gNum].Name == "Pinky") {
					ghosts[gNum].direction = 2;
					Pinky.material = PinkyL1;
				}
				else if (direction == 3 && ghosts[gNum].Name == "Pinky") {
					ghosts[gNum].direction = 3;
					Pinky.material = PinkyR1;
				}
				//Inky
				else if (direction == 0 && ghosts[gNum].Name == "Inky") {
					ghosts[gNum].direction = 0;
					Inky.material = InkyU1;
				}
				else if (direction == 1 && ghosts[gNum].Name == "Inky") {
					ghosts[gNum].direction = 1;
					Inky.material = InkyD1;
				}
				else if (direction == 2 && ghosts[gNum].Name == "Inky") {
					ghosts[gNum].direction = 2;
					Inky.material = InkyL1;
				}
				else if (direction == 3 && ghosts[gNum].Name == "Inky") {
					ghosts[gNum].direction = 3;
					Inky.material = InkyR1;
				}
				//Clyde
				else if (direction == 0 && ghosts[gNum].Name == "Clyde") {
					ghosts[gNum].direction = 0;
					Clyde.material = ClydeU1;
				}
				else if (direction == 1 && ghosts[gNum].Name == "Clyde") {
					ghosts[gNum].direction = 1;
					Clyde.material = ClydeD1;
				}
				else if (direction == 2 && ghosts[gNum].Name == "Clyde") {
					ghosts[gNum].direction = 2;
					Clyde.material = ClydeL1;
				}
				else if (direction == 3 && ghosts[gNum].Name == "Clyde") {
					ghosts[gNum].direction = 3;
					Clyde.material = ClydeR1;
				}
				ghosts[gNum].Step = step+1;
			}
			
			function load_Walls(){
				console.log("Loading the Walls")
				
				
			}
			
			
			function shootLaser(){
				scene.add(Lasers);
				//UP
				if (ghosts[0].direction == 0 ){
					Lasers.position.set(Blinky.position.x,Blinky.position.y+1.5,35);
					Lasers.scale.set(1.0,1.0,0);
					Lasers.material.rotation = 0;
					LDir =0;
				}
				//Left
				else if (ghosts[0].direction == 2 ){
					Lasers.position.set(Blinky.position.x-1.5,Blinky.position.y,35);
					Lasers.material.rotation = Math.PI/2;
					Lasers.scale.set(0.75,1.2,0);
					LDir = 2;
				}
				//Down
				else if (ghosts[0].direction == 1 ){
					Lasers.position.set(Blinky.position.x,Blinky.position.y-1.5,35);
					Lasers.scale.set(1.0,1.0,0);
					Lasers.material.rotation = 0;
					LDir =1;
				}
				//Right
				else if (ghosts[0].direction == 3 ){
					Lasers.position.set(Blinky.position.x+1.5,Blinky.position.y,35);
					Lasers.material.rotation = Math.PI/2;
					Lasers.scale.set(0.75,1.2,0);
					LDir = 3;
				}
			}
			
			function loadX(){
				var loader = new THREE.TextureLoader();
				loader.crossOrigin = true;
				
				//Apple
				var Texture00 = loader.load( 'Images/laser.png' );
				Texture00.minFilter = THREE.LinearFilter;
				laser = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				
				Lasers =  new THREE.Sprite(laser);					
				
				//Adding Fruit to Scene
				//scene.add(Lasers);
				//Lasers.position.set(-2,2,35);
				//Lasers.scale.set(1.0,1.0,0);
				
			}
			
			
			//Loads the Fruits Sprites Sheet
			function load_Fruits(){
				//Loader for Sprites
				var loader = new THREE.TextureLoader();
				loader.crossOrigin = true;
				
				//Apple
				var Texture00 = loader.load( 'Images/Ghosts/Fruits/Apple.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Apple = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Fruits.push(Apple);
				//Banana
				Texture00 = loader.load( 'Images/Ghosts/Fruits/Banana.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Banana = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Fruits.push(Banana);
				//Cherry
				Texture00 = loader.load( 'Images/Ghosts/Fruits/Cherry.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Cherry = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Fruits.push(Cherry);
				//Orange
				Texture00 = loader.load( 'Images/Ghosts/Fruits/Orange.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Orange = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Fruits.push(Orange);
				//Pear
				Texture00 = loader.load( 'Images/Ghosts/Fruits/Pear.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Pear = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Fruits.push(Pear);
				//Pretzel
				Texture00 = loader.load( 'Images/Ghosts/Fruits/Pretzel.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Pretzel = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Fruits.push(Pretzel);
				//Strawberry
				Texture00 = loader.load( 'Images/Ghosts/Fruits/Strawberry.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Strawberry = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Fruits.push(Strawberry);		
				//Grapes lol I made this one!!! :D
				Texture00 = loader.load( 'Images/Ghosts/Fruits/Grapes.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Grapes = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Fruits.push(Grapes);	
				
				
				Fruit =  new THREE.Sprite(Apple);					
				
				//Adding Fruit to Scene
				scene.add(Fruit);
				Fruit.position.set(-5,5,35);
				Fruit.scale.set(1.0,.6,0);
				
				
			}
			
			//Loads the Ghost Sprite Sheets
			function load_Ghost(){
				//Sprites			
					//Loader for sprites
					var loader = new THREE.TextureLoader();
					loader.crossOrigin = true;
					
					//Full Blinky
					var Texture00 = loader.load( 'Images/Ghosts/Blinky/BlinkyL1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					BlinkyL1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Blinky/BlinkyL2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					BlinkyL2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Blinky/BlinkyU1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					BlinkyU1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
					
					Texture00 = loader.load( 'Images/Ghosts/Blinky/BlinkyU2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					BlinkyU2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Blinky/BlinkyR1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					BlinkyR1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Blinky/BlinkyR2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					BlinkyR2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Blinky/BlinkyD1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					BlinkyD1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
					
					Texture00 = loader.load( 'Images/Ghosts/Blinky/BlinkyD2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					BlinkyD2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Blinky =  new THREE.Sprite(BlinkyL1);	
					
					//Full Pinky
					Texture00 = loader.load( 'Images/Ghosts/Pinky/PinkyL1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					PinkyL1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Pinky/PinkyL2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					PinkyL2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Pinky/PinkyU1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					PinkyU1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
					
					Texture00 = loader.load( 'Images/Ghosts/Pinky/PinkyU2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					PinkyU2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Pinky/PinkyR1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					PinkyR1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Pinky/PinkyR2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					PinkyR2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Pinky/PinkyD1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					PinkyD1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
					
					Texture00 = loader.load( 'Images/Ghosts/Pinky/PinkyD2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					PinkyD2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Pinky =  new THREE.Sprite(PinkyL1);
					
					//Full Inky
					Texture00 = loader.load( 'Images/Ghosts/Inky/InkyL1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					InkyL1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Inky/InkyL2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					InkyL2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Inky/InkyU1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					InkyU1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
					
					Texture00 = loader.load( 'Images/Ghosts/Inky/InkyU2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					InkyU2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Inky/InkyR1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					InkyR1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Inky/InkyR2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					InkyR2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Inky/InkyD1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					InkyD1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
					
					Texture00 = loader.load( 'Images/Ghosts/Inky/InkyD2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					InkyD2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Inky =  new THREE.Sprite(InkyL1);
					
					//Full Clyde
					Texture00 = loader.load( 'Images/Ghosts/Clyde/ClydeL1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					ClydeL1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Clyde/ClydeL2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					ClydeL2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Clyde/ClydeU1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					ClydeU1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
					
					Texture00 = loader.load( 'Images/Ghosts/Clyde/ClydeU2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					ClydeU2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Clyde/ClydeR1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					ClydeR1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Clyde/ClydeR2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					ClydeR2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Texture00 = loader.load( 'Images/Ghosts/Clyde/ClydeD1.png' );
					Texture00.minFilter = THREE.LinearFilter;
					ClydeD1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
					
					Texture00 = loader.load( 'Images/Ghosts/Clyde/ClydeD2.png' );
					Texture00.minFilter = THREE.LinearFilter;
					ClydeD2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
					
					Clyde =  new THREE.Sprite(ClydeL1);
					
					
					
					
					// Adding Ghost to Scene
					scene.add(Blinky);
					Blinky.position.set(0,0,35);
					Blinky.scale.set(1.25,.75,0);
					
					scene.add(Pinky);
					Pinky.position.set(2,1,35);
					Pinky.scale.set(1.25,.75,0);
					
					scene.add(Inky);
					Inky.position.set(-2,-1,35);
					Inky.scale.set(1.25,.75,0);
					
					scene.add(Clyde);
					Clyde.position.set(2,-1,35);
					Clyde.scale.set(1.25,.75,0);
					
					
					ghosts= [];					
					//Blinky
					var G1 = {Status: "Chase", Name:"Blinky", Delay:0, direction : 2, Model:0};
					ghosts.push(G1);
					//Pinky
					var G2 = {Status: "Chase", Name:"Pinky", Delay:0, direction : 3, Model:0};
					ghosts.push(G2);
					//Inky
					var G3 = {Status: "Chase", Name:"Inky", Delay:0, direction : 0, Model:0};
					ghosts.push(G3);
					//Cylde
					var G4 = {Status: "Chase", Name:"Clyde", Delay:0, direction : 1, Model:0};
					ghosts.push(G4);
					
			}
}
	//window.onload = init;	
	window.onload = setup;	