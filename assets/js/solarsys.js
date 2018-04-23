      

          // Définition des variables de base

      		var scene = new THREE.Scene();
      		var camera = new THREE.PerspectiveCamera( 120, window.innerWidth/window.innerHeight, 1, 1000 );
            camera.position.z = 60; 

          var renderer = new THREE.WebGLRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight ); 

          var clock = new THREE.Clock();
          var time = 0;

      		document.body.appendChild( renderer.domElement );

          // Définition des texture

          var textureAPP = new THREE.TextureLoader();

          var texSoleil = textureAPP.load( "assets/textures/soleil.jpg");
            texSoleil.mapping = THREE.SphericalReflectionMapping;

          var texTerre = textureAPP.load( "assets/textures/terre.jpg");
            texTerre.mapping = THREE.SphericalReflectionMapping;

          var texLune = textureAPP.load( "assets/textures/lune.jpg");
            texLune.mapping = THREE.SphericalReflectionMapping;

          var texPelage = textureAPP.load( "assets/textures/pelage2.jpg");
            texPelage.mapping = THREE.SphericalReflectionMapping;   

          // Ajout du BackGround

          var textureLoader = new THREE.TextureLoader();
          textureLoader.load('assets/textures/univers.jpg', function (texture){
            texture.mapping = THREE.UVMapping;
            scene.background = texture;
          });            

            // Création du Soleil

      			var geometry = new THREE.SphereGeometry( 22, 34, 34 );
      			var material = new THREE.MeshBasicMaterial({ map: texSoleil});
      			var soleil = new THREE.Mesh( geometry, material );
      				scene.add( soleil ); 

            // Création des lumières

            var ambient = new THREE.AmbientLight( 0xffffff );
              soleil.add(ambient);

            var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
              light.position.set( -80, 80, 80 );
              soleil.add(light);

            var pointlight = new THREE.PointLight( 0xffffff, 0.8 );
              pointlight.position.x = ( 0, 0, 0 );
              soleil.add(pointlight);
      

            // Création du groupe "Système Terre"

            var earthSYSTEM = new THREE.Group();
            soleil.add( earthSYSTEM );  

            // Création de la terre   

      			var geometry = new THREE.SphereGeometry( 7, 34, 34 );
      			var material = new THREE.MeshPhongMaterial({ map: texTerre, shininess: 70});
      			var terre = new THREE.Mesh(geometry, material);
      			earthSYSTEM.add(terre);     

      			var sun = new THREE.Object3D();
      			earthSYSTEM.add(sun);      

      			var geometry = new THREE.SphereGeometry( 1,20,20 );
      			var material = new THREE.MeshPhongMaterial({ map: texLune, shininess: 70});
      			var moon = new THREE.Mesh(geometry, material);
      			sun.add(moon); 

            var moonlight = new THREE.SpotLight( 0xffffff, 0.8);
            moon.add(moonlight);

            var sunlight = new THREE.SpotLight( 0xffffff, 0.8);
            soleil.add(sunlight);            

            // Importation du Chat Cosmique 

            var loader = new THREE.ObjectLoader();
            loader.load(
              "assets/objets/cat.json",
              function( group ){
                mesh = group.children[0];
                mesh.material = new THREE.MeshBasicMaterial({map: texPelage, flatShading : false});
                scene.add( mesh );
              },
              function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
              },
              function ( err ) {
                console.error( 'An error happened' );
              }
            ); 


            // Animation des objets
           

      			var animate = function () {
        			requestAnimationFrame( animate );


            
      				var delta = clock.getDelta();

              mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.04;
              mesh.position.x = 1;
              mesh.position.y = -25;
              mesh.position.z = 35;               

        			var earthTime= clock.getElapsedTime() * -0.1;
        			earthSYSTEM.position.x = Math.cos( earthTime ) * 60;
        			earthSYSTEM.position.z = Math.sin( earthTime ) * 60; 
              earthSYSTEM.rotation.y = earthSYSTEM.rotation.y + ( THREE.Math.degToRad(-1));
              earthSYSTEM.rotation.x = ( THREE.Math.degToRad(-20)); 


					    var sunTime= clock.getElapsedTime() * -2;
        			sun.position.x = Math.cos( sunTime ) * 10;
        			sun.position.z = Math.sin( sunTime ) * 10; 

              mesh.rotation.y = mesh.rotation.y + ( THREE.Math.degToRad(-1));
              mesh.rotation.x = ( THREE.Math.degToRad(-20)); 
              mesh.rotation.z = ( THREE.Math.degToRad(10));               

        			renderer.render(scene, camera);
      			};

      			animate();	