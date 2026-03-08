document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('gltfCanvas');
    const container = document.querySelector('.banner-canvas-container');

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();

    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(5, 5, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.8);
    directionalLight2.position.set(-5, 3, 8);
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0x88ccff, 1.5);
    directionalLight3.position.set(0, -5, -10);
    scene.add(directionalLight3);

    const pointLight1 = new THREE.PointLight(0xffffff, 1.5, 50);
    pointLight1.position.set(0, 10, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1.0, 50);
    pointLight2.position.set(10, 0, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 1.0, 50);
    pointLight3.position.set(-10, 0, 5);
    scene.add(pointLight3);

    const spotLight = new THREE.SpotLight(0xffffff, 2.0);
    spotLight.position.set(0, 10, -10);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 1;
    scene.add(spotLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    let model;
    const loader = new THREE.GLTFLoader();
    loader.load(
        'logo.glb',
        function (gltf) {
            model = gltf.scene;
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.needsUpdate = true;
                        child.material.emissiveIntensity = 0.3;
                    }
                }
            });
            model.scale.set(7, 7, 7); 
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            
            model.position.x += 0; 
            model.position.y += 0; 

            scene.add(model);
        },
        undefined,
        function (error) {
            console.error('Error loading GLB:', error);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('3D Model Not Found', canvas.width / 2, canvas.height / 2);
        }
    );

    function resizeRenderer() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (canvas.width !== w || canvas.height !== h) {
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        if (model) {
            model.rotation.y += 0.008;
        }
        resizeRenderer();
        renderer.render(scene, camera);
    }

    resizeRenderer();
    animate();
});
