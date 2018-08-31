var socket;
var player;

//Player 1
var Red={direction:"Down"};
//Player 2
var Blue={direction:"Right"};
//Player 3
var Purple={direction:"Up"};
//Player 4
var Green={direction:"Left"};
var text2="Score";//score text;
var score=0;

//Quarters of the map 
var Q01 = {};

function setup() {
	//initial test direction
	var direction=-1;
	///////Music
	var BeginningAudio = new Audio('../Sounds/pacman_beginning.mp3');
		//BeginningAudio.play();
	
	var SirenAudio = new Audio('../Sounds/Pacman_Siren_Sound_Effect.mp3');
		//SirenAudio.loop=true;
		
		//console.log("Beginning Audio ended:"+BeginningAudio.ended);
		//console.log("Siren Audio:"+SirenAudio.paused);
		
	//Server Code///////////////////////
		socket = io.connect('http://localhost:9000');
		//socket = io.connect('http://ec2-54-89-67-151.compute-1.amazonaws.com:9000/');
		
		
		setTimeout(joinGame,100);
		  
		  socket.on('playerNo',
			function(data) {
				console.log("This is player "+data.p);
				player=data.p;
				document.getElementById("player").innerHTML = player;
			});
		  
		//Receive all players key actions and determines what the other players have done
		socket.on('Player 1',
			function(data){
			console.log("Player 1 just moved!!!")
			Red.direction=data.d;
			});			
			
		socket.on('Player 2',
			function(data){
			console.log("Player 2 just moved!!!")
			Blue.direction=data.d;
			});
			
		socket.on('Player 3',
			function(data){
			console.log("Player 3 just moved!!!")
			Purple.direction=data.d;
			});
			
		socket.on('Player 4',
			function(data){
			console.log("Player 4 just moved!!!")
			Green.direction=data.d;
			});
		/**	
		socket.on('playersForPacMan',
			function(data){
				if(data.p1==true) {};//addPlayers(1);
				if(data.p2==true) {};//addPlayers(2);
				if(data.p3==true) {};//addPlayers(3);
				if(data.p4==true) {};//addPlayers(4);
						
			})
			**/
			
		
	/////////////////////////////////////////////////////////////
	//Pac-Man Code	
		//initial direction.. change to zero once everything is set up
		
		var stats = initStats();
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();
		
		//Default Player Chars Sets
		var posX=16;//Starting X Value
		var posY=15;//Starting Y Value
		var posZ=0; //Starting Z value
		
		//Initial translating players
		var transX=-2;
		var transY=0;
		var transZ=0;	
		

        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, 800/ 500, 0.1, 1000);
		camera.position.set(0,0,50);
		scene.add(camera);
	
        // create a render and set the size
        var renderer = new THREE.WebGLRenderer({ antialias: true} );

        renderer.setClearColor(new THREE.Color(0x000000, 1.0));
		//set the size
        renderer.setSize(700, 520);
        renderer.shadowMapEnabled = true;

        //PLANES FOR THE GAME OUTLINE
			var planeMaterial = new THREE.MeshLambertMaterial({color: 0x111150});
			
		//LEFT PLANE
			var leftplaneGeometry = new THREE.PlaneBufferGeometry (15, 80,0);
			var leftPlane = new THREE.Mesh(leftplaneGeometry, planeMaterial);
			leftPlane.receiveShadow = false;
			//position the plane
			leftPlane.position.x = -28;
			leftPlane.position.y = 0;
			leftPlane.position.z = 3;
		
		//RIGHT PLANE
			var rightplaneGeometry = new THREE.PlaneBufferGeometry (17, 80,0);
			var rightPlane = new THREE.Mesh(rightplaneGeometry, planeMaterial);
			rightPlane.receiveShadow = false;
			//position the plane
			rightPlane.position.x = 25;
			rightPlane.position.y = 0;
			rightPlane.position.z = 3;
		
		//BOTTOM PLANE
			var bottomplaneGeometry = new THREE.PlaneBufferGeometry (41, 4,0);
			var bottomPlane = new THREE.Mesh(bottomplaneGeometry, planeMaterial);
			bottomPlane.receiveShadow = false;
			//position the plane
			bottomPlane.position.x = 0;
			bottomPlane.position.y = -19;
			bottomPlane.position.z = 3;	

		//TOP PLANE
			var topplaneGeometry = new THREE.PlaneBufferGeometry (41, 7,0);
			var topPlane = new THREE.Mesh(bottomplaneGeometry, planeMaterial);
			topPlane.receiveShadow = false;
			//position the plane
			topPlane.position.x = 0;
			topPlane.position.y = 20;
			topPlane.position.z = 3;					

        //Add the Planes
			scene.add(leftPlane);		
			scene.add(bottomPlane);		
			scene.add(rightPlane);	
			scene.add(topPlane);	
		
		
		//Cube Geometry
		var texture = THREE.ImageUtils.loadTexture( '../Images/azul.gif' );
		
		var wallGeom = new THREE.BoxGeometry( 1, 3, 1);
		var wallMaterial = new THREE.MeshBasicMaterial( { map: texture } );
		
			var wall1= new THREE.Mesh( wallGeom, wallMaterial );
			var wall2= new THREE.Mesh( wallGeom, wallMaterial );
			var wall3= new THREE.Mesh( wallGeom, wallMaterial );
			var wall4= new THREE.Mesh( wallGeom, wallMaterial );
			
			scene.add(wall1);
			scene.add(wall2);
			scene.add(wall3);
			scene.add(wall4);
			
			wall1.position.x=-14;
			wall1.position.y=13;
			
			wall2.position.x=-16;
			wall2.position.y=12;
			
			wall3.position.x=10;
			wall3.position.y=13;
			
			wall4.position.x=12;
			wall4.position.y=12;
			//Side way wall is wall.rotation.z= Math.PI/2;
			wall1.rotation.z=Math.PI/2;
			wall3.rotation.z=Math.PI/2;
			
			
			//Back walls			
			
			wallGeom = new THREE.BoxGeometry( 1, 40, 1);		
			//North wall			
			var North= new THREE.Mesh( wallGeom, wallMaterial );
			North.position.y=17;
			North.position.x=-2;
			North.rotation.z=Math.PI/2;			
			//South wall
			South= new THREE.Mesh( wallGeom, wallMaterial );
			South.position.y=-17;
			South.position.x=-2;
			South.rotation.z=Math.PI/2;
			
			wallGeom = new THREE.BoxGeometry( 1, 32, 1);
			//East wall
			East= new THREE.Mesh( wallGeom, wallMaterial );
			East.position.y=0;
			East.position.x=16;			
			//West wall
			var West= new THREE.Mesh( wallGeom, wallMaterial );
			West.position.y=0;
			West.position.x=-20;
					
			
			scene.add(North);
			scene.add(South);
			scene.add(East);
			scene.add(West);
			
		
		
		//SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
		/*
			radius — sphere radius. Default is 50.
			widthSegments — number of horizontal segments. Minimum value is 3, and the default is 8.
			heightSegments — number of vertical segments. Minimum value is 2, and the default is 6.
			phiStart — specify horizontal starting angle. Default is 0.
			phiLength — specify horizontal sweep angle size. Default is Math.PI * 2.
			thetaStart — specify vertical starting angle. Default is 0.
			thetaLength — specify vertical sweep angle size. Default is Math.PI.
		*/
		
		//For the players glow: 
				//http://stemkoski.github.io/Three.js/Atmosphere.html
				//http://stemkoski.github.io/Three.js/Shader-Glow.html
				
		//tokens
        var sphereGeometry = new THREE.SphereGeometry(0.2, 6, 6);
		var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xFFEE00,transparent: true, opacity: 0.25 } );
		var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);	
		
		//Default size
		sphereGeometry = new THREE.SphereGeometry(1, 6, 6);
		//
		var P1Material = new THREE.MeshLambertMaterial({color: 0xFF0000})
		var P1= new THREE.Mesh(sphereGeometry, P1Material);
		//Starts in the NE Section
			P1.position.x = posX+transX;
			P1.position.y = posY+transY;
			P1.position.z = posZ+transZ;
			P1.castShadow = true;
		
		
		//Player 2
		var P2Material = new THREE.MeshLambertMaterial({color: 0x00BFFF})
		var P2= new THREE.Mesh(sphereGeometry, P2Material);
		//Starts in the NW Section
			P2.position.x = -posX+transX;
			P2.position.y = posY+transY;
			P2.position.z = posZ+transZ;
			P2.castShadow = true;
			
		//Player 3
		var P3Material = new THREE.MeshLambertMaterial({color: 0x9370DB})
		var P3= new THREE.Mesh(sphereGeometry, P3Material);
		//Starts in the SW Section
			P3.position.x = -posX+transX;
			P3.position.y = -posY+transY;
			P3.position.z = posZ+transZ;
			P3.castShadow = true;
			
		//Player 4
		var P4Material = new THREE.MeshLambertMaterial({color: 0xADFF2F})
		var P4= new THREE.Mesh(sphereGeometry, P4Material);
		//Starts in the SE Section
			P4.position.x = posX+transX;
			P4.position.y = -posY+transY;
			P4.position.z = posZ+transZ;
			P4.castShadow = true;
		
		//Adding to the scene
		 //scene.add(sphere);
		 scene.add(P1);
		 scene.add(P2);
		 scene.add(P3);
		 scene.add(P4);
		 
		 
		//Keyboard Functions
		var onKeyDown = function(event) {			
			//Arrows Keys
		if (event.keyCode == 32) { // when 'space bar' is pressed
				direction=-1;
				//The scoring feature works!!!!
				score+=25;
				document.getElementById("score").innerHTML = score;
				console.log(player+":Space")
				
				}
		
		if (event.keyCode == 65) { // when 'left arrow' is pressed
				//left arrow keycode = 37
				// a keycode = 65
				if(direction!="Left"){
					direction="Left";//West-180
					Red.direction="Left";
					if (player === undefined) {
						joinGame();
					}
					var data={d:direction,p:player};
					console.log("Changing directions for P"+player+" to " + direction);
					socket.emit('playerDirection',data);		
				}
				}
				
		else if (event.keyCode == 87) { // when 'up arrow' is pressed
				//down arrow keycode = 38
				// w keycode = 87
				if(direction!="Up"){
					direction="Up";//North-90
					Red.direction="Up";
					if (player === undefined) {
						joinGame();
					}
					var data={d:direction,p:player};
					console.log("Changing directions for P"+player+" to " + direction);
					socket.emit('playerDirection',data);
				}
				}
				
		else if (event.keyCode == 68) { // when 'right arrow' is pressed
				//right arrow keycode = 39
				// d keycode = 68
				if(direction!="Right"){
					direction="Right";//East-90
					Red.direction="Right";
					if (player === undefined) {
						joinGame();
					}
					var data={d:direction,p:player};
					console.log("Changing directions for P"+player+" to " + direction);
					socket.emit('playerDirection',data);
				}
				}
				
		else if (event.keyCode == 83) { // when 'down arrow' is pressed
				//down arrow keycode = 40
				// s keycode = 83
				if(direction!="Down"){
					direction="Down";//South-270
					Red.direction="Down";
					if (player === undefined) {
						joinGame();
					}
					var data={d:direction,p:player};
					console.log("Changing directions for P"+player+" to " + direction);
					socket.emit('playerDirection',data);
				}	
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
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		
        //orbit = new THREE.OrbitControls(camera, webGLRenderer.domElement);
		
        //call the render function
        renderer.render(scene, camera);
		
		//call the render function
        var step = 0;		
		
        renderScene();

        function renderScene() {
            stats.update();
            step += 0.1;

            //render using requestAnimationFrame
            requestAnimationFrame(renderScene);
            renderer.render(scene, camera);
			
			//So it will play the beginning and then the main theme
			if(BeginningAudio.ended && SirenAudio.paused){				
				SirenAudio.play();
			}
			
			//is there a token in the scene?
			/* if(scene.getObjectByName('sphere')=null){
				scene.add(sphere);
				sphere.position.x = -15+Math.floor((Math.random() * 30) + 1);;
				sphere.position.y = -16+Math.floor((Math.random() * 30) + 1);;
				sphere.position.z = 0;
				
			}; */			
						
			//Move all the players
			scene.traverse(function (e) {
                if (e instanceof THREE.Mesh && (e == P1|| e == P2|| e == P3|| e == P4)) {
					var dir=direction;
					       if(e==P1)dir=Red.direction;
					else if(e==P2)dir=Blue.direction;
					else if(e==P3)dir=Purple.direction;
					else if(e==P4)dir=Green.direction;
					
					//dir=direction;
					//Outlines the walls
					if(dir=="Right" && e.position.x<(posX+transX)){
						e.position.x+=0.1;
					}
					else if(dir=="Up" && e.position.y<(posY+transY)){
						e.position.y+=0.1;
					}
					else if(dir=="Left" && e.position.x>(-posX+transX)){
						e.position.x-=0.1;
					}
					else if(dir=="Down" && e.position.y>(-posY+transY)){
						e.position.y-=0.1;
					}
				}
			});		
        }
		
/*  	function playerMoved(direction,sphere){
			if(direction==0){
				sphere.position.x+=0.2;
			}
			else if(direction==1){
				sphere.position.y+=0.2;
			}
			else if(direction==2){
				sphere.position.x-=0.2;
			}
			else if(direction==3){
				sphere.position.y-=0.2;
			}
		} */
		
		function initStats() {

            var stats = new Stats();

            //stats.setMode(0); // 0: fps, 1: ms

            // Align top-left
            //stats.domElement.style.position = 'absolute';
            //stats.domElement.style.left = '0px';
            //stats.domElement.style.top = '0px';

            //document.getElementById("Stats-output").appendChild(stats.domElement);

            return stats;
        }
		
		
		
		//Send the key information back to the server
		function sendkey(key) {
		  var data={p:player,k:key};
		  console.log("sendkey: " + data);
		  socket.emit('key',data);
		}
		
		function joinGame() {
		  console.log("Joining Game...");
		  socket.emit('joinGame');
		}
		
		//Send the  directions for player# to change directions
		function playerAction(direction) {
		  var data={d:direction,p:player};
		  console.log("Changing directions for P"+player+" to " + direction);
		  socket.emit('playerAction',data);
		}
		
		//Adding text
		//http://stackoverflow.com/questions/15248872/dynamically-create-2d-text-in-three-js
		text2 = document.createElement('div');
		text2.style.position = 'absolute';
		text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
		text2.style.width = 100;
		text2.style.height = 250;
		text2.style.size=250;
		text2.innerHTML = "Score:";
		text2.style.color = "white";
		text2.style.top = 262 + 'px';
		text2.style.left = 200 + 'px';
		document.body.appendChild(text2);
		
    }
    
	//window.onload = init;	
	window.onload = setup;	