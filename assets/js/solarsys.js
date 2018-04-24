if ( ! Detector.webgl ) Detector.addGetWebGLMessage();


  var container;

  var stats;

  var camera, controls, scene, renderer;

  var INTERSECTED, SELECTED;
  var mousepicking = new THREE.Vector2();
  var prevCOLOintersected, prevCOLOselected;

  var textureAPP = new THREE.TextureLoader();

  var mouse = new THREE.Vector2();
  //les groupes dans notre scènes
  var groups = new Array();
  //les objets qui composent les groupes
  var subGroups = new Array();
  var object = new Array();
  
  //information sur les groupes
  var posXGroup = new Array();
  //le premier élément qui est la case 0, ne compte pas
  var autoRotateFact = new Array(0, -0.01, -0.02, -0.03, -0.04, -0.05);
  var rotateVitesseGroup = new Array(0, 0, 0.6, 0.4, 0.3, 0.12);
  //information sur les éléments des groupes
  var posXElementGroup = new Array();
  var rotateVitesseElt = new Array();
  

  var ambLight, spotlight, dirlight, pointLight;
  var defaultPower;
  var dLightHelper;

  var raycaster = new THREE.Raycaster();
  var colorPick = 0xF6FE00;
  var colorSelected = 0xF600FE;

  var white = new THREE.Color(0xdddddd);
  var lightBlue = new THREE.Color(0xb4e7f2);
  var darkGrey = new THREE.Color(0x444444);
  var black = new THREE.Color(0x000000);
  var red = new THREE.Color(0xff0000);
  var green = new THREE.Color(0x00ff00);
  var lightGreen = new THREE.Color(0x8BD04F);
  var blue = new THREE.Color(0x0000ff);
  var iteration = 0;

  // Ajout du BackGround

  var textureLoader = new THREE.TextureLoader();
  textureLoader.load('assets/textures/univers.jpg', function (texture){
    texture.mapping = THREE.UVMapping;
    scene.background = texture;
  });   

  var parametreTITLE = function() {
    this.sensibility_mouse = 0.003;
    this.depl_Speed = 5.0;
    this.pause = false;
    this.rotateCam = false;
    this.clignote = false;
    this.distanceRelative = 50;
    this.vitRotation = 0.1;
    this.rotationZ = 0.12;
    this.vitAutoRotation = 0.01;
    this.timeTravel = 10000;
    this.letsgo = function() {
      startTravel();
    }
    this.maison = 'Home';
  };
  var params;

  var chatPERCHE;
  var neptune;
  var pluton;
  var currentDestination;

  var controllerMaison;

  var controllerVitRotation;
  var controllerRotationZ;
  var controllerVitAutoRotation;
  var controllerDistanceRelative;
  var tmpScalex;
  var tmpScaley;
  var tmpScalez;
  var prevIntensitySpot;
  var text;


  var rotateCam = false;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  init();


  var aze = 0;

  function init() {
      scene = new THREE.Scene();
        container = document.getElementById( 'container' );
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
        camera.position.set(0, 300, 500);
        camera.lookAt( scene.position );

    //creation des groupes (groupSoleil, groupMercure, groupVenus, groupTerre, groupJupiter)
    for (var i = 1; i < 7; i++) {
      groups[i] = new THREE.Group();
      scene.add(groups[i]);
      subGroups[i] = new Array();
      posXElementGroup[i] = new Array();
      rotateVitesseElt[i] = new Array();
    }
    
    var texture, material, geometry;
      var loader = new THREE.TextureLoader();
      var colorMap = loader.load( "assets/textures/terre.jpg" );
      var specMap = loader.load( "assets/textures/terreSpec.jpg" );
      var normalMap = loader.load( "assets/textures/terreNorm.jpg" );
    //creation du groupe soleil
    posXGroup[1] = 0;
    
      //soleil
      texture = new THREE.TextureLoader().load( 'assets/textures/soleil.jpg' );
        material = new THREE.MeshPhongMaterial( { map: texture, shininess: 200 } );
        geometry = new THREE.SphereGeometry( 60, 60, 60 );
        subGroups[1][1] = new THREE.Mesh( geometry, material );
        subGroups[1][1].material.specularMap = specMap;
        groups[1].add( subGroups[1][1] );
        
        posXElementGroup[1][1] = 0;
        rotateVitesseElt[1][1] = 0;
        
        //creation du groupe mercure
        posXGroup[2] = 100;
        groups[2].rotation.z = THREE.Math.degToRad(-10);
        
        //mercure
        var texMercure = textureAPP.load( "assets/textures/mercure.jpg");
          texMercure.mapping = THREE.SphericalReflectionMapping; 

        material = new THREE.MeshBasicMaterial({map: texMercure});
        geometry = new THREE.SphereGeometry(5,32,32);
        subGroups[2][1] = new THREE.Mesh(geometry, material);
        groups[2].add( subGroups[2][1]);
        
        posXElementGroup[2][1] = 0;
        rotateVitesseElt[2][1] = 0;
        
          
        //creation du groupe venus
          posXGroup[3] = 150;
       
        //venus

        var texVenus = textureAPP.load( "assets/textures/venus.jpg");
          texVenus.mapping = THREE.SphericalReflectionMapping; 

        material = new THREE.MeshBasicMaterial({map: texVenus});
        geometry = new THREE.SphereGeometry(8,32,32);
        subGroups[3][1] = new THREE.Mesh(geometry, material);
        groups[3].add( subGroups[3][1]);
        
        posXElementGroup[3][1] = 0;
        rotateVitesseElt[3][1] = 0.;

        //torus

        var texDonut = textureAPP.load( "assets/textures/donut.jpg");
          texDonut.mapping = THREE.SphericalReflectionMapping; 

        material = new THREE.MeshBasicMaterial({map: texDonut});
        geometry = new THREE.TorusGeometry( 5, 2.5, 12, 600 );
        subGroups[3][2] = new THREE.Mesh( geometry, material );
        groups[3].add( subGroups[3][2]);
        
        posXElementGroup[3][2] = -30;
        rotateVitesseElt[3][2] = 2.1;        
        
       //creation du groupe terre
         posXGroup[4] = 200;
        groups[4].rotation.z = THREE.Math.degToRad(-20);
       
        //terre
        material = new THREE.MeshPhongMaterial({
          color: 0xeeeeee,
          specular: 0x333333,
          shininess: 15
        });
        geometry = new THREE.SphereGeometry(12,32,32);
        subGroups[4][1] = new THREE.Mesh(geometry, material);
        subGroups[4][1].material.map = colorMap;
          subGroups[4][1].material.normalMap = normalMap;
          subGroups[4][1].material.specularMap = specMap;
          subGroups[4][1].material.needsUpdate = true;
        groups[4].add( subGroups[4][1]);
        
        posXElementGroup[4][1] = 0;
        rotateVitesseElt[4][1] = 0.;
        
        //lune

        texture = new THREE.TextureLoader().load( 'assets/textures/lune.jpg' );
          material = new THREE.MeshLambertMaterial( { map: texture, shininess: 30 } );
          geometry = new THREE.SphereGeometry( 4, 24, 16 );
          subGroups[4][2] = new THREE.Mesh( geometry, material );
          subGroups[4][2].material.specularMap = specMap;
          subGroups[4][2].material.normalMap = normalMap;
          groups[4].add( subGroups[4][2] );
        
        posXElementGroup[4][2] = 20;
        rotateVitesseElt[4][2] = 2.5;

        var loadingManager = new THREE.LoadingManager( function() {
          groups[4].add( subGroups[4][3] );
        } );

          var loader = new THREE.ColladaLoader( loadingManager );
          loader.load( 'assets/objets/maison2.dae', function ( collada ) {
            subGroups[4][3] = collada.scene;
          });

          posXElementGroup[4][3] = -10;
          rotateVitesseElt[4][3] = 0;        
        
        
        //creation du groupe jupiter
            posXGroup[5] = 330;
            groups[5].rotation.z = THREE.Math.degToRad(30);
       
        //jupiter

        var texJupiter = textureAPP.load( "assets/textures/jupiter.jpg");
          texJupiter.mapping = THREE.SphericalReflectionMapping; 

        material = new THREE.MeshBasicMaterial({map: texJupiter});
        geometry = new THREE.SphereGeometry(24,32,32);
        subGroups[5][1] = new THREE.Mesh(geometry, material);
        groups[5].add( subGroups[5][1] );
        
        posXElementGroup[5][1] = 0;
        rotateVitesseElt[5][1] = 0.;
        

          
        var texPelage = textureAPP.load( "assets/textures/pelage2.jpg");
          texPelage.mapping = THREE.SphericalReflectionMapping;  

        // Chat Cosmique

        var objloader = new THREE.ObjectLoader();
        objloader.load( "assets/objets/cat.json", function( group ) {
          subGroups[5][2] = group.children[0];
          subGroups[5][2].material = new THREE.MeshBasicMaterial({map: texPelage, flatShading : false});
          subGroups[5][2].scale.multiplyScalar(0.3);
          groups[5].add( subGroups[5][2]);
        });

        posXElementGroup[5][2] = 70;
          rotateVitesseElt[5][2] = 1.5;



        //creation du groupe saturne
            posXGroup[6] = 450;
            groups[6].rotation.z = THREE.Math.degToRad(40);
       
        //saturne

        var texSaturne = textureAPP.load( "assets/textures/saturne.jpg");
          texSaturne.mapping = THREE.SphericalReflectionMapping; 

        material = new THREE.MeshBasicMaterial({map: texSaturne});
        geometry = new THREE.SphereGeometry(30,32,32);
        subGroups[6][1] = new THREE.Mesh(geometry, material);
        groups[6].add( subGroups[6][1]);
        
        posXElementGroup[6][1] = 0;
        rotateVitesseElt[6][1] = 0;
        

         var cpt =0;  
          for( var i = 1; i< subGroups.length; ++i){
            for( var j = 1; j<subGroups[i].length; ++j){
            object[cpt] = subGroups[i][j];
            cpt++;
          }
        }

        // Pluton

        var texPluton = textureAPP.load( "assets/textures/pluton.jpg");
          texPluton.mapping = THREE.SphericalReflectionMapping; 

        material = new THREE.MeshBasicMaterial({map: texPluton});
        geometry = new THREE.SphereGeometry(13,32,32);
        pluton = new THREE.Mesh(geometry, material);
        scene.add( pluton );
        pluton.position.set(100, 100, 200);


        // Neptune

        var texNeptune = textureAPP.load( "assets/textures/neptune.jpg");
          texNeptune.mapping = THREE.SphericalReflectionMapping; 

        material = new THREE.MeshBasicMaterial({map: texNeptune});
        geometry = new THREE.SphereGeometry(13,32,32);
        neptune = new THREE.Mesh(geometry, material);
        scene.add( neptune );
        neptune.position.set(-200, -100, -10);

        //Chat Cosmique 2

        var texPelage2 = textureAPP.load( "assets/textures/pelage.jpg");
            texPelage2.mapping = THREE.SphericalReflectionMapping;  

        var objloader = new THREE.ObjectLoader();
          objloader.load("assets/objets/cat.json", function( group ) {
            chatPERCHE = group.children[0];
            chatPERCHE.material = new THREE.MeshBasicMaterial({map: texPelage2, flatShading : false});
            chatPERCHE.scale.multiplyScalar(0.2);
            chatPERCHE.position.set(100, 100, 200);
            scene.add(chatPERCHE);
          });

          currentDestination = neptune;


            // Titre maison

            var canvasMAISON = document.createElement('canvas');
            canvasMAISON.width = 256;
            canvasMAISON.height = 256; 
            text = new parametreTITLE('maison'); 
            var fontsize = 50;
            var ctx = canvasMAISON.getContext('2d');
            ctx.font = '700 ' + fontsize + 'px Arial';
            // get size data (height depends only on font size)
            var metrics = ctx.measureText( text.maison );
            var textWidth = metrics.width;
            var xPos = (canvasMAISON.width - textWidth) / 2; 
            ctx.fillStyle = '#ffffff';
            ctx.fillText(text.maison, xPos, fontsize);
            var texture = new THREE.Texture(canvasMAISON);
            texture.needsUpdate = true;


            var spriteMaterial = new THREE.SpriteMaterial({ map: texture }); 
            var sprite = new THREE.Sprite( spriteMaterial );
            sprite.scale.setScalar(80);
            sprite.position.set(0,20,0);
            groups[4].add( sprite );   

        // Éclairage
        ambLight = new THREE.AmbientLight( red );
        ambLight.intensity = 0.6;
        scene.add(ambLight);        
    
        dLight = new THREE.DirectionalLight( lightGreen, .8 );
        dLight.position.set( 100, 50, 0 );
        dLight.intensity = 0.9;
        scene.add( dLight );
        
        pointLight = new THREE.PointLight( lightBlue, .8 ); // distance
        pointLight.position.set( 0, 0, 0 );
        pointLight.intensity = 4.;
        scene.add( pointLight );
        
        spotlight = new THREE.SpotLight( red, 1.2, 0, Math.PI/15, 1.4 ); // hex, intensity, distance, angle, penumbra
        scene.add( spotlight );
        //position devant la caméra
        spotlight.position.set( 200, 200, 50);
        //dirigé vers la terre
        spotlight.target = subGroups[4][1];
         dLightHelper = new THREE.SpotLightHelper( spotlight, 1 );
        scene.add( dLightHelper );
        
        renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        renderer.setClearColor( 0x000000, 0 ); // the default
        renderer.setSize( window.innerWidth, window.innerHeight );

        container.appendChild( renderer.domElement );

        // Panel de controle
        params = new parametreTITLE();
        var gui = new dat.GUI();
        var cam = gui.addFolder('Camera');
          cam.add(params,'depl_Speed', 1, 20).listen();
          cam.add(params,'sensibility_mouse', 0.001, 0.01).listen();
          cam.add(params,'pause').listen();

        var lightTITLE = gui.addFolder('Éclairage');
        var spotlightTITLE = lightTITLE.addFolder('spotlight');
        var amblightTITLE = lightTITLE.addFolder('AmbientLight');
        var dirlightTITLE = lightTITLE.addFolder('DirectionalLight');
        var pointLightTITLE = lightTITLE.addFolder('PointLight');
        var controleClignote = lightTITLE.add(params, 'clignote').listen();
        spotlightTITLE.add(spotlight.position, 'x');
        spotlightTITLE.add(spotlight.position, 'y');
        spotlightTITLE.add(spotlight.position, 'z');
        spotlightTITLE.addColor(spotlight, 'color');
        spotlightTITLE.add(spotlight, 'intensity', 0, 10).listen();
        spotlightTITLE.add(spotlight, 'angle', 0, 1).listen();
        amblightTITLE.addColor(ambLight, 'color');
        amblightTITLE.add(ambLight, 'intensity', 0, 10).listen();
        dirlightTITLE.add(dLight.position, 'x');
        dirlightTITLE.add(dLight.position, 'y');
        dirlightTITLE.add(dLight.position, 'z');
        dirlightTITLE.addColor(dLight, 'color');
        dirlightTITLE.add(dLight, 'intensity', 0, 10).listen();
        pointLightTITLE.add(pointLight.position, 'x');
        pointLightTITLE.add(pointLight.position, 'y');
        pointLightTITLE.add(pointLight.position, 'z');
        pointLightTITLE.addColor(pointLight, 'color');
        pointLightTITLE.add(pointLight, 'intensity', 0, 10).listen();

        var planeteTITLE = gui.addFolder('Planetes');
        controllerVitRotation = planeteTITLE.add(params, 'vitRotation', 0, 15);
        controllerRotationZ = planeteTITLE.add(params, 'rotationZ', THREE.Math.degToRad(-45), THREE.Math.degToRad(45));
        controllerVitAutoRotation = planeteTITLE.add(params, 'vitAutoRotation', -0.02, 0.02);
        controllerDistanceRelative = planeteTITLE.add(params, 'distanceRelative', 0, 500);

        var voyageTITLE = gui.addFolder('Voyage');
        voyageTITLE.add(params, 'timeTravel', 1000, 30000);
        var departTITLE = voyageTITLE.addFolder('Depart');
        departTITLE.add(neptune.position, 'x', -500, 500).listen();
        departTITLE.add(neptune.position, 'y', -500, 500).listen();
        departTITLE.add(neptune.position, 'z', -500, 500).listen();
        departTITLE.open();
        var arriveeTITLE = voyageTITLE.addFolder('Arrivée');
        arriveeTITLE.add(pluton.position, 'x', -500, 500).listen();
        arriveeTITLE.add(pluton.position, 'y', -500, 500).listen();
        arriveeTITLE.add(pluton.position, 'z', -500, 500).listen();
        arriveeTITLE.open();
        voyageTITLE.add(params, 'letsgo');

        var homeTITLE = gui.addFolder('Maison');
        controllerMaison = homeTITLE.add(params, 'maison', [ 'Home', 'Maison', 'بيت' ] ).listen();


    controllerMaison.onChange(function(value){  
      groups[4].remove( sprite );
        canvasMAISON.width = 256;
        canvasMAISON.height = 256; 
        text = params.maison;   
          fontsize = 50;
          ctx = canvasMAISON.getContext('2d');
          ctx.font = '700 ' + fontsize + 'px Arial';
          metrics = ctx.measureText( text );
          textWidth = metrics.width;
          xPos = (canvasMAISON.width - textWidth) / 2;

          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, xPos, fontsize);

          texture = new THREE.Texture(canvasMAISON);
          texture.needsUpdate = true;

          spriteMaterial = new THREE.SpriteMaterial({ map: texture }); 
          sprite = new THREE.Sprite( spriteMaterial );
          sprite.scale.setScalar(80);
          sprite.position.set(0,20,0);
          groups[4].add( sprite );

    });


    //applique les modifications sur l'objet selectionné
    controllerVitRotation.onFinishChange(function(value) {
      //si un objet a été selectionné
      if(SELECTED) {
        //on recherche l'objet selectionné parmi tous les éléments des groupes pour trouver les index i et j
        for( var i = 1; i < subGroups.length; ++i) {
          for( var j = 1; j < subGroups[i].length; ++j) {
            if(SELECTED == subGroups[i][j]) {
              if(j == 1)
                rotateVitesseGroup[i] = value;
              else
                rotateVitesseElt[i][j] = value;
              break;
            }
          }
        }
      }
    });
    
    controllerRotationZ.onFinishChange(function(value) {
      //si un objet a été selectionné
      if(SELECTED) {
        //on recherche l'objet selectionné parmi tous les éléments des groupes pour trouver les index i et j
        for( var i = 1; i < subGroups.length; ++i) {
          for( var j = 1; j < subGroups[i].length; ++j) {
            if(SELECTED == subGroups[i][j]) {
              groups[i].rotation.z = value;
              break;
            }
          }
        }
      }

    });

    controllerVitAutoRotation.onFinishChange(function(value) {
      //si un objet a été selectionné
      if(SELECTED) {
        //on recherche l'objet selectionné parmi tous les éléments des groupes pour trouver les index i et j
        for( var i = 1; i < subGroups.length; ++i) {
          for( var j = 1; j < subGroups[i].length; ++j) {
            if(SELECTED == subGroups[i][j]) {
              autoRotateFact[i] = value;
              break;
            }
          }
        }
      }

    });

    controllerDistanceRelative.onFinishChange(function(value) {
      //si un objet a été selectionné
      if(SELECTED) {
        //on recherche l'objet selectionné parmi tous les éléments des groupes pour trouver les index i et j
        for( var i = 1; i < subGroups.length; ++i) {
          for( var j = 1; j < subGroups[i].length; ++j) {
            if(SELECTED == subGroups[i][j]) {
              if(j == 1)
                posXGroup[i] = value;
              else
                posXElementGroup[i][j] = value;
              break;
            }
          }
        }
      }

    });

    gui.add(params, 'pause').listen();

    controleClignote.onFinishChange(function(value) {
      if(value){ //sauvegarde la valeur des intensités
        prevIntensityPoint = pointLight.intensity;
        prevIntensitySpot = spotlight.intensity;
      }else
      {
        pointLight.intensity = prevIntensityPoint;
        spotlight.intensity = prevIntensitySpot;
      }
    })
    //gestion des éléments
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableKeys = false;

        //gestion des evenements
        window.addEventListener('keydown', function(e) {
          switch(e.keyCode) {
            case 90 : //z
              camera.position.z -= params.depl_Speed;
              break;
            case 83 : //s
              camera.position.z += params.depl_Speed;
              break;
            case 81 : //q
              camera.position.x -= params.depl_Speed;
              break;
            case 68 : //d
              camera.position.x += params.depl_Speed;
              break;
            case 69 : //e
              camera.position.y += params.depl_Speed;
              break;
            case 65 : //a
              camera.position.y -= params.depl_Speed;
              break;
            case 82 : //r
              camera.rotateCam = !params.rotateCam;
              break;
            case 67 : //c
              if(SELECTED) { //on deselectionne le dernier selectionné, si il existe
                SELECTED.material.emissive.setHex( SELECTED.currentHex );
                SELECTED = null;

                //mise à jour du menu
                planeteTITLE.remove(tmpScalex);
                planeteTITLE.remove(tmpScaley);
                planeteTITLE.remove(tmpScalez);
              }
              if(INTERSECTED) {
                //si un objet est pické, on le sélectionne en sauvegardant sa couleur d'origine
                SELECTED = INTERSECTED;
                SELECTED.currentHex = INTERSECTED.currentHex;
                SELECTED.material.emissive.setHex(colorSelected);

                //mise à jour du menu
                tmpScalex = planeteTITLE.add(SELECTED.scale, 'x', 0, 2);
                tmpScaley = planeteTITLE.add(SELECTED.scale, 'y', 0, 2);
                tmpScalez = planeteTITLE.add(SELECTED.scale, 'z', 0, 2);

                //on recherche l'objet sélectionné parmi tous les éléments des groupes pour trouver les index i et j
                for( var i = 1; i < subGroups.length; ++i) {
                  for( var j = 1; j<subGroups[i].lenght; ++j) {
                    if(SELECTED == subGroups[i][j]) {
                      if (j == 1) {
                        params.vitRotation = rotateVitesseGroup[i];
                        params.distanceRelative = posXGroup[i];
                      }
                      else {
                        params.vitRotation = rotateVitesseGroup[i][j];
                        params.distanceRelative = posXGroup[i][j];
                      }
                      params.rotationZ = groups[i].rotation.z;
                      params.vitAutoRotation = autoRotateFact[i];
                      controllerVitRotation.updateDisplay();
                      controllerDistanceRelative.updateDisplay();
                      controllerRotationZ.updateDisplay();
                      controllerVitAutoRotation.updateDisplay();
                      break;
                    }
                  }
                }
              }

              break;

          }
        });


