/* ThreeJS对象 */

var scene, renderer, camera, orbitControls, transformControls; //基本组件
var mouse, raycaster; //投射器
var rollOverGeo, rollOverMaterial, rollOverMesh; //预览几何体
var objects = []; //所有模型对象的存储数组，第零位是初始可放置平面
var isShiftDown = false; //删除标记，按住Shift时点击为删除
var isCtrlDown = false; //选择标记，按住Ctrl时选取当前模型对象
var isModelSelected = true; //选择标记，在menu中选择了任意几何体时启用。TODO: 此处后面要改为false
var istransforming = false; //变换标记，场景中生成一个变换组件时设为true，组件取消后重置为false
var typeOfModel = "cube"; //当前选择的几何体类型
init();
var mainCanvas = document.querySelector('canvas'); //主场景所在canvas



//场景渲染函数
function render() {
	renderer.render(scene, camera);
}

//初始化
function init() {
	if (!Detector.webgl)
		Detector.addGetWebGLMessage();
	
	//初始化scene, camera, renderer
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, parseInt(.75 * document.body.clientWidth) / (document.body.clientHeight - 48), 1, 2700);
	camera.position.set(0, 800, 1300);
	camera.lookAt(new THREE.Vector3());

	renderer = new THREE.WebGLRenderer({
			antialias: true
		});
	renderer.setClearColor(0xf0f0f0);
	renderer.setSize(parseInt(.75 * document.body.clientWidth), document.body.clientHeight - 48);
	mainCanvasDiv.appendChild(renderer.domElement);

	//OrbitControls相机控制组件
	orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
	orbitControls.maxDistance = 2000;

	orbitControls.addEventListener('change', render);
	
	//TransformControls几何体变换控制组件
	
	
	//坐标系
	var basicAxes = new THREE.AxisHelper(1000);
	scene.add(basicAxes);

	//基础网格系统
	var size = 500,
	step = 50;
	var geometry = new THREE.Geometry();
	for (var i =  - size; i <= size; i += step) {
		geometry.vertices.push(new THREE.Vector3( - size, 0, i));
		geometry.vertices.push(new THREE.Vector3(size, 0, i));
		geometry.vertices.push(new THREE.Vector3(i, 0,  - size));
		geometry.vertices.push(new THREE.Vector3(i, 0, size));
	}
	var material = new THREE.LineBasicMaterial({
			color: 0x000000,
			opacity: 0.2,
			transparent: true
		});
	line = new THREE.LineSegments(geometry, material);
	scene.add(line);

	//场景光照
	var ambientLight = new THREE.AmbientLight(0x606060);
	scene.add(ambientLight);
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 0.75, 0.5).normalize();
	scene.add(directionalLight);

	//当前选中的几何体预览
	rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
	rollOverMaterial = new THREE.MeshLambertMaterial({
			color: 0xff0000,
			opacity: 0.5,
			transparent: true
		});
	rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
	rollOverMesh.position.y = 25;
	scene.add(rollOverMesh);
	//console.log(rollOverMesh.material.color.getHex());

	//鼠标及投射器
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	//界定可放置的平面
	var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
	geometry.rotateX( - Math.PI / 2);
	plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
				visible: false
			}));
	scene.add(plane);
	objects.push(plane);

	//事件监听器
	window.addEventListener('resize', onWindowResize, false);
	renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
	renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('keydown', onDocumentKeyDown, false);
	document.addEventListener('keyup', onDocumentKeyUp, false);

	render();
}

//窗口大小变化时，重新渲染场景
function onWindowResize() {
	var height = window.innerHeight;
	if (height < 600)
		height = 600;
	container.style.height = height - 48 + "px";
	var width = window.innerWidth;
	renderer.setSize(width, height - 48);
	camera.aspect = width / (height - 48);
	//重新渲染一次避免右边滚动白条的产生
	width = window.innerWidth;
	renderer.setSize(.75 * width, height - 48);
	camera.aspect = .75 * width / (height - 48);
	camera.updateProjectionMatrix();
}

//鼠标移动时，预览几何体随动
function onDocumentMouseMove(event) {
	//不要执行与事件关联的默认动作（如存在。避免操作冲突）
	event.preventDefault();

	//判定鼠标投射位置
	var mousePosInCanvas = getMousePositionInCanvas(mainCanvas, event);
	mouse.x = (mousePosInCanvas.x / 0.75 / window.innerWidth) * 2 - 1;
	mouse.y =  - (mousePosInCanvas.y / mousePosInCanvas.height) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);

	//新的预览几何体位置
	//TODO:只能生成在整格的位置
	var intersects = raycaster.intersectObjects(objects);
	if (intersects.length > 0) {
		var intersect = intersects[0];
		rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
		rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
	}
	render();
}
function getMousePositionInCanvas(canvas, e) {
	var rect = canvas.getBoundingClientRect()
		return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top,
		height: canvas.getAttribute("height")
	}
}

