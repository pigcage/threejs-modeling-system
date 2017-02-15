//几何体对象初始化、dat.gui初始化


//总生成函数，创建几何体预览或实物
//参数：当前选择的几何体类型
//		是否为预览几何体：是为true
function createModel(mdType, isPreview) {
	var mesh;
	//转换为透明度
	if (isPreview) {
		isPreview = 0.5;
	} else {
		isPreview = 1;
	}
	switch (mdType) {
	case "cube":
		mesh = create(isPreview, new THREE.CubeGeometry(50, 50, 50));
		break;
	case "sphere":
		mesh = create(isPreview, new THREE.SphereGeometry(25, 50, 50));
		break;
	case "cylinder":
		if(isPreview == 0.5){
			var segR;
			segR = prompt("请输入柱体棱数，范围为3~100的整数，设置较大的值可以趋于圆柱", "6");
			segR = parseInt(segR);
			if(isNaN(segR) || !segR || (segR<3 || segR>100)){
				alert("错误或被终止的输入！")
				return;
			} else {
				mesh = create(isPreview, new THREE.CylinderGeometry(25, 25, 50, segR));
			}
			
		} else {
			mesh = create(isPreview, new THREE.CylinderGeometry(25, 25, 50, rollOverMesh.geometry.parameters.radialSegments));
		}
		break;
	case "torus":
		if(isPreview == 0.5){
			var arr;
			arr = prompt("请依次输入圆环半径、围成圆环的管道半径、管道分段数、管道绕过的角度值、管道侧面数（可选），空格分隔：", "25 10 10 180");
			if(arr = checkArr_Torus(arr)){
				arr[3] = arr[3] * Math.PI /180;
				if(!arr[4]) arr[4] = 8;
				mesh = create(isPreview, new THREE.TorusGeometry(arr[0], arr[1], arr[4], arr[2], arr[3]),true);
			} else {
				alert("错误或被终止的输入！")
				return;
			}
			
		} else {
			//console.log(rollOverMesh.geometry)
			mesh = create(isPreview, new THREE.TorusGeometry(rollOverMesh.geometry.parameters.radius, rollOverMesh.geometry.parameters.tube, rollOverMesh.geometry.parameters.radialSegments, rollOverMesh.geometry.parameters.tubularSegments, rollOverMesh.geometry.parameters.arc),true);
		}
		break;
	}
	mesh.position.y = 25;
	return mesh;
}
//总生成函数，Ctrl选中几何体时，生成对应的dat.GUI界面
//参数：当前选择的几何体
function createGUI(mesh) {
	switch (mesh.geometry.type) {
	case "BoxGeometry":
		createCubeGUI(mesh);
		break;
	case "SphereGeometry":
		createSphereGUI(mesh);
		break;
	case "CylinderGeometry":
		createCylinderGUI(mesh);
		break;
	case "TorusGeometry":
		createTorusGUI(mesh);
		break;
	}
}