window.addEventListener('dblclick', function() {

              if(SELECTED) { //on deselectionne le dernier selectionné, si il existe
                SELECTED.material.emissive.setHex( SELECTED.currentHex );
                SELECTED = null;

                //mise à jour du menu
                planeteTITLE.remove(tmpScalex);
                planeteTITLE.remove(tmpScaley);
                planeteTITLE.remove(tmpScalez);
              }   
});     

window.addEventListener('click', function() {
             
              if(INTERSECTED) {
                //si un objet est pické, on le sélectionne en sauvegardant sa couleur d'origine
                SELECTED = INTERSECTED;
                SELECTED.currentHex = INTERSECTED.currentHex;
                SELECTED.material.emissive.setHex(colorSelected);

                //mise à jour du menu
                tmpScalex = planeteTITLE.add(SELECTED.scale, 'x', 0, 2);
                tmpScaley = planeteTITLE.add(SELECTED.scale, 'y', 0, 2);
                tmpScalez = planeteTITLE.add(SELECTED.scale, 'z', 0, 2);

                //on recherche l'objet sélectionné parmi tous les éléments des groupes pour trouver les index i et j
                for( var i = 1; i < subGroups.length; ++i) {
                  for( var j = 1; j<subGroups[i].lenght; ++j) {
                    if(SELECTED == subGroups[i][j]) {
                      if (j == 1) {
                        params.vitRotation = rotateVitesseGroup[i];
                        params.distanceRelative = posXGroup[i];
                      }
                      else {
                        params.vitRotation = rotateVitesseGroup[i][j];
                        params.distanceRelative = posXGroup[i][j];
                      }
                      params.rotationZ = groups[i].rotation.z;
                      params.vitAutoRotation = autoRotateFact[i];
                      controllerVitRotation.updateDisplay();
                      controllerDistanceRelative.updateDisplay();
                      controllerRotationZ.updateDisplay();
                      controllerVitAutoRotation.updateDisplay();
                      break;
                    }
                  }
                }
              }


});        

        document.addEventListener( 'resize', onWindowResize, false );
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );

      }
      
      function startTravel() {
        var update = function() {
          chatPERCHE.position = current.position;
        }
        var current = chatPERCHE.position;
        var target = currentDestination.position;

        var tween = new TWEEN.Tween(current).to(target, params.timeTravel)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(update);
        tween.start();
      }

      function onDocumentMouseMove( event ) {
        event.preventDefault();
        mousepicking.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mousepicking.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        console.log(event.clientX);
      }

      function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        // Perspective
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );  
      }

      function onDocumentMouseMove(event) {
        var diffX, diffY;
        diffX = mouse.x - (event.clientX - windowHalfX);
        diffY = mouse.y - (event.clientY - windowHalfY);
        if(params.rotateCam) {
          camera.rotation.x += diffY * params.sensibility_mouse;
          camera.rotation.y += diffX * params.sensibility_mouse;
        }
        mouse.x = (event.clientX - windowHalfX);
        mouse.y = (event.clientY - windowHalfY);

        event.preventDefault();
        mousepicking.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mousepicking.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      }



      function computeMovement() {
        //application des transformations sur les groupes;
        for( var i = 1; i< groups.length; ++i){

        //rotation autour du soleil
        groups[i].position.x = Math.cos( THREE.Math.degToRad(iteration)*rotateVitesseGroup[i]) * posXGroup[i];
        groups[i].position.z = Math.sin( THREE.Math.degToRad(iteration)*rotateVitesseGroup[i]) * posXGroup[i];
        
        }

        //application des transformations sur les éléments des groupes
        for( var i = 1; i< subGroups.length; ++i){
          //application de l'autorotation, uniquement sur les objets planète
          subGroups[i][1].rotation.y = subGroups[i][1].rotation.y + autoRotateFact[i]; 
          autoRotateFact
          for( var j = 1; j<subGroups[i].length; ++j){
            //rotation autour de la planète mère du groupe
            subGroups[i][j].position.x = Math.cos(THREE.Math.degToRad(iteration*rotateVitesseElt[i][j])) 
                             * posXElementGroup[i][j];
            subGroups[i][j].position.z = Math.sin(THREE.Math.degToRad(iteration*rotateVitesseElt[i][j])) 
                             * posXElementGroup[i][j];
            subGroups[4][3].position.y = 12;
            subGroups[4][3].position.z = 12;
          }
        }

        //gestion des lumières
        dLightHelper.update();
        if(params.clignote) {
          if(iteration%30 > 15) {
            spotlight.intensity = 100;
            pointLight.intensity = 100;
          }
          else{
            spotlight.intensity = 0;
            pointLight.intensity = 0;
          }
        }
        iteration = iteration+1;
        //else {
          //spotlight.power = defaultPower;
          //pointLight.power = defaultPower;
        //}

        //si on est arrivé à destination, on recommence le voyage
        if(chatPERCHE.position.x == currentDestination.position.x && chatPERCHE.position.y == currentDestination.position.y && chatPERCHE.position.z == currentDestination.position.z) {
          //on intervertit la destination
          if(currentDestination == neptune)
            currentDestination = pluton;
          else
            currentDestination = neptune;
          startTravel();
        }
      }

      function animate() {
         requestAnimationFrame( animate );
         if(!params.pause) {
        computeMovement();
        iteration = iteration+1;
        TWEEN.update();
       }

        //picking
        raycaster.setFromCamera( mousepicking, camera );
        var intersects = raycaster.intersectObjects( object );
        if ( intersects.length > 0 ) {
          if ( INTERSECTED != intersects[ 0 ].object && SELECTED != intersects[ 0 ].object ) {
            if ( INTERSECTED )
            INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( colorPick );
          }
        } else {
          if ( INTERSECTED && SELECTED != INTERSECTED ) 
            INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
          INTERSECTED = null;
        }

        TWEEN.update();
        renderer.render( scene, camera );
    }

  animate();       