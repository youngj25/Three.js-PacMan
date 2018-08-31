var socket,Pac = io('/pacman', {forceNew:true});
var player, numberOfPlayers=0;
var wait=0, direction = -1;
//Node
var nodes = [], Level=[];
//Fruits
var Fruits = [],geometry, cube;
var Fruit, Apple, Banana, Cherry, Orange, Pear, Pretzel, Strawberry,Grapes;
var Pellets, SuperPellets, PelletsList=[];
//GHOST-Sprites and variables
var ghosts = [], collisionON=true;
var Inky,Blinky,Pinky,Clyde,Courage;
var BlinkyL1,BlinkyL2,BlinkyU1,BlinkyU2,BlinkyR1,BlinkyR2,BlinkyD1,BlinkyD2;
var PinkyL1,PinkyL2,PinkyU1,PinkyU2,PinkyR1,PinkyR2,PinkyD1,PinkyD2;
var InkyL1,InkyL2,InkyU1,InkyU2,InkyR1,InkyR2,InkyD1,InkyD2;
var ClydeL1,ClydeL2,ClydeU1,ClydeU2,ClydeR1,ClydeR2,ClydeD1,ClydeD2;
//Courage is the file for an experimental Ghost I've been working with
var CourageD1,CourageD2,CourageU1,CourageU2,Courage_D1,Courage_D2, cry=false;
var stop = false;
//Pac-Man Players
var pacs = [], PlayerNo;
var P1, P1R1,P1R2,P1L1,P1L2,P1U1,P1U2,P1D1,P1D2;
var P2, P2R1,P2R2,P2U1,P2U2;
var P3, P3R1,P3R2,P3U1,P3U2;
var P4, P4R1,P4R2,P4U1,P4U2;
//2D Text Variables
//var raycaster,mouse;
//Start Screen Texts
var Title, GameStatus, StartGameMesh, AboutMesh, CreditsMesh;
var startGhost1,startGhost2,startGhost3,startGhost4,startGhost5,startGhost6,startGhost7,startGhost8;
var startPercentH = 0.8, startPercentW = 0.1;
//Game Over Screen
var GameOver,PlayAgain;
//Players Score Text
var text, DyGeometry, DyMaterial;
var P1Texture, P2Texture, P3Texture, P4Texture;
var P1Mesh, P2Mesh, P3Mesh, P4Mesh, PlayerMesh;
var P1Score,P2Score,P3Score,P4Score;
var CountDown, GameCountDown = -1;
//TEsting-Array of clickable objects
var clickable = [], textfieldMesh, groupMesh, closeMesh;