//点击菜单中对应几何体可进入添加几何体模式。此时点击鼠标左键，则生成实际几何体或模型
//点击鼠标右键，当前预览几何体隐藏，退出添加几何体模式
function onDocumentMouseDown(event) {
	event.preventDefault();
	if (event.button == 2) {
		if (istransforming){
			transformControls.removeEventListener('change');
			transformControls.detach(transformControls.object);
			scene.remove(transformControls);
			istransforming = false;
			render();
			return;
		} else {
			document.removeEventListener('mousemove', onDocumentMouseMove, false);
			scene.remove(rollOverMesh);
			isModelSelected = false;
			return;
		}
	}
	var mousePosInCanvas = getMousePositionInCanvas(mainCanvas, event);
	mouse.x = (mousePosInCanvas.x / 0.75 / window.innerWidth) * 2 - 1;
	mouse.y =  - (mousePosInCanvas.y / mousePosInCanvas.height) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	if (isModelSelected) {
		var intersects = raycaster.intersectObjects(objects);
		if (intersects.length > 0) {
			var intersect = intersects[0];
			if (isShiftDown) {
				//删除几何体
				//排除鼠标点到平面的情况
				if (intersect.object != plane) {
					scene.remove(intersect.object);
					objects.splice(objects.indexOf(intersect.object), 1);
				}
			} else {
				//生成几何体
				var voxel = createModel(typeOfModel, false);
				voxel.position.copy(intersect.point).add(intersect.face.normal);
				voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
				scene.add(voxel);
				objects.push(voxel);
			}
			render();
		}
	} else {
		//方块选择模式
		var intersects = raycaster.intersectObjects(objects);
		if (intersects.length > 0) {
			var intersect = intersects[0];
			if (isShiftDown) {
				//删除几何体
				//排除鼠标点到平面的情况
				//TODO: 带datgui的情况下，删除时点边缘似乎会点到plane，第二次点方可删除对象，且后续无法操作
				if (intersect.object != plane) {
					scene.remove(intersect.object);
					objects.splice(objects.indexOf(intersect.object), 1);
					var guiDOM = document.getElementById("guidat");
					if (guiDOM) {
						guiDOM.innerHTML = "";
					}

				} else {
					
					console.log("plane")
				}
			} else if (isCtrlDown) {
				//选取几何体
				if (intersect.object != plane) {
					var guiDOM = document.getElementById("guidat");
					if (guiDOM) {
						guiDOM.innerHTML = "";
					}
					createGUI(intersect.object);
				}
			} else if (!istransforming) {
				//TODO: 绑定变换控制组件到当前几何体
				//console.log(intersect.objects)
				if (intersect.object != plane) {
					transformControls = new THREE.TransformControls( camera, renderer.domElement );
					transformControls.addEventListener( 'change', function(){
						transformControls.update();
						render();
					} );
					transformControls.attach(intersect.object);
					istransforming = true;
					transformControls.setSize(0.5);
					scene.add(transformControls);
				}
			}
		}
	}
}

//监听按键状态
function onDocumentKeyDown(event) {
	switch (event.keyCode) {
	case 16:
		isShiftDown = true;
		break;
	case 17:
		isCtrlDown = true;
		
	//transformControls handlers
	case 81: // Q
		transformControls.setSpace( transformControls.space === "local" ? "world" : "local" );
		break;
	case 18: // Alt
		transformControls.setTranslationSnap( 25 );
		transformControls.setRotationSnap( THREE.Math.degToRad( 15 ) );
		break;

	case 84: // T
		transformControls.setMode( "translate" );
		break;

	case 82: // R
		transformControls.setMode( "rotate" );
		break;

	case 83: // S
		transformControls.setMode( "scale" );
		break;

	case 187:
	case 107: // +, =, num+
		transformControls.setSize( transformControls.size + 0.1 );
		break;

	case 189:
	case 109: // -, _, num-
		transformControls.setSize( Math.max( transformControls.size - 0.1, 0.1 ) );
		break;
	}
}
function onDocumentKeyUp(event) {
	switch (event.keyCode) {
	case 16:
		isShiftDown = false;
		break;
	case 17:
		isCtrlDown = false;
	case 18:
		transformControls.setTranslationSnap( null );
		transformControls.setRotationSnap( null );
		break;
	}
}