//各几何体参数界面初始化
function createCubeGUI(cube) {
	var controls = new function () {

		this.width = cube.geometry.parameters.width;
		this.height = cube.geometry.parameters.height;
		this.depth = cube.geometry.parameters.depth;
		this.x = cube.position.x;
		this.y = cube.position.y;
		this.z = cube.position.z;
		this.redraw = function () {
			scene.remove(cube);
			objects.splice(objects.indexOf(cube), 1);
			cube = create(1, new THREE.CubeGeometry(controls.width, controls.height, controls.depth));
			cube.position.x = controls.x;
			cube.position.y = controls.y;
			cube.position.z = controls.z;
			scene.add(cube);
			objects.push(cube);
			render();
		};
	}

	var gui = new DAT.GUI();
	gui.add(controls, 'width', 0, 500).onChange(controls.redraw);
	gui.add(controls, 'height', 0, 500).onChange(controls.redraw);
	gui.add(controls, 'depth', 0, 500).onChange(controls.redraw);
	gui.add(controls, 'x', -1000, 1000).onChange(controls.redraw);
	gui.add(controls, 'y', -1000, 1000).onChange(controls.redraw);
	gui.add(controls, 'z', -1000, 1000).onChange(controls.redraw);
}
function createSphereGUI(sphere) {
	var controls = new function () {

		this.radius = sphere.geometry.parameters.radius;
		this.x = sphere.position.x;
		this.y = sphere.position.y;
		this.z = sphere.position.z;
		this.redraw = function () {
			scene.remove(sphere);
			objects.splice(objects.indexOf(sphere), 1);
			sphere = create(1, new THREE.SphereGeometry(controls.radius, 50, 50));
			sphere.position.x = controls.x;
			sphere.position.y = controls.y;
			sphere.position.z = controls.z;
			scene.add(sphere);
			objects.push(sphere);
			render();
		};
	}

	var gui = new DAT.GUI();
	gui.add(controls, 'radius', 0, 200).onChange(controls.redraw);
	gui.add(controls, 'x', -1000, 1000).onChange(controls.redraw);
	gui.add(controls, 'y', -1000, 1000).onChange(controls.redraw);
	gui.add(controls, 'z', -1000, 1000).onChange(controls.redraw);
}
function createCylinderGUI(cylinder) {
	var controls = new function () {
		this.radiusTop = cylinder.geometry.parameters.radiusTop;
		this.radiusBottom = cylinder.geometry.parameters.radiusBottom;
		this.height = cylinder.geometry.parameters.height;
		this.radialSegments = parseInt(cylinder.geometry.parameters.radialSegments);
		this.x = cylinder.position.x;
		this.y = cylinder.position.y;
		this.z = cylinder.position.z;
		this.redraw = function () {
			scene.remove(cylinder);
			objects.splice(objects.indexOf(cylinder), 1);
			cylinder = create(1, new THREE.CylinderGeometry(controls.radiusTop, controls.radiusBottom, controls.height, controls.radialSegments));
			cylinder.position.x = controls.x;
			cylinder.position.y = controls.y;
			cylinder.position.z = controls.z;
			scene.add(cylinder);
			objects.push(cylinder);
			render();
		};
	}

	var gui = new DAT.GUI();
	gui.add(controls, 'radiusTop', 0, 500).onChange(controls.redraw);
	gui.add(controls, 'radiusBottom', 0, 500).onChange(controls.redraw);
	gui.add(controls, 'height', 0, 500).onChange(controls.redraw);
	gui.add(controls, 'radialSegments', 3, 30).onChange(controls.redraw);
	gui.add(controls, 'x', -1000, 1000).onChange(controls.redraw);
	gui.add(controls, 'y', -1000, 1000).onChange(controls.redraw);
	gui.add(controls, 'z', -1000, 1000).onChange(controls.redraw);
}
function createTorusGUI(torus) {
	
	var controls = new function () {
		this.radius = torus.geometry.parameters.radius;
		this.tube = torus.geometry.parameters.tube;
		this.radialSegments = torus.geometry.parameters.radialSegments;
		this.tubularSegments = torus.geometry.parameters.tubularSegments;
		this.arc = torus.geometry.parameters.arc * 180 / Math.PI;
		this.x = torus.position.x;
		this.y = torus.position.y;
		this.z = torus.position.z;
		this.rotateX = torus.rotation.x;
		this.rotateY = torus.rotation.y;
		this.rotateZ = torus.rotation.z;
		this.redraw = function () {
			scene.remove(torus);
			objects.splice(objects.indexOf(torus), 1);
			torus = create(1, new THREE.TorusGeometry(controls.radius, controls.tube, controls.radialSegments, controls.tubularSegments, controls.arc * Math.PI / 180),true);
			torus.position.x = controls.x;
			torus.position.y = controls.y;
			torus.position.z = controls.z;
			torus.rotation.x = controls.rotateX;
			torus.rotation.y = controls.rotateY;
			torus.rotation.z = controls.rotateZ;
			scene.add(torus);
			objects.push(torus);
			render();
		};
	}

	var gui = new DAT.GUI();
	gui.add(controls, 'radius', 0, 500).onChange(controls.redraw);
	gui.add(controls, 'tube', 0, 100).onChange(controls.redraw);
	gui.add(controls, 'radialSegments', 2, 80).onChange(controls.redraw);
	gui.add(controls, 'tubularSegments', 2, 80).onChange(controls.redraw);
	gui.add(controls, 'arc', 0, 360).onChange(controls.redraw);
	gui.add(controls, 'x', -1000, 1000).onChange(controls.redraw);
	gui.add(controls, 'y', -1000, 1000).onChange(controls.redraw);
	gui.add(controls, 'z', -1000, 1000).onChange(controls.redraw);
	gui.add(controls, 'rotateX', -Math.PI, Math.PI).onChange(controls.redraw);
	gui.add(controls, 'rotateY', -Math.PI, Math.PI).onChange(controls.redraw);
	gui.add(controls, 'rotateZ', -Math.PI, Math.PI).onChange(controls.redraw);
}
function checkArr_Torus(_arr){
	if(!_arr) return false;
	_arr = _arr.split(" ");
	if(_arr.length != 4 && _arr.length != 5) return false;
	for(i in _arr){
		
		_arr[i] = parseFloat(_arr[i]);
		if(isNaN(_arr[i])) return false;
		if(i == 4) continue;
		if(!_arr[i]) return false;
	}
	if(_arr[0] <= 0 || _arr[1] <= 0 || _arr[2] <= 2 || (_arr[3]<0 || _arr[3]>360) || (!_arr[4] && _arr[4]<2 )) return false;
	return _arr;
}
function create(opa,geo,isDoubleSide){
	var meshGeometry = geo;
	var meshMaterial = new THREE.MeshLambertMaterial({
			color: 0xff0000,
			opacity: opa,
			transparent: true
		});
	if(isDoubleSide) meshMaterial.side = THREE.DoubleSide;
	var mesh = new THREE.Mesh(meshGeometry, meshMaterial);
	console.log(mesh.material.color.getHex());
	return mesh;
}