//GameStatus has 4 modes "SplashScreen", "StartScreen", "Start" and "Game Over"

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
		var Width,Height;
		//Width		
		if(window.innerWidth > 900) Width = 750;
		else Width = window.innerWidth*0.85;
		//Height
		if(window.innerHeight > 900) Height = 775;
		else Height = window.innerHeight*0.69;
		//Set the Render Size
		renderer.setSize(Width, Height);
		
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
			
		//Sockets
		//socket = io.connect('http://localhost:9000');
		socket = io.connect('ec2-34-205-146-82.compute-1.amazonaws.com:9000');
		
		//Receive the Countdown until the beginning of the Game
		Pac.on('Countdown', function(data) {
				if(GameStatus == "IDLE"){
					GameCountDown = data.count;
					CountDown.parameters.text= "Count Down: "+data.count+" seconds"; //CHANGED
					//P1Score=P2Score=P3Score=P4Score=0;
					//https://www.w3schools.com/jsref/prop_style_color.asp
					
					
					
					if(data.count > 26){
						CountDown.parameters.fillStyle= "Green"; //Light Green
						CountDown.update();
					}
					else if(data.count > 18){
						CountDown.parameters.fillStyle= "Yellow"; //Yellow
						CountDown.update();
					} 
					else if(data.count > 10){
						CountDown.parameters.fillStyle= "Orange"; //Orange 
						CountDown.update();
					} 
					else if(data.count > 0){
						CountDown.parameters.fillStyle= "Red"; //Dark Red
						CountDown.update();
					} 
					else{
						Pac.emit('Pellets');
						CountDown.parameters.text= "";
						scene.remove(CountDown);
						console.log("PlayerMesh: ");
						scene.add(PlayerMesh);
						GameStatus = "Start";
						load_Pac();
						load_Ghost();
						console.log("Num: "+data.numberOfPlayers);
						GameCountDown = -1;
						//Add the score for Player 1
						console.log("P1 Status Prior: "+pacs[0].Status);
						if(data.numberOfPlayers >= 1){
							scene.add( P1Mesh );
							scene.add( P1 );
							P1.position.set(-8,-5,35);
							pacs[0].Status = "Normal"; //Changed from Died to Normal
							console.log("P1 Status: "+pacs[0].Status);
							console.log("P1 Mesh:"+P1Mesh);
							console.log("Added P1");
						}
						//Add the score for Player 2
						if(data.numberOfPlayers >= 2){
							scene.add( P2Mesh );
							scene.add( P2 );
							P2.position.set(8,-5,35);
							pacs[1].Status = "Normal"; //Changed from Died to Normal
							console.log("Added P2");
						}
						//Add the score for Player 3
						if(data.numberOfPlayers >= 3){
							scene.add( P3Mesh );
							scene.add( P3 );
							P3.position.set(-8,3,35);
							pacs[2].Status = "Normal"; //Changed from Died to Normal
							console.log("Added P3");
						}
						//Add the score for Player 4
						if(data.numberOfPlayers >= 4){
							scene.add( P4Mesh );
							scene.add( P4 );
							P4.position.set(8,3,35);
							pacs[3].Status = "Normal"; //Changed from Died to Normal
							console.log("Added P4");
						}
						
					}
				}
			});
		
		Pac.on('Proceed To The Game Level', function(){
				loading_Level_1();
				GameStatus = "IDLE";
				load_Score();
				
				
				//Upload the CountDown
				CountDown = new THREEx.DynamicText2DObject();
				CountDown.parameters.text= ""; //CHANGED
				CountDown.parameters.font= "bolder 185px Arial";
				CountDown.parameters.fillStyle= "white";
				CountDown.parameters.align = "center";
				CountDown.dynamicTexture.canvas.width = 4096;
				CountDown.position.set(0,-2,37);
				CountDown.scale.set(18,3,1);
				CountDown.update();
				scene.add(CountDown);
		});
		
		//Update the scores according to the server!
		Pac.on('scores',function(data) {
			if(GameStatus == "Start"){
				if(data.P1 != -1){
					text = "Player 1: "+data.P1;
					P1Texture.clear('Black').drawText(text, 12, 306, 'Red');
					P1Mesh.material.map = P1Texture.texture;
				}		
				if(data.P2 != -1){
					text = "Player 2: "+data.P2;
					P2Texture.clear('Black').drawText(text, 12, 306, 'DeepSkyBlue');
					P2Mesh.material.map = P2Texture.texture;
				}
				if(data.P3 != -1){
					text = "Player 3: "+data.P3;
					P3Texture.clear('Black').drawText(text, 12, 306, 'Lime');
					P3Mesh.material.map = P3Texture.texture;
				}
				if(data.P4 != -1){
					text = "Player 4: "+data.P3;
					P4Texture.clear('Black').drawText(text, 12, 306, 'DarkViolet');
					P4Mesh.material.map = P4Texture.texture;
				}
			}
		});
		
		//Updates the Pinky Ghost Target Node
		Pac.on('Wait!',function(data) {
				load_StartScreen();
				GameStatus = "StartScreen";
				alert("A Game is already in progress, you'll have to wait")
			//console.log("Updated Pinky!!!");
		});
		
		
		//Change the sign at the bottom left of the screen letting the Player know which player they are
		Pac.on('PlayerInfo',function(sendData) {
				console.log("Player info received.....");
				player = sendData.playerNo;
				
				//console.log("This is player "+player+ " and we are ready to go!!!");
				
				PlayerMesh = new THREEx.DynamicText2DObject();
				PlayerMesh.parameters.text= "";
				PlayerMesh.parameters.font= "35px Arial";
				
				if(player == 1){
					PlayerMesh.parameters.fillStyle= "Red";
					PlayerMesh.parameters.text= "You are Player 1 (Red)";
				}
				else if(player == 2){
					PlayerMesh.parameters.fillStyle= "DeepSkyBlue";
					PlayerMesh.parameters.text= "You are Player 2 (Blue)";
				}
				else if(player == 3){
					PlayerMesh.parameters.fillStyle= "Lime";
					PlayerMesh.parameters.text= "You are Player 3 (Green)";
				}
				else if(player == 4){
					PlayerMesh.parameters.fillStyle= "DarkViolet";
					PlayerMesh.parameters.text= "You are Player 4 (Purple)";
				}
				
				PlayerMesh.parameters.align = "center";
				PlayerMesh.dynamicTexture.canvas.width = 512;
				PlayerMesh.position.set(-5.35,-6.87,35);
				PlayerMesh.scale.set(8,5,1);
				PlayerMesh.update();
				//scene.add(PlayerMesh);
			
		});
		
		/**
		Pac.on('Whose Playing',function(sendData){
			console.log("Players: "+sendData.numberOfPlayers);
			numberOfPlayers = sendData.numberOfPlayers;
			//Add the score for Player 1
			if(sendData.numberOfPlayers >= 1){
				scene.add( P1Mesh );
				pacs[0].Status = "Normal"; //Changed from Died to Normal
			}
			//Add the score for Player 2
			if(sendData.numberOfPlayers >= 2){
				scene.add( P2Mesh );
				pacs[1].Status = "Normal"; //Changed from Died to Normal
			}
			//Add the score for Player 3
			if(sendData.numberOfPlayers >= 3){
				scene.add( P3Mesh );
				pacs[2].Status = "Normal"; //Changed from Died to Normal
			}
			//Add the score for Player 4
			if(sendData.numberOfPlayers >= 4){
				scene.add( P4Mesh );
				pacs[3].Status = "Normal"; //Changed from Died to Normal
			}
		});
		**/
		
		//Incoming report that a player has died
		Pac.on('Player Died', function (newData){
			if(GameStatus == "Start"){
				console.log("A player has died.");
				if(newData.player == 1){
					try{
						scene.remove(P1);
					}catch(e){
						console.log("Player "+newData.player+" Pac-man sprite (P1) has already been removed");
					}
				}
				else if(newData.player == 2){
					try{
						scene.remove(P2);
					}catch(e){
						console.log("Player "+newData.player+" Pac-man sprite (P2) has already been removed");
					}
				}
				else if(newData.player == 3){
					try{
						scene.remove(P3);
					}catch(e){
						console.log("Player "+newData.player+" Pac-man sprite (P3) has already been removed");
					}
				}
				else{ //newData.player == 4
					try{
						scene.remove(P4);
					}catch(e){
						console.log("Player "+newData.player+" Pac-man sprite (P4) has already been removed");
					}
				}
			
			}
		});
		
		//Incoming Report... The Game is Over!!
		Pac.on('Game Over', function (newData){
			if(GameStatus == "Start"){
				pacs[0].Status == "Died";
				pacs[1].Status == "Died";
				pacs[2].Status == "Died";
				pacs[3].Status == "Died";
				GameStatus = "Game Over";
				console.log(GameStatus);
				//Adding Title
				var loader = new THREE.TextureLoader();
				loader.crossOrigin = true;
				var T = loader.load( 'Images/Game Over.png' );
				T.minFilter = THREE.LinearFilter;
				var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
				GameOver = new THREE.Sprite(T1);
				scene.add(GameOver);
				GameOver.position.set(0,-1.25,38);
				GameOver.scale.set(15.5,4,1);
				
				T = loader.load( 'Images/PlayAgain.png' );
				T.minFilter = THREE.LinearFilter;
				T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
				PlayAgain = new THREE.Sprite(T1);
				scene.add(PlayAgain);
				PlayAgain.position.set(0,-3.25,38);
				PlayAgain.scale.set(8,2,1);
				
				//Function
				PlayAgain.callback = function() {
						if(GameStatus == "Game Over"){
							try{
								scene.remove(PlayAgain); 
								scene.remove(GameOver);
								scene.remove(Blinky);
								scene.remove(Pinky);
								scene.remove(Inky);
								scene.remove(Clyde);
								
								GameStatus = "IDLE";
								load_Score();
								resetGhost();
								Pac.emit('Start Count to the Next Game');
								console.log("start the Countdown!!!");
								
								//Upload the CountDown
								CountDown = new THREEx.DynamicText2DObject();
								CountDown.parameters.text= ""; //CHANGED
								CountDown.parameters.font= "bolder 185px Arial";
								CountDown.parameters.fillStyle= "white";
								CountDown.parameters.align = "center";
								CountDown.dynamicTexture.canvas.width = 4096;
								CountDown.position.set(0,-2,37);
								CountDown.scale.set(18,3,1);
								CountDown.update();
								scene.add(CountDown);
								
								while(PelletsList.length > 0){
									scene.remove(PelletsList[0].Pellet);
									PelletsList.splice(0,1);
								}
								
								scene.remove(P1);
								scene.remove(P2);
								scene.remove(P3);
								scene.remove(P4);
								scene.remove(Fruit);
							}catch(e){
								//functionToHandleError(e);		
								//He HE HE don't say a word if errors happen
								scene.remove(Fruit);
								scene.remove(P4);
								scene.remove(P3);
								scene.remove(P2);
								scene.remove(P1);
							}
						}
				};
				clickable.push(PlayAgain);
			}
		});
		
		//Updates the Blinky Ghost Target Node
		Pac.on('Blinky',function(data) {
			//if(GameStatus == "Start")
				ghosts[0].currentNode = data.futureNode;
			//console.log("Updated Blinky!!!");
		});
		
		//Updates the Pinky Ghost Target Node
		Pac.on('Pinky',function(data) {
			//if(GameStatus == "Start")
				ghosts[1].currentNode = data.futureNode;
			//console.log("Updated Pinky!!!");
		});
		
		//Updates the Inky Ghost Target Node
		Pac.on('Inky',function(data) {
			//if(GameStatus == "Start")
				ghosts[2].currentNode = data.futureNode;
			//console.log("Updated Inky!!!");
		});
		
		//Updates the Clyde Ghost Target Node
		Pac.on('Clyde',function(data) {
			//if(GameStatus == "Start")
				ghosts[3].currentNode = data.futureNode;
			//console.log("Updated Clyde!!!");
		});
		
		//Inserts fruits into the game and remove any fruits that might be there already
		Pac.on('insert Fruit',function(data) {
			/*List of Fruits
				Fruit 0 - Apple
				Fruit 1 - Banana
				Fruit 2 - Cherry
				Fruit 3 - Orange
				Fruit 4 - Pear
				Fruit 5 - Pretzel
				Fruit 6 - Strawberry
				Fruit 7 - Grape
			*/
			
			if(GameStatus == "Start"){
				try{
					scene.remove(Fruit);
					}catch(e){
					//He HE HE don't say a word if errors happen and.. try again (-.-)*
					scene.remove(Fruit);
				}
				Fruit.material = Fruits[data.fruitNo];
				Fruit.position.set(nodes[data.node].x, nodes[data.node].y, 34.8);
				scene.add(Fruit);
				Fruit.scale.set(0.8,0.75,1);
				//if(pacs[0].Speed == 1)pacs[0].Speed = 2;
				//else pacs[0].Speed = 1;
				//console.log("Fruit Loaded!!!!!");
				//console.log("Fruit No.:"+data.fruitNo+"  Node:"+data.node);
				//console.log("Node x:"+nodes[data.node].x+"  Node y:"+nodes[data.node].y);
			}
			
		});
		
		//Receives the List of nodes to places the pellets. It places them from one node to another
		Pac.on('insert Pellets',function(sendData) {
			
			//console.log("Pellets received.....");
			//console.log(sendData);
			//console.log(sendData.pelletsList["0"].start +"  "+sendData.pelletsList["0"].end);
			//console.log(sendData.pelletsList[2].start +"  "+sendData.pelletsList[2].end);
			//.pelletsList["0"].start
			if(GameStatus == "Start")				
				for(var x = 0; x < sendData.pelletsList.length; x++)
					insertPellets(sendData.pelletsList[x].start,sendData.pelletsList[x].end,sendData.pelletsList[x].superPellet);
				//console.log(x+". "+sendData.pelletsList[x].superPellet);
		});
		
		//Updates the P1 Pac-man
		Pac.on('P1 Updates',function(data) {
			//if(GameStatus == "Start"){
				if(pacs[0].currentNode == 40){
					pacs[0].currentNode =36;
				}
				else if(pacs[0].currentNode == 41){
					pacs[0].currentNode =11;
				}
				
				if(pacs[0].currentNode != data.node){
				//console.log("P1 Old: "+pacs[0].oldNode+"  Prev: "+pacs[0].previousNode+
				//" Curr: "+pacs[0].currentNode+"  Now to Node: "+data.node);
			
					pacs[0].oldNode = pacs[0].previousNode;
					pacs[0].previousNode = pacs[0].currentNode;
					pacs[0].currentNode = data.node;
			}
		});
		
		//Updates the P2 Pac-man
		Pac.on('P2 Updates',function(data) {
			//if(GameStatus == "Start"){
				if(pacs[1].currentNode == 40){
					pacs[1].currentNode =36;
				}
				else if(pacs[1].currentNode == 41){
					pacs[1].currentNode =11;
				}
				
				
				if(pacs[1].currentNode != data.node){
					pacs[1].oldNode = pacs[1].previousNode;
					pacs[1].previousNode = pacs[1].currentNode;
					pacs[1].currentNode = data.node;
				}			
			});
		
		//Updates the P3 Pac-man
		Pac.on('P3 Updates',function(data) {
			if(GameStatus == "Start"){
				if(pacs[2].currentNode == 40){
					pacs[2].currentNode =36;
				}
				else if(pacs[2].currentNode == 41){
					pacs[2].currentNode =11;
				}
				
				
				if(pacs[2].currentNode != data.node){
					pacs[2].oldNode = pacs[2].previousNode;
					pacs[2].previousNode = pacs[2].currentNode;
					pacs[2].currentNode = data.node;
				}			
			}
		});
		
		//Updates the P4 Pac-man
		Pac.on('P4 Updates',function(data) {
			if(GameStatus == "Start"){
				if(pacs[3].currentNode == 40){
					pacs[3].currentNode =36;
				}
				else if(pacs[3].currentNode == 41){
					pacs[3].currentNode =11;
				}				
				
				if(pacs[3].currentNode != data.node){
					pacs[3].oldNode = pacs[3].previousNode;
					pacs[3].previousNode = pacs[3].currentNode;
					pacs[3].currentNode = data.node;
				}			
			}
		});
		
		//If a player at a fruit, the special properties are activated for that Players
		Pac.on('Update Players', function(data){
			/*List of Fruits
				Fruit 0 - Apple
				Fruit 1 - Banana
				Fruit 2 - Cherry
				Fruit 3 - Orange
				Fruit 4 - Pear
				Fruit 5 - Pretzel
				Fruit 6 - Strawberry
				Fruit 7 - Grape
				Item 8	- Pellet
				Item 9 	- Super Pellet
			*/
			if(GameStatus == "Start"){
					
				var sendData = {Player: data.player, score: 10};
				
				if (data.fruit == 0){//Apple
					sendData.score = 50;
				}
				else if (data.fruit == 1){//Banana			
					pacs[data.player].Speed = 2;
					pacs[data.player].speedCD = 75;
					pacs[data.player].speedB = true;
					sendData.score = 10;
				}
				else if (data.fruit == 2){//Cherry
					sendData.score = 100;
				} 
				else if (data.fruit == 3){//Orange				
					pacs[data.player].Speed = 0.75;
					pacs[data.player].speedCD = 50;
					pacs[data.player].speedB = true;
					sendData.score = 250;
				} 
				//Just for fun lets make 4 & 5 make you grow or shrink for now lol
				else if (data.fruit == 4){//Pear
					//P1.scale.set(1.25,.75,0);
					//pacs[data.player].Speed = 1;
					//pac[0].sizeCD = 100; 
					sendData.score = 50;
				}
				else if (data.fruit == 5){//Pretzel
					//increase Player Score
					sendData.score = 50;
					/**
					if(SuperPellets.name= "Super";)
					P1.scale.set(1.75,1.25,0);
					pacs[data.player].Speed = 1.25;
					pacs[0].sizeCD = 120;
					pacs[0].speedCD = 120;
					pacs[0].sizeB = true;
					pacs[0].speedB = true;
					**/
				}
				else if (data.fruit == 6){//Strawberry
					sendData.score = 150;
				} 
				else if (data.fruit == 7){//Grapes lol Drunkard
					pacs[data.player].Speed = 1.4;
					pacs[data.player].speedCD = 50;
					pacs[data.player].speedB = true;
					sendData.score = 200;
				}
				else if (data.fruit == 8){//Pellet
				} 
				else if (data.fruit == 9){//Super Pellet
					P1.scale.set(1.75,1.25,0);
					pacs[data.player].Speed = 1.25;
					pacs[data.player].sizeCD = 120;
					pacs[data.player].speedCD = 120;
					pacs[data.player].sizeB = true;
					pacs[data.player].speedB = true;
				}
				try{
					Fruit.position.set(6, 6, 34.8);
					scene.remove(Fruit);
				}
				catch(e){
					//Try again....
					Fruit.position.set(6, 6, 34.8);
					scene.remove(Fruit);
				}				
				
				Pac.emit('Update Scores',sendData);
			}
		});
		
		/**Audio
			var wingFlap = new Audio('FlapPyBird-master/assets/audio/wing.ogg');
			wingFlap.volume=0.1;
			*/	
		
		//Keyboard Functions
		var onKeyDown = function(event) {
			if (event.keyCode == 27 && GameStatus == "SplashScreen") { //when 'esc' is pressed
				GameStatus = "Splash_Screen_Transition";
				load_StartScreen();
			}
			else if (event.keyCode == 145) { //when 'SCROLL LOCK' is pressed
					//scene.add(Courage);
					//Courage.position.set(0,0,35);
					//Courage.scale.set(1.25,.75,0);
			}
			else if (event.keyCode == 17 && step >wait && GameStatus == "Start") { //when 'ctrl' is pressed
							//wait = step + 5;							
							//Pac.emit('Fruits');
							//console.log("Pellets List Length "+PelletsList.length);
						}
			else if (event.keyCode == 32  && step >wait && GameStatus == "IDLE" && GameCountDown > 8 ) { //when 'Space Bar' is pressed and 
				wait = step + 0.7;
				Pac.emit("Lower Count");
			}
			else if (((event.keyCode >= 37 && event.keyCode <= 40) ||
				(
					event.keyCode == 65 ||
					event.keyCode == 68 ||
					event.keyCode == 83 ||
					event.keyCode == 87
				)) && step >wait && GameStatus == "Start") { //when an 'Arrow' key is pressed
				
				wait = step + 0.03;
				var data = { direction:"South"};//default South
				if (event.keyCode == 37 || event.keyCode == 65) //when 'Left Arrow' or 'A' is pressed
						data.direction="West";
				else if (event.keyCode == 38 || event.keyCode == 87)  //when 'Up Arrow' or 'W' is pressed
						data.direction="North";
				else if (event.keyCode == 39 || event.keyCode == 68 ) //when 'Right Arrow' or 'D' is pressed
						data.direction="East";
							
				Pac.emit("player "+player,data);
				//Arrow Keys
				//37- Left
				//38- Up
				//39- Right
				//40- Down
				
				//WASD
				//W- 87
				//A- 65
				//S- 83
				//D- 68
			}
						
		}; 
		document.addEventListener('keydown', onKeyDown, false);			
		
		raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();
		
		/** gg**/
		//Mouse Click Event
		function onDocumentMouseDown (event){
			if(GameStatus == "SplashScreen") { //when 'esc' is pressed
				GameStatus = "Splash_Screen_Transition";
				load_StartScreen();
			}
			else if(GameStatus == "StartScreen" || GameStatus == "About" ||
			   GameStatus == "Credits" || GameStatus == "Game Over"){
				console.log("yes");
				
				event.preventDefault();
				mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1.5;
				//mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
				mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1.35;
				console.log("M.x: "+mouse.x+"  M.y:"+mouse.y);
				
				raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObjects( clickable ); 

				if ( intersects.length > 0 ) {
					 intersects[0].object.callback();
				}
			}
			else if(GameStatus == "Start"){
					console.log("pressed");
			}
			//https://stackoverflow.com/questions/12800150/catch-the-click-event-on-a-specific-mesh-in-the-renderer
		}
		renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false)
		
		//console.log(renderer);
		
		//Window Resize Event
		function onWindowResize(){
			var Width,Height;
			if(window.innerWidth > 900) Width = 750;
			else Width = window.innerWidth*0.85;
				
			if(window.innerHeight > 900) Height = 775;
			else Height = window.innerHeight*0.69;
			
			renderer.setSize(Width, Height);
			camera.aspect = renderer.domElement.width/renderer.domElement.height;
		}
		window.addEventListener('resize', onWindowResize, false);
		//https://stackoverflow.com/questions/20290402/three-js-resizing-canvas?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
		
		//From Pacman 3D- Creates/Returns the Pellets
		var createDot = function () {
			return function () {
				//Pellets lol I made this one too!!! :D
				//Loader for Sprites
				var loader = new THREE.TextureLoader();
				loader.crossOrigin = true;
				var Texture00 = loader.load( 'Images/Fruits/pellets.png' );
				Texture00.minFilter = THREE.LinearFilter;
				var Pells = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Pellets =  new THREE.Sprite(Pells);	
				Pellets.scale.set(0.5,0.25,1);
				return Pellets;
			};
		}();
		
		//From Pacman 3D- Creates/Returns the Super Pellets
		var superDot = function () {	
			return function () {
				//Pellets lol I made this one too!!! :D
				//Loader for Sprites
				var loader = new THREE.TextureLoader();
				loader.crossOrigin = true;
				var Texture00 = loader.load( 'Images/Fruits/pellets.png' );
				Texture00.minFilter = THREE.LinearFilter;
				var Pells = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				SuperPellets =  new THREE.Sprite(Pells);	
				SuperPellets.scale.set(0.75,0.5,1);
				SuperPellets.name = "Super";
				return SuperPellets;
			};
		}();
		
        //add spotlight for the shadows
		var spotLight = new THREE.SpotLight(0xffffff);
		spotLight.position.set(0, 50, 150);
		spotLight.castShadow = false;
		spotLight.intensity = 2;
		scene.add(spotLight);
		
		/**
		//Alex helped me out with the button!!
		var canvas2 = document.getElementById("WebGL-output");
		//*[@id="WebGL-output"]/canvas
		console.log(canvas2);
		//var context = canvas2.getContext("2D");
		
		//This should solve the context
		//https://stackoverflow.com/questions/5808162/getcontext-is-not-a-function
		var context2 = canvas2.getContext("webgl");
		//var ctxt = document.getElementById("WebGL-output").getContext('2d');
		var origRect2 = canvas.getBoundingClientRect();
		//var textWidth = context.measureText(buttonText).width;
		
		
		
		canvas2.onclick = function(event){
			//console.log(canvas);
			
			if(GameStatus == "SplashScreen") { //when 'esc' is pressed
				GameStatus = "Splash_Screen_Transition";
				load_StartScreen();
			}
			else if(GameStatus != "IDLE" || GameStatus != "Start") {
				var rect = event.currentTarget.getBoundingClientRect();
				var mouseX = event.pageX - rect.left;
				var mouseY = event.pageY - rect.top;
				
				//We'll customize the length here for each of the five buttons
				//Start, About, Credits, Close and PlayAgain
				var textX = rect.width * startPercentW;
				var textY = (rect.height * startPercentH) - rect.width*0.5;
				console.log("1-"+rect.width*0.5);
				//textY = (rect.height * startPercentH) - renderer.domElement.width*0.5;
				//console.log("2-"+renderer.domElement.width*0.5);
				//console.log(renderer);
				//var textY = (rect.height * startPercentH) - getFontSize(rect);
				
				var maxX = textX + (200 * (rect.width/origRect.width));
				var maxY = rect.height * startPercentH;
				
				if(mouseY > textY && mouseY <= maxY &&
				   mouseX >= textX && mouseX <= maxX){
					  //console.log(AboutMesh);
					   //console.log(AboutMesh.material.map.image.width);
					   console.log("Start");
				   }
				   console.log("____________");
			}
		}
		//console.log(canvas);
		**/
		
		//add the output of the renderer to the html element
		document.getElementById("WebGL-output").appendChild(renderer.domElement);
        //call the render function
		renderer.render(scene, camera);
		
		//call the render function
		var step = 0;		
		renderScene();
		load_Fruits();
		load_GhostSprite();
		load_SplashScreen();
		load_Nodes();
		var ghostRadiusX = 1.1;
		var ghostRadiusY = 0.55;
		
		//Animation Loop
		function renderScene(){
			try{
				//Render steps
					step += 0.1;
					
					//render using requestAnimationFrame
					requestAnimationFrame(renderScene);
					renderer.render(scene, camera);			
					
					//Move all the players
					scene.traverse(function (e) {
						//When the Game Started
						if(GameStatus == "Start"){
							//Ghosts
							//Blinky Actions
							if (e == Blinky){		
								if ((e.position.y - nodes[ghosts[0].currentNode].y) > 0 ){
									e.position.y -= 0.05;					
									e.position.y = Math.round(e.position.y*100)/100;	
									
									if(ghosts[0].Delay < step){
										if(ghosts[0].Model == 0){
												e.material = BlinkyD1;
												ghosts[0].Model = 1;
												ghosts[0].Delay = step + 1;
											}
											else{
												e.material = BlinkyD2;
												ghosts[0].Model = 0;
												ghosts[0].Delay = step + 1;
											}
									}
								}
								else if ((e.position.y - nodes[ghosts[0].currentNode].y) < 0 ){
									e.position.y +=0.05;					
									e.position.y = Math.round(e.position.y*100)/100;					
									
									if(ghosts[0].Delay < step){
										if(ghosts[0].Model == 0){
												e.material = BlinkyU1;
												ghosts[0].Model = 1;
												ghosts[0].Delay = step + 1;
											}
											else{
												e.material = BlinkyU2;
												ghosts[0].Model = 0;
												ghosts[0].Delay = step + 1;
											}
									}
								}
								else if ((e.position.x - nodes[ghosts[0].currentNode].x) > 0 ){
									e.position.x -=0.05;					
									e.position.x = Math.round(e.position.x*100)/100;	
									
									if(ghosts[0].Delay < step){
										if(ghosts[0].Model == 0){
												e.material = BlinkyL1;
												ghosts[0].Model = 1;
												ghosts[0].Delay = step + 1;
											}
											else{
												e.material = BlinkyL2;
												ghosts[0].Model = 0;
												ghosts[0].Delay = step + 1;
											}
									}
									
								}
								else if ((e.position.x - nodes[ghosts[0].currentNode].x) < 0 ){
									e.position.x +=0.05;					
									e.position.x = Math.round(e.position.x*100)/100;	
									
									if(ghosts[0].Delay < step){
										if(ghosts[0].Model == 0){
												e.material = BlinkyR1;
												ghosts[0].Model = 1;
												ghosts[0].Delay = step + 1;
											}
											else{
												e.material = BlinkyR2;
												ghosts[0].Model = 0;
												ghosts[0].Delay = step + 1;
											}
									}
								}
								else{
									ghosts[0].oldNode = ghosts[0].previousNode;
									ghosts[0].previousNode = ghosts[0].currentNode;
									var sendData;
									Pac.emit('Blinky Arrived', sendData={Player:player,status:"Arrived@"+ghosts[0].previousNode, arrived:ghosts[0].previousNode});
								}
								
								if(e.position.y >3.3){
									ghosts[0].oldNode = ghosts[0].previousNode;
									ghosts[0].previousNode = 40;
									ghosts[0].currentNode = 36;
									e.position.y = -5.2;
								}
								else if(e.position.y <-5.3){
									ghosts[0].oldNode = ghosts[0].previousNode;
									ghosts[0].previousNode = 41;
									ghosts[0].currentNode = 11;
									e.position.y = 3.2;
								}
								
								
								//console.log("ff");
								//P1 Collision
								if((Math.abs(e.position.y-P1.position.y)<ghostRadiusY && Math.abs(e.position.x-P1.position.x)<ghostRadiusX) && collisionON){
									//console.log("Blinky Hit!!");
									Collision(P1,e);
								}
								//P2 Collision
								if((Math.abs(e.position.y-P2.position.y)<ghostRadiusY && Math.abs(e.position.x-P2.position.x)<ghostRadiusX) && collisionON){
									//console.log("Blinky Hit!!");
									Collision(P2,e);
								}
								//P3 Collision
								if((Math.abs(e.position.y-P3.position.y)<ghostRadiusY && Math.abs(e.position.x-P3.position.x)<ghostRadiusX) && collisionON){
									//console.log("Blinky Hit!!");
									Collision(P3,e);
								}
								//P4 Collision
								if((Math.abs(e.position.y-P4.position.y)<ghostRadiusY && Math.abs(e.position.x-P4.position.x)<ghostRadiusX) && collisionON){
									//console.log("Blinky Hit!!");
									Collision(P4,e);
								}
							
							}
							//Pinky Actions
							else if (e == Pinky){
								if(ghosts[1].timer > step){
									if(ghosts[1].Delay < step){
										if(ghosts[1].Model == 0){
												e.material = PinkyU1;
												ghosts[1].Model = 1;
												ghosts[1].Delay = step + 1;
											}
											else{
												e.material = PinkyU2;
												ghosts[1].Model = 0;
												ghosts[1].Delay = step + 1;
											}
									}
								}
								else if ((e.position.y - nodes[ghosts[1].currentNode].y) > 0 ){
									e.position.y -= 0.05;					
									e.position.y = Math.round(e.position.y*100)/100;	
									
									if(ghosts[1].Delay < step){
										if(ghosts[1].Model == 0){
												e.material = PinkyD1;
												ghosts[1].Model = 1;
												ghosts[1].Delay = step + 1;
											}
											else{
												e.material = PinkyD2;
												ghosts[1].Model = 0;
												ghosts[1].Delay = step + 1;
											}
									}
								}
								else if ((e.position.y - nodes[ghosts[1].currentNode].y) < 0 ){
									e.position.y +=0.05;					
									e.position.y = Math.round(e.position.y*100)/100;					
									
									if(ghosts[1].Delay < step){
										if(ghosts[1].Model == 0){
												e.material = PinkyU1;
												ghosts[1].Model = 1;
												ghosts[1].Delay = step + 1;
											}
											else{
												e.material = PinkyU2;
												ghosts[1].Model = 0;
												ghosts[1].Delay = step + 1;
											}
									}
								}
								else if ((e.position.x - nodes[ghosts[1].currentNode].x) > 0 ){
									e.position.x -=0.05;					
									e.position.x = Math.round(e.position.x*100)/100;	
									
									if(ghosts[1].Delay < step){
										if(ghosts[1].Model == 0){
												e.material = PinkyL1;
												ghosts[1].Model = 1;
												ghosts[1].Delay = step + 1;
											}
											else{
												e.material = PinkyL2;
												ghosts[1].Model = 0;
												ghosts[1].Delay = step + 1;
											}
									}
									
								}
								else if ((e.position.x - nodes[ghosts[1].currentNode].x) < 0 ){
									e.position.x +=0.05;					
									e.position.x = Math.round(e.position.x*100)/100;	
									
									if(ghosts[1].Delay < step){
										if(ghosts[1].Model == 0){
												e.material = PinkyR1;
												ghosts[1].Model = 1;
												ghosts[1].Delay = step + 1;
											}
											else{
												e.material = PinkyR2;
												ghosts[1].Model = 0;
												ghosts[1].Delay = step + 1;
											}
									}
								}
								else{
									ghosts[1].oldNode = ghosts[1].previousNode;
									ghosts[1].previousNode = ghosts[1].currentNode;
									var sendData;
									Pac.emit('Pinky Arrived', sendData={Player:player,status:"Arrived @ "+ghosts[1].previousNode, arrived:ghosts[1].previousNode});
								}
								
								if(e.position.y >3.3){
									ghosts[1].oldNode = ghosts[1].previousNode;
									ghosts[1].previousNode = 40;
									ghosts[1].currentNode = 36;
									e.position.y = -5.2;
								}
								else if(e.position.y <-5.3){
									ghosts[1].oldNode = ghosts[1].previousNode;
									ghosts[1].previousNode = 41;
									ghosts[1].currentNode = 11;
									e.position.y = 3.2;
								}
							
								//P1 Collision
								if((Math.abs(e.position.y-P1.position.y)<ghostRadiusY && Math.abs(e.position.x-P1.position.x)<ghostRadiusX) && collisionON){
									//console.log("Pinky Hit!!");
									Collision(P1,e);
								}
								//P2 Collision
								if((Math.abs(e.position.y-P2.position.y)<ghostRadiusY && Math.abs(e.position.x-P2.position.x)<ghostRadiusX) && collisionON){
									//console.log("Pinky Hit!!");
									Collision(P2,e);
								}
								//P3 Collision
								if((Math.abs(e.position.y-P3.position.y)<ghostRadiusY && Math.abs(e.position.x-P3.position.x)<ghostRadiusX) && collisionON){
									//console.log("Pinky Hit!!");
									Collision(P3,e);
								}
								//P4 Collision
								if((Math.abs(e.position.y-P4.position.y)<ghostRadiusY && Math.abs(e.position.x-P4.position.x)<ghostRadiusX) && collisionON){
									//console.log("Blinky Hit!!");
									Collision(P4,e);
								}
							}
							//Inky Actions
							else if (e == Inky){		
								if(ghosts[2].timer > step){
									if(ghosts[2].Delay < step){
										if(ghosts[2].Model == 0){
												e.material = InkyU1;
												ghosts[2].Model = 1;
												ghosts[2].Delay = step + 1;
											}
											else{
												e.material = InkyU2;
												ghosts[2].Model = 0;
												ghosts[2].Delay = step + 1;
											}
									}
								}
								else if ((e.position.y - nodes[ghosts[2].currentNode].y) > 0 ){
									e.position.y -= 0.05;					
									e.position.y = Math.round(e.position.y*100)/100;	
									
									if(ghosts[2].Delay < step){
										if(ghosts[2].Model == 0){
												e.material = InkyD1;
												ghosts[2].Model = 1;
												ghosts[2].Delay = step + 1;
											}
											else{
												e.material = InkyD2;
												ghosts[2].Model = 0;
												ghosts[2].Delay = step + 1;
											}
									}
								}
								else if ((e.position.y - nodes[ghosts[2].currentNode].y) < 0 ){
									e.position.y +=0.05;					
									e.position.y = Math.round(e.position.y*100)/100;					
									
									if(ghosts[2].Delay < step){
										if(ghosts[2].Model == 0){
												e.material = InkyU1;
												ghosts[2].Model = 1;
												ghosts[2].Delay = step + 1;
											}
											else{
												e.material = InkyU2;
												ghosts[2].Model = 0;
												ghosts[2].Delay = step + 1;
											}
									}
								}
								else if ((e.position.x - nodes[ghosts[2].currentNode].x) > 0 ){
									e.position.x -=0.05;					
									e.position.x = Math.round(e.position.x*100)/100;	
									
									if(ghosts[2].Delay < step){
										if(ghosts[2].Model == 0){
												e.material = InkyL1;
												ghosts[2].Model = 1;
												ghosts[2].Delay = step + 1;
											}
											else{
												e.material = InkyL2;
												ghosts[2].Model = 0;
												ghosts[2].Delay = step + 1;
											}
									}
									
								}
								else if ((e.position.x - nodes[ghosts[2].currentNode].x) < 0 ){
									e.position.x +=0.05;					
									e.position.x = Math.round(e.position.x*100)/100;	
									
									if(ghosts[2].Delay < step){
										if(ghosts[2].Model == 0){
												e.material = InkyR1;
												ghosts[2].Model = 1;
												ghosts[2].Delay = step + 1;
											}
											else{
												e.material = InkyR2;
												ghosts[2].Model = 0;
												ghosts[2].Delay = step + 1;
											}
									}
								}
								else{
									ghosts[2].oldNode = ghosts[2].previousNode;
									ghosts[2].previousNode = ghosts[2].currentNode;
									var sendData;
									Pac.emit('Inky Arrived', sendData={Player:player,status:"Arrived@"+ghosts[2].previousNode, arrived:ghosts[2].previousNode});
								}
								
								if(e.position.y >3.3){
									ghosts[2].oldNode = ghosts[2].previousNode;
									ghosts[2].previousNode = 40;
									ghosts[2].currentNode = 36;
									e.position.y = -5.2;
								}
								else if(e.position.y <-5.3){
									ghosts[2].oldNode = ghosts[2].previousNode;
									ghosts[2].previousNode = 41;
									ghosts[2].currentNode = 11;
									e.position.y = 3.2;
								}
							
								//P1 Collision
								if((Math.abs(e.position.y-P1.position.y)<ghostRadiusY && Math.abs(e.position.x-P1.position.x)<ghostRadiusX) && collisionON){
									//console.log("Inky Hit!!");
									Collision(P1,e);
								}
								//P2 Collision
								if((Math.abs(e.position.y-P2.position.y)<ghostRadiusY && Math.abs(e.position.x-P2.position.x)<ghostRadiusX) && collisionON){
									//console.log("Pinky Hit!!");
									Collision(P2,e);
								}
								//P3 Collision
								if((Math.abs(e.position.y-P3.position.y)<ghostRadiusY && Math.abs(e.position.x-P3.position.x)<ghostRadiusX) && collisionON){
									//console.log("Pinky Hit!!");
									Collision(P3,e);
								}
								//P4 Collision
								if((Math.abs(e.position.y-P4.position.y)<ghostRadiusY && Math.abs(e.position.x-P4.position.x)<ghostRadiusX) && collisionON){
									//console.log("Blinky Hit!!");
									Collision(P4,e);
								}
							}
							//Clyde Actions
							else if (e == Clyde){		
								if(ghosts[3].timer > step){
									if(ghosts[3].Delay < step){
										if(ghosts[3].Model == 0){
												e.material = ClydeU1;
												ghosts[3].Model = 1;
												ghosts[3].Delay = step + 1;
											}
											else{
												e.material = ClydeU2;
												ghosts[3].Model = 0;
												ghosts[3].Delay = step + 1;
											}
									}
								}
								else if ((e.position.y - nodes[ghosts[3].currentNode].y) > 0 ){
									e.position.y -= 0.05;					
									e.position.y = Math.round(e.position.y*100)/100;	
									
									if(ghosts[3].Delay < step){
										if(ghosts[3].Model == 0){
												e.material = ClydeD1;
												ghosts[3].Model = 1;
												ghosts[3].Delay = step + 1;
											}
											else{
												e.material = ClydeD2;
												ghosts[3].Model = 0;
												ghosts[3].Delay = step + 1;
											}
									}
								}
								else if ((e.position.y - nodes[ghosts[3].currentNode].y) < 0 ){
									e.position.y +=0.05;					
									e.position.y = Math.round(e.position.y*100)/100;					
									
									if(ghosts[3].Delay < step){
										if(ghosts[3].Model == 0){
												e.material = ClydeU1;
												ghosts[3].Model = 1;
												ghosts[3].Delay = step + 1;
											}
											else{
												e.material = ClydeU2;
												ghosts[3].Model = 0;
												ghosts[3].Delay = step + 1;
											}
									}
								}
								else if ((e.position.x - nodes[ghosts[3].currentNode].x) > 0 ){
									e.position.x -=0.05;					
									e.position.x = Math.round(e.position.x*100)/100;	
									
									if(ghosts[3].Delay < step){
										if(ghosts[3].Model == 0){
												e.material = ClydeL1;
												ghosts[3].Model = 1;
												ghosts[3].Delay = step + 1;
											}
											else{
												e.material = ClydeL2;
												ghosts[3].Model = 0;
												ghosts[3].Delay = step + 1;
											}
									}
									
								}
								else if ((e.position.x - nodes[ghosts[3].currentNode].x) < 0 ){
									e.position.x +=0.05;					
									e.position.x = Math.round(e.position.x*100)/100;	
									
									if(ghosts[3].Delay < step){
										if(ghosts[3].Model == 0){
												e.material = ClydeR1;
												ghosts[3].Model = 1;
												ghosts[3].Delay = step + 1;
											}
											else{
												e.material = ClydeR2;
												ghosts[3].Model = 0;
												ghosts[3].Delay = step + 1;
											}
									}
								}
								else{
									ghosts[3].oldNode = ghosts[3].previousNode;
									ghosts[3].previousNode = ghosts[3].currentNode;
									var sendData;
									Pac.emit('Clyde Arrived', sendData={Player:player,status:"Arrived@"+ghosts[3].previousNode, arrived:ghosts[3].previousNode});
								}
								
								if(e.position.y >3.3){
									ghosts[3].oldNode = ghosts[3].previousNode;
									ghosts[3].previousNode = 40;
									ghosts[3].currentNode = 36;
									e.position.y = -5.2;
								}
								else if(e.position.y <-5.3){
									ghosts[3].oldNode = ghosts[3].previousNode;
									ghosts[3].previousNode = 41;
									ghosts[3].currentNode = 11;
									e.position.y = 3.2;
								}
							
								//P1 Collision
								if((Math.abs(e.position.y-P1.position.y)<ghostRadiusY && Math.abs(e.position.x-P1.position.x)<ghostRadiusX) && collisionON){
									//console.log("Clyde Hit!!");
									Collision(P1,e);
								}
								//P2 Collision
								if((Math.abs(e.position.y-P2.position.y)<ghostRadiusY && Math.abs(e.position.x-P2.position.x)<ghostRadiusX) && collisionON){
									//console.log("Pinky Hit!!");
									Collision(P2,e);
								}
								//P3 Collision
								if((Math.abs(e.position.y-P3.position.y)<ghostRadiusY && Math.abs(e.position.x-P3.position.x)<ghostRadiusX) && collisionON){
									//console.log("Pinky Hit!!");
									Collision(P3,e);
								}
								//P4 Collision
								if((Math.abs(e.position.y-P4.position.y)<ghostRadiusY && Math.abs(e.position.x-P4.position.x)<ghostRadiusX) && collisionON){
									//console.log("Blinky Hit!!");
									Collision(P4,e);
								}
							}
							//Courage Actions
							else if (e == Courage && GameStatus == "Start"){
								//dOWN
								if(ghosts[4].Delay < step && cry == false && ghosts[4].direction==1){
										if(ghosts[4].Model == 0){
												e.material = CourageD1;
												ghosts[4].Model = 1;
												ghosts[4].Delay = step + 1;
											}
											else{
												e.material = CourageD2;
												ghosts[4].Model = 0;
												ghosts[4].Delay = step + 1;
											}
									}
								if(ghosts[4].Delay < step && cry == true && ghosts[4].direction==1){
										if(ghosts[4].Model == 0){
												e.material = Courage_D1;
												ghosts[4].Model = 1;
												ghosts[4].Delay = step + 1;
											}
											else{
												e.material = Courage_D2;
												ghosts[4].Model = 0;
												ghosts[4].Delay = step + 1;
											}
									}
								//uP
								if(ghosts[4].Delay < step && cry == false && ghosts[4].direction==0){
										if(ghosts[4].Model == 0){
												e.material = CourageU1;
												ghosts[4].Model = 1;
												ghosts[4].Delay = step + 1;
											}
											else{
												e.material = CourageU2;
												ghosts[4].Model = 0;
												ghosts[4].Delay = step + 1;
											}
									}
								if(ghosts[4].Delay < step && cry == true && ghosts[4].direction==0){
										if(ghosts[4].Model == 0){
												e.material = Courage_U1;
												ghosts[4].Model = 1;
												ghosts[4].Delay = step + 1;
											}
											else{
												e.material = Courage_U2;
												ghosts[4].Model = 0;
												ghosts[4].Delay = step + 1;
											}
									}
								//lEFT
								if(ghosts[4].Delay < step && cry == false && ghosts[4].direction==2){
										if(ghosts[4].Model == 0){
												e.material = CourageL1;
												ghosts[4].Model = 1;
												ghosts[4].Delay = step + 1;
											}
											else{
												e.material = CourageL2;
												ghosts[4].Model = 0;
												ghosts[4].Delay = step + 1;
											}
									}
								if(ghosts[4].Delay < step && cry == true && ghosts[4].direction==2){
										if(ghosts[4].Model == 0){
												e.material = Courage_L1;
												ghosts[4].Model = 1;
												ghosts[4].Delay = step + 1;
											}
											else{
												e.material = Courage_L2;
												ghosts[4].Model = 0;
												ghosts[4].Delay = step + 1;
											}
									}
								//Right
								if(ghosts[4].Delay < step && cry == false && ghosts[4].direction==3){
										if(ghosts[4].Model == 0){
												e.material = CourageR1;
												ghosts[4].Model = 1;
												ghosts[4].Delay = step + 1;
											}
											else{
												e.material = CourageR2;
												ghosts[4].Model = 0;
												ghosts[4].Delay = step + 1;
											}
									}
								if(ghosts[4].Delay < step && cry == true && ghosts[4].direction==3){
										if(ghosts[4].Model == 0){
												e.material = Courage_R1;
												ghosts[4].Model = 1;
												ghosts[4].Delay = step + 1;
											}
											else{
												e.material = Courage_R2;
												ghosts[4].Model = 0;
												ghosts[4].Delay = step + 1;
											}
									}
							}
							
							//Pac-mans
							//Player 1-4 Pacmans
							else if ((e == P1||e == P2||e == P3 ||e == P4) && !stop && GameStatus == "Start"){	
									var PacNumber = 0; //P1
									if(P2 != null && e == P2) PacNumber = 1; //P2
									if(P3 != null && e == P3) PacNumber = 2; //P3
									if(P4 != null && e == P4) PacNumber = 3; //P3
								
								if ((e.position.y - nodes[pacs[PacNumber].currentNode].y) > 0 ){ // South
									if(Math.abs(e.position.y - nodes[pacs[PacNumber].currentNode].y) > (0.05 * pacs[PacNumber].Speed))
										e.position.y -= 0.06 * pacs[PacNumber].Speed;
									else e.position.y = nodes[pacs[PacNumber].currentNode].y
									e.position.y = Math.round(e.position.y*100)/100;	
									
									if(pacs[PacNumber].Delay < step){
										if(ghosts[PacNumber].Model == 0){
												if(PacNumber == 0) e.material = P1D1;
												else if(PacNumber == 1){
													e.material = P2U1;
													e.material.rotation=Math.PI;
												}
												else if(PacNumber == 2){
													e.material = P3U1;
													e.material.rotation=Math.PI;
												}
												else if(PacNumber == 3){
													e.material = P4U1;
													e.material.rotation=Math.PI;
												}
												pacs[PacNumber].Model = 1;
												pacs[PacNumber].Delay = step + 1;
											}
										else{
												if(PacNumber == 0) e.material = P1D2;
												else if(PacNumber == 1){
													e.material = P2U2;
													e.material.rotation=Math.PI;
												}
												else if(PacNumber == 2){
													e.material = P3U2;
													e.material.rotation=Math.PI;
												}
												else if(PacNumber == 3){
													e.material = P4U2;
													e.material.rotation=Math.PI;
												} 
												pacs[PacNumber].Model = 0;
												pacs[PacNumber].Delay = step + 1;
											}
									}
								}
								else if ((e.position.y - nodes[pacs[PacNumber].currentNode].y) < 0 ){ // North
									if(Math.abs(e.position.y - nodes[pacs[PacNumber].currentNode].y) > (0.05 * pacs[PacNumber].Speed))
										e.position.y +=0.06 * pacs[PacNumber].Speed;
									else e.position.y = nodes[pacs[PacNumber].currentNode].y
									e.position.y = Math.round(e.position.y*100)/100;
									
									if(pacs[PacNumber].Delay < step){
										if(pacs[PacNumber].Model == 0){
												if(PacNumber == 0) e.material = P1U1;
												else if(PacNumber == 1){
													e.material = P2U1;
													e.material.rotation=0;
												}
												else if(PacNumber == 2){
													e.material = P3U1;
													e.material.rotation=0;
												}
												else if(PacNumber == 3){
													e.material = P4U1;
													e.material.rotation=0;
												} 
												pacs[PacNumber].Model = 1;
												pacs[PacNumber].Delay = step + 1;
											}
										else{
												if(PacNumber == 0) e.material = P1U2;
												else if(PacNumber == 1){
													e.material = P2U2;
													e.material.rotation=0;
												} 
												else if(PacNumber == 2){
													e.material = P3U2;
													e.material.rotation=0;
												}
												else if(PacNumber == 3){
													e.material = P4U2;
													e.material.rotation=0;
												} 
												pacs[PacNumber].Model = 0;
												pacs[PacNumber].Delay = step + 1;
											}
									}
								}
								else if ((e.position.x - nodes[pacs[PacNumber].currentNode].x) > 0 ){ // 
									if(Math.abs(e.position.x - nodes[pacs[PacNumber].currentNode].x) > (0.05 * pacs[PacNumber].Speed))
										e.position.x -=0.06 * pacs[PacNumber].Speed;
									else e.position.x = nodes[pacs[PacNumber].currentNode].x
									e.position.x = Math.round(e.position.x*100)/100;	
									
									if(pacs[PacNumber].Delay < step){
										if(pacs[PacNumber].Model == 0){
												if(PacNumber == 0) e.material = P1L1;
												else if(PacNumber == 1){
													e.material = P2R1;
													e.material.rotation=Math.PI;
												}
												else if(PacNumber == 2){
													e.material = P3R1;
													e.material.rotation=Math.PI;
												}
												pacs[PacNumber].Model = 1;
												pacs[PacNumber].Delay = step + 1;
											}
										else{
												if(PacNumber==0) e.material = P1L2;
												else if(PacNumber == 1){
													e.material = P2R2;
													e.material.rotation=Math.PI;
												}
												else if(PacNumber == 2){
													e.material = P3R2;
													e.material.rotation=Math.PI;
												} 
												pacs[PacNumber].Model = 0;
												pacs[PacNumber].Delay = step + 1;
											}
									}
									
								}
								else if ((e.position.x - nodes[pacs[PacNumber].currentNode].x) < 0 ){
									if(Math.abs(e.position.x - nodes[pacs[PacNumber].currentNode].x) > (0.05 * pacs[PacNumber].Speed))
										e.position.x +=0.06 * pacs[PacNumber].Speed;
									else e.position.x = nodes[pacs[PacNumber].currentNode].x		
									e.position.x = Math.round(e.position.x*100)/100;	
									
									if(pacs[PacNumber].Delay < step){
										if(pacs[PacNumber].Model == 0){
												if(PacNumber==0)e.material = P1R1;
												else if(PacNumber == 1){
													e.material = P2R1;
													e.material.rotation=0;
												}
												else if(PacNumber == 2){
													e.material = P3R1;
													e.material.rotation=0;
												}
												
												pacs[PacNumber].Model = 1;
												pacs[PacNumber].Delay = step + 1;
												
											}
										else{
												if(PacNumber==0)e.material = P1R2;
												else if(PacNumber == 1){
													e.material = P2R2;
													e.material.rotation=0;
												}
												else if(PacNumber == 2){
													e.material = P3R2;
													e.material.rotation=0;
												}
												pacs[PacNumber].Model = 0;
												pacs[PacNumber].Delay = step + 1;
											}
									}
								}
								else{
									var sendData;
										//Pac.emit('Pac 1 Arrived', sendData={Player:player,status:"Arrived@"+pacs[0].currentNode});
										Pac.emit('Pac '+(PacNumber+1)+' Arrived', sendData={Player:player,status:"Arrived@"+pacs[PacNumber].currentNode});
									//Pac.emit('Pac 1 Drunk Arrived', sendData={Player:player,status:"Arrived@"+pacs[0].currentNode});
									//console.log("P1 Arrived Curr: "+pacs[0].currentNode);
								}
								
								//Passes 11 heading to node 40 but before it reaches 40 we port it to 36
								if(e.position.y >3.35){
									//console.log("P1 Curr was "+pacs[0].currentNode+" but now it's node 36");
									pacs[PacNumber].oldNode = pacs[PacNumber].previousNode;
									pacs[PacNumber].previousNode = 40;
									pacs[PacNumber].currentNode = 36;
									e.position.y = -5.2;
									//wait += 0.2;
								}
								//Passes 36 heading to node 41 but before it reaches 41 we port it to 11
								else if(e.position.y <-5.35){
									//console.log("P1 Curr was "+pacs[0].currentNode+" but now it's node 11");
									pacs[PacNumber].oldNode = pacs[PacNumber].previousNode;
									pacs[PacNumber].previousNode = 41;
									pacs[PacNumber].currentNode = 11;
									e.position.y = 3.2;
									//wait += 0.2;
								}
								
								//Checks for Pellets
								for(var p = 0; p < PelletsList.length; p++)
									if(PelletsList[p] != null && (Math.abs(e.position.y-PelletsList[p].y)<0.5 && Math.abs(e.position.x-PelletsList[p].x)<1)){
										//console.log(p+". "+PelletsList[p].name);
										//console.log(PelletsList[p]);
										if(PelletsList[p].name != "Super"){
											//P1Score+=10;
											//text = "Player 1: "+P1Score;
											//P1Texture.clear('Black').drawText(text, 12, 306, 'Red');
											//P1Mesh.material. map= P1Texture.texture;
											var data = {
												Player: (player-1),
												score: 10
											}
											
											if(PacNumber == (player-1))
												Pac.emit('Update Scores',data);
										}
										
										else{
											e.scale.set(1.75,1.25,0);
											pacs[PacNumber].Speed = 1.25;
											pacs[PacNumber].sizeCD = 120;
											pacs[PacNumber].speedCD = 120;
											pacs[PacNumber].sizeB = true;
											pacs[PacNumber].speedB = true;
											console.log(pacs[P1.material.name].Status);
											pacs[P1.material.name].Status = "Super";
											console.log(pacs[P1.material.name].Status);
											//Pac.emit('Update Scores',data);
										}
										scene.remove(PelletsList[p].Pellet);
										PelletsList.splice(p,1);									
										if(PelletsList.length == 0) Pac.emit('Pellets');
										
									}
								
								//Effects and Boosts Timers/CountDown
								//Size
								if(pacs[PacNumber].sizeB == true && pacs[PacNumber].sizeCD > 0){
									pacs[PacNumber].sizeCD -= 0.1;
									//console.log("size: "+pacs[0].sizeCD+"/100")
								} 
								else if(pacs[PacNumber].sizeB == true) {
									e.scale.set(1.25,.75,0);
									pacs[PacNumber].sizeB = false;
									console.log("size returns to normal")
									pacs[P1.material.name].Status = "Normal";
								}
								//Speed
								if(pacs[PacNumber].speedB == true && pacs[PacNumber].speedCD > 0){
									pacs[PacNumber].speedCD -= 0.1;
									//console.log("speed: "+pacs[0].speedCD+"/100")
								} 
								else if(pacs[PacNumber].speedB == true){
									pacs[PacNumber].Speed = 1;
									pacs[PacNumber].speedB = false;
									console.log("speed returns to normal")
									pacs[P1.material.name].Status = "Normal";
								} 
							}
						}
						//Going from SplashScreen to StartScreen	
						//GameStatus = "StartScreen";
						else if(GameStatus == "Splash_Screen_Transition"){
							if(e == Title && e.position.y < 4.25)
								e.position.y += 0.25;
							
							//Just so that it will wait until the Title fully moves up to activate the start screen
							if(e == Title && e.position.y >= 4.25)
								GameStatus = "StartScreen";
						}
						//StartScreen
						else if(GameStatus == "StartScreen"){
							//Title Positioning
							if(e == Title && e.position.y < 4.25)
								e.position.y += 0.25;
							//Start Game Positioning
							if(e == StartGameMesh && e.position.y > 0.25)
								e.position.y -= 0.1;
							//About Positioning
							if(e == AboutMesh && e.position.y > -4.5)
								e.position.y -= 0.1;
							if(e == AboutMesh && e.position.x > -5)
								e.position.x -= 0.1;
							if(e == AboutMesh && e.position.y < -4.5)
								e.position.y += 0.1;
							
							//Credits Positioning
							if(e == CreditsMesh && e.position.y > -4.5)
								e.position.y -= 0.1;
							if(e == CreditsMesh && e.position.x < 5)
								e.position.x += 0.1;
							if(e == CreditsMesh && e.position.y < -4.5)
								e.position.y += 0.1;
						}
						//For the About Section
						else if(GameStatus == "About"){
							if(e == AboutMesh){
								if(e.position.y<3) e.position.y+=0.1;
								if(e.position.x<0) e.position.x+=0.1;
							}
							else if(e == StartGameMesh && e.position.y<8){
								e.position.y+=0.1;
							}
							else if(e == CreditsMesh && e.position.y>-8){
								e.position.y-=0.1;
							}
							else if(e == groupMesh && e.position.y<7.5){
								//e.position.y+=0.1;
								//console.log("Y: "+groupMesh.position.y);
								e.position.y+=0.1;
							}
							else if(e == closeMesh && e.position.y<-5.5){
								e.position.y+=0.1;
							}
						}
						//For the About Section
						else if(GameStatus == "Credits"){
							if(e == CreditsMesh){
								if(e.position.y<3) e.position.y+=0.1;
								if(e.position.x>0) e.position.x-=0.1;
							}
							else if(e == StartGameMesh && e.position.y<8)
								e.position.y+=0.1;
							else if(e == AboutMesh && e.position.y>-8)
								e.position.y-=0.1;
							else if(e == closeMesh && e.position.y<-5.5)
								e.position.y+=0.1;
							
						}
						else if((GameStatus == "StartScreen" || GameStatus == "SplashScreen") && (e == startGhost1 || e == startGhost2 || e == startGhost3
								|| e == startGhost4 || e == startGhost5 || e == startGhost6 ||e == startGhost7|| e == startGhost8)){
									if(e.position.x<11 && e.position.y > 0){
										e.position.x+=0.08;
										if(e.position.x > 11 && GameStatus == "SplashScreen") e.position.x = -10;
										else if(e.position.x > 11) scene.remove(e);
									}
									else if(e.position.x > -11 && e.position.y < 0){
										e.position.x-=0.04;
										if(e.position.x < -11 && GameStatus == "SplashScreen") e.position.x = 10;
										else if(e.position.x < -11) scene.remove(e);
									}
									
									if((e == startGhost1) || (e == startGhost5)){
										if(ghosts[0].Delay < step){
											if(ghosts[0].Model == 0 && e.position.y > 0){
												e.material = BlinkyR1;
												ghosts[0].Model = 1;
												ghosts[0].Delay = step + 1;
											}
											else if(e.position.y > 0){
												e.material = BlinkyR2;
												ghosts[0].Model = 0;
												ghosts[0].Delay = step + 1;
											}
											else if(ghosts[0].Model == 0 && e.position.y < 0){
												e.material = BlinkyL1;
												ghosts[0].Model = 1;
												ghosts[0].Delay = step + 1;
											}
											else if(e.position.y < 0){
												e.material = BlinkyL2;
												ghosts[0].Model = 0;
												ghosts[0].Delay = step + 1;
											}
										}			
									}
									else if( e == startGhost2 || e == startGhost6){
										if(ghosts[1].Delay < step){
											if(ghosts[1].Model == 0 && e.position.y > 0){
												e.material = PinkyR1;
												ghosts[1].Model = 1;
												ghosts[1].Delay = step + 1;
											}
											else if(e.position.y > 0){
												e.material = PinkyR2;
												ghosts[1].Model = 0;
												ghosts[1].Delay = step + 1;
											}
											else if(ghosts[1].Model == 0 && e.position.y < 0){
												e.material = PinkyL1;
												ghosts[1].Model = 1;
												ghosts[1].Delay = step + 1;
											}
											else if(e.position.y < 0){
												e.material = PinkyL2;
												ghosts[1].Model = 0;
												ghosts[1].Delay = step + 1;
											}
										}			
									}
									else if( e == startGhost3){
										if(ghosts[2].Delay < step){
											if(ghosts[2].Model == 0 && e.position.y > 0){
												e.material = InkyR1;
												ghosts[2].Model = 1;
												ghosts[1].Delay = step + 1;
											}
											else if(e.position.y > 0){
												e.material = InkyR2;
												ghosts[2].Model = 0;
												ghosts[2].Delay = step + 1;
											}
											else if(ghosts[2].Model == 0 && e.position.y < 0){
												e.material = InkyL1;
												ghosts[2].Model = 1;
												ghosts[2].Delay = step + 1;
											}
											else if(e.position.y < 0){
												e.material = InkyL2;
												ghosts[2].Model = 0;
												ghosts[2].Delay = step + 1;
											}
										}			
									}
								}
						else if( e == groupMesh || e== closeMesh)
							scene.remove(e);
					});
					
			}catch(e){
				//functionToHandleError(e);		
				//He HE HE don't say a word if errors happen					
			}
		}
		
		//Loading Nodes
		function load_Nodes(){
			// Node Data includes, x and y positioning,
			//NODE 0
			var connection = [1,6];
			var node = {x:-8, y:3, Connectednodes:connection,
						North:-1, East:1,South:6,West:-1};
			nodes.push(node);
			//NODE 1
			var connection = [0,2,4];
			var node = {x:-5, y:3, Connectednodes:connection,
						North:-1, East:2,South:4,West:0};
			nodes.push(node);
			//NODE 2
			var connection = [1,5];
			var node = {x:-2, y:3, Connectednodes:connection,
						North:-1, East:-1,South:5,West:1};
			nodes.push(node);
			//NODE 3
			var connection = [4,7];
			var node = {x:-6, y:1, Connectednodes:connection,
						North:-1, East:4,South:7,West:-1};
			nodes.push(node);
			//NODE 4
			var connection = [1,3,5];
			var node = {x:-5, y:1, Connectednodes:connection,
						North:1, East:5,South:-1,West:3};
			nodes.push(node);
			//NODE 5
			var connection = [2,4,11,21];
			var node = {x:-2, y:1, Connectednodes:connection,
						North:2, East:11,South:21,West:4};
			nodes.push(node);
			//NODE 6
			var connection = [0,7,22];
			var node = {x:-8, y:0, Connectednodes:connection,
						North:0, East:7,South:22,West:-1};
			nodes.push(node);
			//NODE 7
			var connection = [3,6,18];
			var node = {x:-6, y:0, Connectednodes:connection,
						North:3, East:-1,South:18,West:6};
			nodes.push(node);
			//NODE 8
			var connection = [9,12];
			var node = {x:2, y:3, Connectednodes:connection,
						North:-1, East:9,South:12,West:-1};
			nodes.push(node);
			//NODE 9
			var connection = [8,10,14];
			var node = {x:6, y:3, Connectednodes:connection,
						North:-1, East:10,South:14,West:8};
			nodes.push(node);
			//NODE 10
			var connection = [9,15];
			var node = {x:8, y:3, Connectednodes:connection,
						North:-1, East:-1,South:15,West:9};
			nodes.push(node);
			//NODE 11--left off here!!! it needs the Upward node
			var connection = [5,12,40];
			var node = {x:0, y:1, Connectednodes:connection,
						North:40, East:12,South:-1,West:5};
			nodes.push(node);
			//NODE 12
			var connection = [8,11,16];
			var node = {x:2, y:1, Connectednodes:connection,
						North:8, East:-1,South:16,West:11};
			nodes.push(node);
			//NODE 13
			var connection = [14,17];
			var node = {x:5, y:1, Connectednodes:connection,
						North:-1, East:14,South:17,West:-1};
			nodes.push(node);
			//NODE 14
			var connection = [9,13,15];
			var node = {x:6, y:1, Connectednodes:connection,
						North:9, East:15,South:-1,West:13};
			nodes.push(node);
			//NODE 15
			var connection = [10,14,29];
			var node = {x:8, y:1, Connectednodes:connection,
						North:10, East:-1,South:29,West:14};
			nodes.push(node);
			//NODE 16
			var connection = [12,17,31];
			var node = {x:2, y:0, Connectednodes:connection,
						North:12, East:17,South:31,West:-1};
			nodes.push(node);
			//NODE 17
			var connection = [13,16];
			var node = {x:5, y:0, Connectednodes:connection,
						North:13, East:-1,South:-1,West:16};
			nodes.push(node);
			//NODE 18
			var connection = [7,19];
			var node = {x:-6, y:-1, Connectednodes:connection,
						North:7, East:19,South:-1,West:-1};
			nodes.push(node);
			//NODE 19
			var connection = [18,23];
			var node = {x:-5, y:-1, Connectednodes:connection,
						North:-1, East:-1,South:23,West:18};
			nodes.push(node);
			//NODE 20
			var connection = [21,24];
			var node = {x:-3, y:-2, Connectednodes:connection,
						North:-1, East:21,South:24,West:-1};
			nodes.push(node);
			//NODE 21
			var connection = [5,20,30];
			var node = {x:-2, y:-2, Connectednodes:connection,
						North:5, East:30,South:-1,West:20};
			nodes.push(node);
			//NODE 22
			var connection = [6,23,25];
			var node = {x:-8, y:-3, Connectednodes:connection,
						North:6, East:23,South:25,West:-1};
			nodes.push(node);
			//NODE 23
			var connection = [19,22,24,26];
			var node = {x:-5, y:-3, Connectednodes:connection,
						North:19, East:24,South:26,West:22};
			nodes.push(node);
			//NODE 24
			var connection = [20,23,27];
			var node = {x:-3, y:-3, Connectednodes:connection,
						North:20, East:-1,South:27,West:23};
			nodes.push(node);
			//NODE 25
			var connection = [22,26];
			var node = {x:-8, y:-5, Connectednodes:connection,
						North:22, East:26,South:-1,West:-1};
			nodes.push(node);
			//NODE 26
			var connection = [23,25,27];
			var node = {x:-5, y:-5, Connectednodes:connection,
						North:23, East:27,South:-1,West:25};
			nodes.push(node);
			//NODE 27
			var connection = [24,26,36];
			var node = {x:-3, y:-5, Connectednodes:connection,
						North:24, East:36,South:-1,West:26};
			nodes.push(node);
			//NODE 28
			var connection = [29,34];
			var node = {x:6, y:-1, Connectednodes:connection,
						North:-1, East:29,South:34,West:-1};
			nodes.push(node);
			//NODE 29
			var connection = [15,28,35];
			var node = {x:8, y:-1, Connectednodes:connection,
						North:15, East:-1,South:35,West:28};
			nodes.push(node);
			//NODE 30
			var connection = [21,31,36];
			var node = {x:0, y:-2, Connectednodes:connection,
						North:-1, East:31,South:36,West:21};
			nodes.push(node);
			//NODE 31
			var connection = [16,30,32];
			var node = {x:2, y:-2, Connectednodes:connection,
						North:16, East:-1,South:32,West:30};
			nodes.push(node);
			//NODE 32
			var connection = [31,33];
			var node = {x:2, y:-3, Connectednodes:connection,
						North:31, East:33,South:-1,West:-1};
			nodes.push(node);
			//NODE 33
			var connection = [32,34,37];
			var node = {x:3, y:-3, Connectednodes:connection,
						North:-1, East:34,South:37,West:32};
			nodes.push(node);
			//NODE 34
			var connection = [28,33,35,38];
			var node = {x:6, y:-3, Connectednodes:connection,
						North:28, East:35,South:38,West:33};
			nodes.push(node);
			//NODE 35
			var connection = [29,34,39];
			var node = {x:8, y:-3, Connectednodes:connection,
						North:29, East:-1,South:39,West:34};
			nodes.push(node);
			//NODE 36
			var connection = [27,30,37,41];
			var node = {x:0, y:-5, Connectednodes:connection,
						North:30, East:37,South:41,West:27};
			nodes.push(node);
			//NODE 37
			var connection = [36,33];
			var node = {x:3, y:-5, Connectednodes:connection,
						North:33, East:-1,South:-1,West:36};
			nodes.push(node);
			//NODE 38
			var connection = [34,39];
			var node = {x:6, y:-5, Connectednodes:connection,
						North:34, East:39,South:-1,West:-1};
			nodes.push(node);
			//NODE 39
			var connection = [38,35];
			var node = {x:8, y:-5, Connectednodes:connection,
						North:35, East:-1,South:-1,West:38};
			nodes.push(node);
			//NODE 40// This node is meant for the Ghost to be lead upward
			//var connection = [11,42]; to much to remove..gonna just leave it
			var connection = [36];
			var node = {x:0, y:5, Connectednodes:connection,
						North:41, East:-1,South:11,West:-1};
			nodes.push(node);
			//NODE 41// This node is meant for the Ghost to be lead downward
			//var connection = [11]; No connections cause it's for moving
			var connection = [11];
			var node = {x:0, y:-7.5, Connectednodes:connection,
						North:36, East:-1,South:40,West:-1};
			nodes.push(node);
		}
		
		//RadomDirections
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
		
		//Loading Level 1
		function loading_Level_1(){
			//GameStatus = "Start";
			//console.log(GameStatus);
			//BoxGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)
			//width — Width of the sides on the X axis. Default is 1.
			//height — Height of the sides on the Y axis. Default is 1.
			//depth — Depth of the sides on the Z axis. Default is 1.
			//widthSegments — Optional. Number of segmented faces along the width of the sides. Default is 1.
			//heightSegments — Optional. Number of segmented faces along the height of the sides. Default is 1.
			//depthSegments — Optional. Number of segmented faces along the depth of the sides. Default is 1.
			
			MyScore = 0;
			//Never Change
			var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
			//Outer Walls
			//Left Wall
			var geometry = new THREE.BoxGeometry( 0.5, 9.5, 0 );
			var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-9, -1, 35);
			scene.add( cube );
			Level.push(cube);			
			//Right Wall
			var geometry = new THREE.BoxGeometry( 0.5, 9.5, 0 );
			var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
			var cube = new THREE.Mesh( geometry, material );
			cube.position.set(9, -1, 35);
			scene.add( cube );
			Level.push(cube);
			//Top Left Wall
			geometry = new THREE.BoxGeometry( 8, 0.5, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-4.75, 3.75, 35);
			scene.add( cube );
			Level.push(cube);
			//Top Right Wall
			geometry = new THREE.BoxGeometry( 8, 0.5, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(4.75, 3.75, 35);
			scene.add( cube );
			Level.push(cube);
			//Bottom Left Wall
			geometry = new THREE.BoxGeometry( 8, 0.5, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-4.75, -5.75, 35);
			scene.add( cube );
			Level.push(cube);
			//Bottom Right Wall
			geometry = new THREE.BoxGeometry( 8, 0.5, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(4.75, -5.75, 35);
			scene.add( cube );
			Level.push(cube);
			//Blocks for the game
			//B1
			geometry = new THREE.BoxGeometry( 0.5, 2, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-7, 1.5, 35);
			scene.add( cube );
			Level.push(cube);
			//B2
			geometry = new THREE.BoxGeometry( 1.5, 1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-6.5, 2, 35);
			scene.add( cube );
			Level.push(cube);
			//B3
			geometry = new THREE.BoxGeometry( 0.5, 2, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-1, 2.5, 35);
			scene.add( cube );
			Level.push(cube);
			//B4
			geometry = new THREE.BoxGeometry( 1.5, 1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-3.5, 2, 35);
			scene.add( cube );
			Level.push(cube);
			//B5
			geometry = new THREE.BoxGeometry( 2.5, 1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-4, 0, 35);
			scene.add( cube );		
			Level.push(cube);			
			//B6
			geometry = new THREE.BoxGeometry( 0.5, 2, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(1, 2.5, 35);
			scene.add( cube );
			Level.push(cube);
			//B7
			geometry = new THREE.BoxGeometry( 2.5, 1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(4, 2, 35);
			scene.add( cube );
			Level.push(cube);
			//B8
			geometry = new THREE.BoxGeometry( .5, 1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(7, 2, 35);
			scene.add( cube );
			Level.push(cube);
			//B9
			geometry = new THREE.BoxGeometry( 1.5, 1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(3.5, 1, 35);
			scene.add( cube );
			Level.push(cube);
			//B10
			geometry = new THREE.BoxGeometry( 1.5, 1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(6.5, 0, 35);
			scene.add( cube );
			Level.push(cube);
			//B11
			geometry = new THREE.BoxGeometry( 0.5, 2, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-7, -1.5, 35);
			scene.add( cube );
			Level.push(cube);
			//B12
			geometry = new THREE.BoxGeometry( 1.5, 1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-6.5, -2, 35);
			scene.add( cube );
			Level.push(cube);
			//B13
			geometry = new THREE.BoxGeometry( 0.5, 2, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-4, -1.5, 35);
			scene.add( cube );
			Level.push(cube);
			//B14
			geometry = new THREE.BoxGeometry( 1.5, 1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-3.5, -1, 35);
			scene.add( cube );
			Level.push(cube);
			//B15
			geometry = new THREE.BoxGeometry( 1.5, 2, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-1.5, -3.5, 35);
			scene.add( cube );
			Level.push(cube);
			//B16
			geometry = new THREE.BoxGeometry( .5, 1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-4, -4, 35);
			scene.add( cube );
			Level.push(cube);			
			//B17
			geometry = new THREE.BoxGeometry( 1.5, 1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(-6.5, -4, 35);
			scene.add( cube );
			Level.push(cube);
			//B18
			geometry = new THREE.BoxGeometry( 2.5, 2, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(4, -1.5, 35);
			scene.add( cube );
			Level.push(cube);
			//B19
			geometry = new THREE.BoxGeometry( .5, 1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(7, -2, 35);
			scene.add( cube );
			Level.push(cube);
			//B20
			geometry = new THREE.BoxGeometry( 0.5, 2, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(1, -3.5, 35);
			scene.add( cube );
			Level.push(cube);
			//B21
			geometry = new THREE.BoxGeometry( 1.5, 1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(1.5, -4, 35);
			scene.add( cube );
			Level.push(cube);
			//B22
			geometry = new THREE.BoxGeometry( 1.5, 2, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(4.5, -4.5, 35);
			scene.add( cube );		
			Level.push(cube);
			//B23
			geometry = new THREE.BoxGeometry( .5, 1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(7, -4, 35);
			scene.add( cube );
			Level.push(cube);
			//B24
			geometry = new THREE.BoxGeometry( 4.77, 0.1, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(5.3, -0.5, 34);
			scene.add( cube );		
			Level.push(cube);
			
			//Ghost Yard
			//Outer Court
			var material = new THREE.MeshBasicMaterial( {color: 0x456099} );
			geometry = new THREE.BoxGeometry( 2.75, 2.25, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(0, -0.5, 34);
			scene.add( cube );
			Level.push(cube);
			//Inner Court
			var material = new THREE.MeshBasicMaterial( {color: 0x556B2F} );
			geometry = new THREE.BoxGeometry( 2.5, 2, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(0, -0.5, 34);
			scene.add( cube );
			Level.push(cube);
			//Court Door
			var material = new THREE.MeshBasicMaterial( {color: 0x556B2F} );
			geometry = new THREE.BoxGeometry( 1.5, 0.5, 0 );
			cube = new THREE.Mesh( geometry, material );
			cube.position.set(0, 0.4, 34);
			scene.add( cube );
			Level.push(cube);
		}
		
		//Loads the Fruits Sprites Sheet
		function load_Fruits(){
			//Loader for Sprites
			var loader = new THREE.TextureLoader();
			loader.crossOrigin = true;
			
			/*List of Fruits
				Fruit 0 - Apple
				Fruit 1 - Banana
				Fruit 2 - Cherry
				Fruit 3 - Orange
				Fruit 4 - Pear
				Fruit 5 - Pretzel
				Fruit 6 - Strawberry
				Fruit 7 - Grape
			*/
			
			//Apple-0
			var Texture00 = loader.load( 'Images/Fruits/Apple.png' );
			Texture00.minFilter = THREE.LinearFilter;
			Apple = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
			Fruits.push(Apple);
			//Banana-1
			Texture00 = loader.load( 'Images/Fruits/Banana.png' );
			Texture00.minFilter = THREE.LinearFilter;
			Banana = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
			Fruits.push(Banana);
			//Cherry-2
			Texture00 = loader.load( 'Images/Fruits/Cherry.png' );
			Texture00.minFilter = THREE.LinearFilter;
			Cherry = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
			Fruits.push(Cherry);
			//Orange-3
			Texture00 = loader.load( 'Images/Fruits/Orange.png' );
			Texture00.minFilter = THREE.LinearFilter;
			Orange = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
			Fruits.push(Orange);
			//Pear-4
			Texture00 = loader.load( 'Images/Fruits/Pear.png' );
			Texture00.minFilter = THREE.LinearFilter;
			Pear = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
			Fruits.push(Pear);
			//Pretzel-5
			Texture00 = loader.load( 'Images/Fruits/Pretzel.png' );
			Texture00.minFilter = THREE.LinearFilter;
			Pretzel = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
			Fruits.push(Pretzel);
			//Strawberry-6
			Texture00 = loader.load( 'Images/Fruits/Strawberry.png' );
			Texture00.minFilter = THREE.LinearFilter;
			Strawberry = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
			Fruits.push(Strawberry);		
			//Grapes lol I made this one!!! :D-7
			Texture00 = loader.load( 'Images/Fruits/Grapes.png' );
			Texture00.minFilter = THREE.LinearFilter;
			Grapes = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
			Fruits.push(Grapes);	
			
			
			Fruit =  new THREE.Sprite();
			//Fruit.scale.set(0.8,0.8,1);	
			//scene.add(Fruit);
			//Fruit.position.set(-8.25,-5.25,34);
			
			////Pellets lol I made this one too!!! :D
			//Texture00 = loader.load( 'Images/Fruits/Pellets.png' );
			//Texture00.minFilter = THREE.LinearFilter;
			//var Pells = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
			//Pellets =  new THREE.Sprite(Pells);	
			//Pellets.scale.set(1,0.75,1);	
			//scene.add(Pellets);
		}
		
		//Insert Pellets
		function insertPellets(startNode, endNode,superPelletBoolean){
			//Pellets - Vertical Insertion
			//There should be a gap of a 0.5
			
			//Pellets - Horizontal Insertion
			//There should be a gap of a 1.0
			
			// Lesser number is always the first Node
			// Greater number is always the second Node
			
			if(startNode > endNode){
				var temp = startNode;
				startNode = endNode;
				endNode =  temp;					
			}
			
			if(Math.abs(nodes[startNode].x - nodes[endNode].x)!=0){
				//Horizontal Pellets Insertion
				for(var p = 0; (nodes[startNode].x + p) <= nodes[endNode].x; p++){
					var superP ="pellet";
					/**
					if(p==0 && superPelletBoolean == true){
						var obj = superDot();
						superP ="Super";
					}							
					else**/
						var obj = createDot();
					obj.position.set(nodes[startNode].x + p,nodes[startNode].y,35);
					scene.add(obj);
					var pel = {
					Pellet:obj,
					x:nodes[startNode].x + p,
					y:nodes[startNode].y,
					name: superP
				}
				PelletsList.push(pel);
				}
				//console.log("Pellets from  Start Node: "+startNode+"   End Node: "+endNode);
			}
			else if(Math.abs(nodes[startNode].y - nodes[endNode].y)!=0){
				//Vertical Pellet Insertion
				for(var p = 0; (nodes[startNode].y - p*0.5) >= nodes[endNode].y; p++){
					var superP ="pellet";
					/**
					if(p==0 && superPelletBoolean == true){
						var obj = superDot();
						superP ="Super";
					}							
					else**/
					var obj = createDot();
					obj.position.set(nodes[startNode].x,nodes[startNode].y - p*0.5,35);
					scene.add(obj);
					var pel = {
					Pellet:obj,
					x:nodes[startNode].x,
					y:nodes[startNode].y - p*0.5,
					name: superP
					}
					PelletsList.push(pel);
				}
				//console.log("Pellets from  Start Node: "+startNode+"   End Node: "+endNode);
			}
			else console.log("ERROR with Pellets   Start: "+startNode+"   End: "+endNode+"   Bool: "+superPelletBoolean);
		}
		
		//Loads the Score at the top
		function load_Score(){
			//2D Text
			
			//Player 1 Score
			P1Score=0;
			text = "Player 1: "+P1Score;
			P1Texture  = new THREEx.DynamicTexture(512,512)
			P1Texture.context.font	= "bolder 37px Verdana";
			P1Texture.clear('Black').drawText(text, 12, 306, 'Red');
			//Adding Texture to the Scene
			DyGeometry = new THREE.PlaneGeometry( 7, 5, 1);
			DyMaterial = new THREE.MeshBasicMaterial({
				map	: P1Texture.texture
			});
			P1Mesh = new THREE.Mesh( DyGeometry, DyMaterial );
			P1Mesh.position.set(-5.9,4.65,35);
			//scene.add( P1Mesh );
			
			//Player 2 Score
			P2Score=0;
			text = "Player 2: "+P2Score;
			P2Texture  = new THREEx.DynamicTexture(512,512)
			P2Texture.context.font	= "bolder 37px Verdana";
			P2Texture.clear('Black').drawText(text, 12, 306, 'DeepSkyBlue');
			//Adding Texture to the Scene
			DyGeometry = new THREE.PlaneGeometry( 7, 5, 1);
			DyMaterial = new THREE.MeshBasicMaterial({
				map	: P2Texture.texture
			});
			P2Mesh = new THREE.Mesh( DyGeometry, DyMaterial );
			P2Mesh.position.set(-1,4.65,35);
			//scene.add( P2Mesh );
			
			//Player 3 Score
			P3Score=0;
			text = "Player 3: "+P3Score;
			P3Texture  = new THREEx.DynamicTexture(512,512)
			P3Texture.context.font	= "bolder 37px Verdana";
			P3Texture.clear('Black').drawText(text, 12, 306, 'Lime');
			//Adding Texture to the Scene
			DyGeometry = new THREE.PlaneGeometry( 7, 5, 1);
			DyMaterial = new THREE.MeshBasicMaterial({
				map	: P3Texture.texture
			});
			P3Mesh = new THREE.Mesh( DyGeometry, DyMaterial );
			P3Mesh.position.set(3.75,4.65,35);
			//scene.add( P3Mesh );
			
			//Player 4 Score
			P4Score=0;
			text = "Player 4: "+P4Score;
			P4Texture  = new THREEx.DynamicTexture(512,512)
			P4Texture.context.font	= "bolder 37px Verdana";
			P4Texture.clear('Black').drawText(text, 12, 306, 'DarkViolet');
			//Adding Texture to the Scene
			DyGeometry = new THREE.PlaneGeometry( 7, 5, 1);
			DyMaterial = new THREE.MeshBasicMaterial({
				map	: P4Texture.texture
			});
			P4Mesh = new THREE.Mesh( DyGeometry, DyMaterial );
			P4Mesh.position.set(8.5,4.65,35);
			//scene.add( P4Mesh );
			
			/**
			text = "Player 1: 1";
			dynamicTexture.clear('Black').drawText(text, 12, 306, 'Red')
			P1Mesh.material. map= dynamicTexture.texture;
			**/
			//Source for 2D Text
			//http://learningthreejs.com/blog/2014/05/02/easy-to-use-dynamic-texture-to-write-text-in-your-3d-object-with-threex-dot-dynamictexture-game-extensions-for-three-dot-js/
			//https://github.com/jeromeetienne/threex.dynamictexture
		}
		
		//Loads the Ghost Sprite Sheets
		function load_GhostSprite(){
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
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/CourageD1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				CourageD1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/CourageD2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				CourageD2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/CourageU1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				CourageU1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/CourageU2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				CourageU2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/CourageL1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				CourageL1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/CourageL2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				CourageL2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/CourageR1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				CourageR1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/CourageR2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				CourageR2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/Courage!D1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Courage_D1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/Courage!D2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Courage_D2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/Courage!U1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Courage_U1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/Courage!U2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Courage_U2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/Courage!L1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Courage_L1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/Courage!L2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Courage_L2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/Courage!R1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Courage_R1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );					
				
				Texture00 = loader.load( 'Images/Ghosts/Courage/Courage!R2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				Courage_R2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				
				Courage =  new THREE.Sprite(CourageD1);	
				
				ghosts= [];					
				//Blinky
				var G1 = {Status: "Chase", Name:"Blinky", Delay:0, direction : 0, Model:0, Node:[], 
							oldNode:-1, previousNode:-1, currentNode:11 , timer:1};
				ghosts.push(G1);
				//Pinky
				var G2 = {Status: "Chase", Name:"Pinky", Delay:0, direction : 0, Model:0, Node:[],
							oldNode:-1, previousNode:-1, currentNode:11 , timer:40};
				ghosts.push(G2);
				//Inky
				var G3 = {Status: "Chase", Name:"Inky", Delay:0, direction : 0, Model:0, Node:[],
							oldNode:-1, previousNode:-1, currentNode:11 , timer:80};
				ghosts.push(G3);
				//Cylde
				var G4 = {Status: "Chase", Name:"Clyde", Delay:0, direction : 0, Model:0, Node:[],
							oldNode:-1, previousNode:-1, currentNode:11 , timer:120};
				ghosts.push(G4);
				//Courage
				var G5 = {Status: "Chase", Name:"Courage", Delay:0, direction : 0, Model:0, Node:[],
							oldNode:-1, previousNode:-1, currentNode:11 , futureNode:5, timer:500};
				ghosts.push(G5);					
		}
		
		//Load the Players Pac-Man Sprite
		function load_Pac(){
			//For this example my PlayerNo is 1 for Player 1
				PlayerNo =0;
			//Sprites			
				//Loader for sprites
				var loader = new THREE.TextureLoader();
				loader.crossOrigin = true;
				
				//Full Player 1 Pac-Man
				var Texture00 = loader.load( 'Images/Pac-Man Sprites/P1/P1_R1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P1R1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P1/P1_R2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P1R2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P1/P1_L1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P1L1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P1/P1_L2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P1L2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P1/P1_U1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P1U1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P1/P1_U2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P1U2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P1/P1_D1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P1D1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P1/P1_D2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P1D2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
				
				P1 =  new THREE.Sprite(P1R1);
				//P1.position.set(-8,-5,35);
				P1.position.set(-8,-8,35);
				P1.scale.set(1.25,.75,0);		
				P1.material.name = 0;
				P1.name = 0;
				if(numberOfPlayers >= 1)scene.add( P1 );
				
				//Full Player 2 Pac-Man
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P2/P2_U1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P2U1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } )
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P2/P2_U2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P2U2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } )
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P2/P2_R1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P2R1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } )
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P2/P2_R2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P2R2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } )
				
				P2 =  new THREE.Sprite(P2U1);
				//P2.position.set(8,-5,35);
				P2.position.set(-8,-8,35);
				P2.scale.set(1.25,.75,0);		
				P2.material.name = 1;
				P2.name = 1;
				if(numberOfPlayers >= 2)scene.add( P2 );
				
				//Full Player 3 Pac-Man
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P3/P3_U1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P3U1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } )
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P3/P3_U2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P3U2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } )
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P3/P3_R1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P3R1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } )
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P3/P3_R2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P3R2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } )
				
				P3 =  new THREE.Sprite(P3U1);
				//P3.position.set(-8,3,35);
				P3.position.set(-8,-8,35);
				P3.scale.set(1.25,.75,0);		
				P3.material.name = 2;
				P3.name = 2;
				if(numberOfPlayers >= 3)scene.add( P3 );
				
				//Full Player 4 Pac-Man
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P4/P4_U1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P4U1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } )
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P4/P4_U2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P4U2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } )
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P4/P4_R1.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P4R1 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } )
				Texture00 = loader.load( 'Images/Pac-Man Sprites/P4/P4_R2.png' );
				Texture00.minFilter = THREE.LinearFilter;
				P4R2 =  new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } )
				
				P4 =  new THREE.Sprite(P4U1);
				P4.position.set(-8,-8,35);
				P4.scale.set(1.25,.75,0);		
				P4.material.name = 3;
				P4.name = 3;
				if(numberOfPlayers >= 4)scene.add( P4 );
				
				
				pacs= [];					
				//P1 at spot 0
				//CD stands for CountDown
				//B stands for Boost and it is a true or false variable
				var Player1 = {Player:"P1", direction : "North", intendedDirection: "North",Model:0,
							Status:"Died", Speed:1, Density:1, Delay:0,
							oldNode:-1, previousNode:25, currentNode:22,
							sizeCD:0,speedCD:0, densityCD:0, effectCD:0,
							sizeB: false, speedB: false, densityB:false, effectB:false};
				pacs.push(Player1);
				
				//P2 at spot 1
				var Player2 = {Player:"P2", direction : "North", intendedDirection: "North",Model:0,
							Status:"Died", Speed:1, Density:1, Delay:0,
							oldNode:-1, previousNode:39, currentNode:35,
							sizeCD:0,speedCD:0, densityCD:0, effectCD:0,
							sizeB: false, speedB: false, densityB:false, effectB:false};
				pacs.push(Player2);
				//P3 at spot 2
				var Player3 = {Player:"P3", direction : "South", intendedDirection: "South",Model:0,
							Status:"Died", Speed:1, Density:1, Delay:0,
							oldNode:-1, previousNode:0, currentNode:6,
							sizeCD:0,speedCD:0, densityCD:0, effectCD:0,
							sizeB: false, speedB: false, densityB:false, effectB:false};
				pacs.push(Player3);
				//P4 at spot 3
				var Player4 = {Player:"P4", direction : "South", intendedDirection: "South",Model:0,
							Status:"Died", Speed:1, Density:1, Delay:0,
							oldNode:-1, previousNode:10, currentNode:15,
							sizeCD:0,speedCD:0, densityCD:0, effectCD:0,
							sizeB: false, speedB: false, densityB:false, effectB:false};
				pacs.push(Player4);
				
		}
		
		//Insert the Ghost into the Level
		function load_Ghost(){
			scene.add(Blinky);
			Blinky.position.set(0,0,35);
			Blinky.scale.set(1.25,.75,0);
			ghosts[0].timer = step+5;
				
			scene.add(Pinky);
			Pinky.position.set(0,0,35);
			Pinky.scale.set(1.25,.75,0);
			//ghosts[1].timer = step+50;
			ghosts[1].timer = step+25;
				
			scene.add(Inky);
			Inky.position.set(0,-0.5,35);
			Inky.scale.set(1.25,.75,0);
			//ghosts[2].timer = step+100;
			ghosts[2].timer = step+45;
			
			scene.add(Clyde);
			Clyde.position.set(0,-1,35);
			Clyde.scale.set(1.25,.75,0);
			//ghosts[3].timer = step+150;
			ghosts[3].timer = step+55;
				
			//scene.add(Courage);
			//Courage.position.set(0,5,35);
			//Courage.scale.set(1.25,.75,0);
		}
		
		//Instructions for if a Player and a Ghost Collide
		function Collision(player,ghost){
			
			//A player has died
			console.log(player);
			console.log("P"+(player.name+1)+"-died!!!!");
			pacs[player.name].Status = "Died";
			console.log(player.name+"  Status:"+pacs[player.name].Status);
			var data = {
				player : player.name+1
			}
			
			try{
				if(pacs[0].Status == "Died" && pacs[1].Status == "Died" && pacs[2].Status == "Died" && pacs[3].Status == "Died"){
					GameStatus = "Game Over";
					console.log(GameStatus);
					//Adding Title
					var loader = new THREE.TextureLoader();
					loader.crossOrigin = true;
					var T = loader.load( 'Images/Game Over.png' );
					T.minFilter = THREE.LinearFilter;
					var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
					GameOver = new THREE.Sprite(T1);
					scene.add(GameOver);
					GameOver.position.set(0,-1.25,38);
					GameOver.scale.set(15.5,4,1);
					
					T = loader.load( 'Images/PlayAgain.png' );
					T.minFilter = THREE.LinearFilter;
					T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
					PlayAgain = new THREE.Sprite(T1);
					scene.add(PlayAgain);
					PlayAgain.position.set(0,-3.25,38);
					PlayAgain.scale.set(8,2,1);
					
					//Function
					PlayAgain.callback = function() {
							if(GameStatus == "Game Over"){
								try{
									scene.remove(PlayAgain); 
									scene.remove(GameOver);
									scene.remove(Blinky);
									scene.remove(Pinky);
									scene.remove(Inky);
									scene.remove(Clyde);
									
									GameStatus = "IDLE";
									resetGhost();
									Pac.emit('Start Count to the Next Game');
									PlayerMesh.parameters.text= "";
									PlayerMesh.update();
									
									//Removes Pellets
									while(PelletsList.length > 0){
										scene.remove(PelletsList[0].Pellet);
										PelletsList.splice(0,1);
									}
									//Removes Level
									while(Level.length > 0){
										scene.remove(Level[0]);
										Level.splice(0,1);
									}
									scene.remove(PlayerMesh);
									scene.remove(P1); 
									scene.remove(P2);
									scene.remove(P3);
									scene.remove(P4);
									scene.remove(Fruit);
								}catch(e){
									//functionToHandleError(e);		
									//He HE HE don't say a word if errors happen
									scene.remove(Fruit);
									scene.remove(P4);
									scene.remove(P3);
									scene.remove(P2);
									scene.remove(P1);
									scene.remove(PlayerMesh);
								}
							}
					};
					clickable.push(PlayAgain);
					
					
					Pac.emit('A Player Died',data);					
					Pac.emit('Game Over');					
				}
				else{
					player.position.set(0,-8,35);
					scene.remove(player);
					Pac.emit('A Player Died',data);	
				}	
			}catch(e){
				//Error
				scene.remove(player);
				pacs[player.material.name].Status = "Died";
				player.position.set(0,-8,35);
				console.log("GAME OVER")
			}
		}
		
		//Resets the Ghost to their original status
		function resetGhost(){
			ghosts= [];					
			//Blinky
			var G1 = {Status: "Chase", Name:"Blinky", Delay:0, direction : 0, Model:0, Node:[], 
						oldNode:-1, previousNode:-1, currentNode:11 , timer:1};
			ghosts.push(G1);
			//Pinky
			var G2 = {Status: "Chase", Name:"Pinky", Delay:0, direction : 0, Model:0, Node:[],
						oldNode:-1, previousNode:-1, currentNode:11 , timer:40};
			ghosts.push(G2);
			//Inky
			var G3 = {Status: "Chase", Name:"Inky", Delay:0, direction : 0, Model:0, Node:[],
						oldNode:-1, previousNode:-1, currentNode:11 , timer:80};
			ghosts.push(G3);
			//Cylde
			var G4 = {Status: "Chase", Name:"Clyde", Delay:0, direction : 0, Model:0, Node:[],
						oldNode:-1, previousNode:-1, currentNode:11 , timer:120};
			ghosts.push(G4);
			//Courage
			var G5 = {Status: "Chase", Name:"Courage", Delay:0, direction : 0, Model:0, Node:[],
						oldNode:-1, previousNode:-1, currentNode:11 , futureNode:5, timer:500};
			ghosts.push(G5);	
		}
		
		//Loads the Start Screen
		function load_StartScreen(){
			
			var loader = new THREE.TextureLoader();
			loader.crossOrigin = true;
			
			//Start Game
			var T = loader.load( 'Images/StartGame.png' );
			T.minFilter = THREE.LinearFilter;
			var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
			StartGameMesh = new THREE.Sprite(T1);
			scene.add(StartGameMesh);
			StartGameMesh.position.set(1,0.25,35);
			StartGameMesh.scale.set(15,3.25,1);
			StartGameMesh.callback = function() {
					if(GameStatus == "StartScreen"){
						try{
							scene.remove(StartGameMesh);
							scene.remove(AboutMesh);
							scene.remove(CreditsMesh);
							
							Pac.emit('Start Count to the Next Game');
							console.log("Start the Countdown!!!");
							
							scene.remove(startGhost1); 
							scene.remove(startGhost2);
							scene.remove(startGhost3);
							scene.remove(startGhost4);
							scene.remove(startGhost5);
							scene.remove(startGhost6);
							scene.remove(startGhost7);
							scene.remove(startGhost8);
						}catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
							console.log(e);
						}
					}
			};
			clickable.push(StartGameMesh);
			
			//About Button
			var T = loader.load( 'Images/About2.png' );
			T.minFilter = THREE.LinearFilter;
			var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
			AboutMesh = new THREE.Sprite(T1);
			scene.add(AboutMesh);
			AboutMesh.position.set(-5,-4.5,35);
			AboutMesh.scale.set(7.75,2.75,1);
			AboutMesh.callback = function() {
					if(GameStatus == "StartScreen"){
						/**
						try{
							
							scene.remove(startGhost1); 
							scene.remove(startGhost2);
							scene.remove(startGhost3);
							scene.remove(startGhost4);
							scene.remove(startGhost5);
							scene.remove(startGhost6);
							scene.remove(startGhost7);
							scene.remove(startGhost8);
							
							GameStatus = "About";
							var text1 = "I have received a great deal of ";
							var text2 = "inspiration from the Pac-Man "
							var text3 = "Battle Royale arcade game at ";
							var text4 = "Barcade in Downtown New Haven, CT";
							console.log(text1+text2+text3);
							
							groupMesh = new THREE.Group();
							//https://threejs.org/docs/#api/objects/Group
							
							
							//Text1 Entry
							var textboxTexture = new THREEx.DynamicTexture(2048,256);
							textboxTexture.context.font	= " 120px Comic Sans MS";
							textboxTexture.clear('black').drawText(text1, 12, 125, 'White');
							var geometry = new THREE.PlaneGeometry( 18,0.75, 1);
							var material = new THREE.MeshBasicMaterial({
								map	: textboxTexture.texture
							});
							textfieldMesh = new THREE.Mesh( geometry, material );
							textfieldMesh.position.set(0,-7.5,35);
							groupMesh.add( textfieldMesh );
							//Text2 Entry
							var textboxTexture = new THREEx.DynamicTexture(2048,256);
							textboxTexture.context.font	= " 120px Comic Sans MS";
							textboxTexture.clear('black').drawText(text2, 12, 125, 'White');
							var geometry = new THREE.PlaneGeometry( 18,0.75, 1);
							var material = new THREE.MeshBasicMaterial({
								map	: textboxTexture.texture
							});
							textfieldMesh = new THREE.Mesh( geometry, material );
							textfieldMesh.position.set(0,-8,35);
							groupMesh.add( textfieldMesh );
							
							//Text3 Entry
							var textboxTexture = new THREEx.DynamicTexture(2048,256);
							textboxTexture.context.font	= " 120px Comic Sans MS";
							textboxTexture.clear('black').drawText(text3, 12, 125, 'White');
							var geometry = new THREE.PlaneGeometry( 18,0.75, 1);
							var material = new THREE.MeshBasicMaterial({
								map	: textboxTexture.texture
							});
							textfieldMesh = new THREE.Mesh( geometry, material );
							textfieldMesh.position.set(0,-8.5,35);
							groupMesh.add( textfieldMesh );
							
							//Text4 Entry
							var textboxTexture = new THREEx.DynamicTexture(2048,256);
							textboxTexture.context.font	= " 120px Comic Sans MS";
							textboxTexture.clear('black').drawText(text4, 12, 125, 'White');
							var geometry = new THREE.PlaneGeometry( 18,0.75, 1);
							var material = new THREE.MeshBasicMaterial({
								map	: textboxTexture.texture
							});
							textfieldMesh = new THREE.Mesh( geometry, material );
							textfieldMesh.position.set(0,-9,35);
							groupMesh.add( textfieldMesh );
							//Add Group to the scene
							scene.add( groupMesh );
							//console.log("X: "+groupMesh.position.x);
							//console.log("Y: "+groupMesh.position.y);
							//groupMesh.position.y =5;
							//console.log("Y: "+groupMesh.position.y);
							
							//Close Mesh
							text = "Close About";
							var textboxTexture = new THREEx.DynamicTexture(1024,256);
							textboxTexture.context.font	= " 120px Arial";
							textboxTexture.clear('black').drawText(text, 50, 125, 'crimson');
							var geometry = new THREE.PlaneGeometry(5,1, 1);
							var material = new THREE.MeshBasicMaterial({
								map	: textboxTexture.texture
							});
							closeMesh = new THREE.Mesh( geometry, material );
							closeMesh.position.set(0,-13,35);
							scene.add( closeMesh );
							closeMesh.callback = function() {
								try{
									scene.remove(closeMesh);
									scene.remove(groupMesh);
									console.log("Closed About!!!")
									GameStatus = "StartScreen";
								}catch(e){
									//functionToHandleError(e);		
									//He HE HE don't say a word if errors happen
									
								}
					};
					clickable.push(closeMesh);
					
						}catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
						}
						*/
					}
			};
			clickable.push(AboutMesh);
			
			/**
			//Credits Button
			text = "Credits";
			var Credits_Texture  = new THREEx.DynamicTexture(1024,256);
			Credits_Texture.context.font	= "bolder 250px Verdana";
			Credits_Texture.clear('Black').drawText(text,20, 220, 'Gold');
			//Adding Texture to the Scene
			geometry = new THREE.PlaneGeometry( 7, 1, 1);
			material = new THREE.MeshBasicMaterial({
				map	: Credits_Texture.texture
			});
			CreditsMesh = new THREE.Mesh( geometry, material );
			CreditsMesh.position.set(5,-6.5,35);
			//scene.add( CreditsMesh );
			CreditsMesh.callback = function() {
					if(GameStatus == "StartScreen"){
						try{
							scene.remove(startGhost1); 
							scene.remove(startGhost2);
							scene.remove(startGhost3);
							scene.remove(startGhost4);
							scene.remove(startGhost5);
							scene.remove(startGhost6);
							scene.remove(startGhost7);
							scene.remove(startGhost8);
							
							GameStatus = "Credits";
							
							//Close Mesh
							text = "Close About";
							var textboxTexture = new THREEx.DynamicTexture(1024,256);
							textboxTexture.context.font	= " 120px Arial";
							textboxTexture.clear('black').drawText(text, 50, 125, 'crimson');
							var geometry = new THREE.PlaneGeometry(5,1, 1);
							var material = new THREE.MeshBasicMaterial({
								map	: textboxTexture.texture
							});
							closeMesh = new THREE.Mesh( geometry, material );
							closeMesh.position.set(0,-13,35);
							scene.add( closeMesh );
							closeMesh.callback = function() {
							if(GameStatus == "Credits"){
								try{
									scene.remove(closeMesh);
									console.log("Closed About!!!")
									GameStatus = "StartScreen";
								}catch(e){
									//functionToHandleError(e);		
									//He HE HE don't say a word if errors happen
								}
							}
					};
					clickable.push(closeMesh);
					
						}catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
						}
					}
			};
			clickable.push(CreditsMesh);
			**/
			
			//Credits Button
			var T = loader.load( 'Images/Credits.png' );
			T.minFilter = THREE.LinearFilter;
			var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
			CreditsMesh = new THREE.Sprite(T1);
			scene.add(CreditsMesh);
			CreditsMesh.position.set(5,-4.5,35);
			CreditsMesh.scale.set(7.75,1.5,1);
			//Function
			CreditsMesh.callback = function() {
					if(GameStatus == "StartScreen"){
						/**
						try{
							scene.remove(startGhost1); 
							scene.remove(startGhost2);
							scene.remove(startGhost3);
							scene.remove(startGhost4);
							scene.remove(startGhost5);
							scene.remove(startGhost6);
							scene.remove(startGhost7);
							scene.remove(startGhost8);
							
							GameStatus = "Credits";
							
							//Close Mesh
							text = "Close About";
							var textboxTexture = new THREEx.DynamicTexture(1024,256);
							textboxTexture.context.font	= " 120px Arial";
							textboxTexture.clear('black').drawText(text, 50, 125, 'crimson');
							var geometry = new THREE.PlaneGeometry(5,1, 1);
							var material = new THREE.MeshBasicMaterial({
								map	: textboxTexture.texture
							});
							closeMesh = new THREE.Mesh( geometry, material );
							closeMesh.position.set(0,-13,35);
							scene.add( closeMesh );
							closeMesh.callback = function() {
								try{
									scene.remove(closeMesh);
									console.log("Closed About!!!")
									GameStatus = "StartScreen";
								}catch(e){
									//functionToHandleError(e);		
									//He HE HE don't say a word if errors happen
								}
					};
							clickable.push(closeMesh);
					
						}catch(e){
							//functionToHandleError(e);		
							//He HE HE don't say a word if errors happen
						}
						**/
					}
			};
			clickable.push(CreditsMesh);
			
			
		}
		
		//Loads the Splash Screen
		function load_SplashScreen(){
			GameStatus = "SplashScreen";
			//Adding Title
			var loader = new THREE.TextureLoader();
				loader.crossOrigin = true;
			var HTP01 = loader.load( 'Images/Title.png' );
				HTP01.minFilter = THREE.LinearFilter;
			planeGeometry = new THREE.PlaneBufferGeometry (4, 1,0);
			planeMaterial = new THREE.MeshBasicMaterial( { map: HTP01, color: 0xffffff } );
			//var planeMaterial = new THREE.MeshLambertMaterial({color: 0x2ff33c}); //RGB	
			Title = new THREE.Mesh(planeGeometry, planeMaterial);
			scene.add(Title);
			Title.position.set(0,-0.25,38); 
			Title.scale.set(3.75,1,1); 
			
			//Adding the Ghost!!
			startGhost1 = Blinky.clone();
			startGhost1 =  new THREE.Sprite(BlinkyL1);	
			scene.add(startGhost1);
			startGhost1.position.set(-10,-1.5,35);
			startGhost1.scale.set(1.25,.75,0);
			
			startGhost2 = Pinky.clone();
			scene.add(startGhost2);
			startGhost2.position.set(-6,0.75,35);
			startGhost2.scale.set(1.25,.75,0);
			
			startGhost3 = Inky.clone();
			scene.add(startGhost3);
			startGhost3.position.set(-6,-1.5,35);
			startGhost3.scale.set(1.25,0.75,0);
			
			startGhost4 = Clyde.clone();
			scene.add(startGhost4);
			startGhost4.position.set(-2,-1.5,35);
			startGhost4.scale.set(1.25,0.75,0);
			
			startGhost5 = Blinky.clone();
			scene.add(startGhost5);
			startGhost5.position.set(3,0.75,35);
			startGhost5.scale.set(1.25,.75,0);
			
			startGhost6 = Pinky.clone();
			scene.add(startGhost6);
			startGhost6.position.set(2,-1.5,35);
			startGhost6.scale.set(1.25,.75,0);
		}
		
		// Socket Functions
		function sendScore(){
			var data = { score: 75 };
			socket.emit('sendScore',data);
		}

}
	//window.onload = init;	
	window.onload = setup;	