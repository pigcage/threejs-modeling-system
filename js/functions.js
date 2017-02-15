//菜单栏各功能实现
// cmd = new CMD(cmdInput,execute,cmdWindow);	//命令窗口

//1、基本几何体选择
function modelSelector(mdType) {
	if(istransforming){
		transformControls.removeEventListener('change');
		scene.remove(transformControls);
		transformControls.update();
		transformControls.detach(transformControls.object);
		istransforming = false;
		render();
	}
	scene.remove(rollOverMesh);
	isModelSelected = true;
	switch (mdType) {
	case "cube":
		typeOfModel = mdType;
		rollOverMesh = createModel(typeOfModel,true);
		break;
	case "sphere":
		typeOfModel = mdType;
		rollOverMesh = createModel(typeOfModel,true);
		break;
	case "cylinder":
		typeOfModel = mdType;
		rollOverMesh = createModel(typeOfModel,true);
		break;
	case "torus":
		typeOfModel = mdType;
		rollOverMesh = createModel(typeOfModel,true);
	}
	scene.add(rollOverMesh);
	render();
}

//导出导入
function saveModel(){
	// try {
		//scene.remove(rollOverMesh);
		var fileName = prompt("请输入当前场景的存储文件名：", "scene");
		var exporter = new THREE.OBJExporter();
		exporter.parse(scene);
		// var exporter = new THREE.SceneExporter();
		// var sceneJSON = JSON.stringify(exporter.parse(scene));
		// var previousFile = localStorage.getItem(fileName);
		
		// if(!previousFile){
			// localStorage.setItem(fileName, sceneJSON);
			// alert("场景储存成功！");
		// } else {
			// if (confirm("文件" + fileName + "已存在，确定覆盖？")) {
				// localStorage.setItem(fileName, sceneJSON);
				// alert("场景储存成功！");
			// } else {
				// return;
			// }
		// }
	// }
	// catch(err){
		// alert("储存出错，当前场景未保存");
	// }
}
function loadModel(){
	var nameArray = new Array();
	var obj;
	for (i = 0; i<localStorage.length;i++){
		obj = localStorage.key(i).split(",");
		obj = obj[0];
		nameArray.push(obj);
	}
	for (i in nameArray){
		var option = document.createElement("option");
		option.setAttribute("value",nameArray[i]);
		option.innerHTML = nameArray[i];
		document.getElementById("fileNames").appendChild(option);
	}
	var bg = document.createElement("div");
	bg.className = "bg";
	document.body.appendChild(bg);
	document.getElementById("loadWindow").style.display = "block";
	
}
function cancleLoad(){
	document.getElementById("loadWindow").style.display = "none";
	document.body.removeChild(document.querySelector(".bg"));
}
function confirmLoad(){
	var fileName = document.getElementById("fileNames").value;
	var json = (localStorage.getItem(fileName));
	var sceneLoader = new THREE.SceneLoader();
	sceneLoader.parse(JSON.parse(json),function(e){
		scene = e.scene;
	},".");
}
//命令提示窗口封装
CMD = function(inp,exe,win){
	this.win = win;
	//更新窗口
	this.update = function(text){
		this.win.innerHTML = this.win.innerHTML + "<p>" + text + "</p>";
	}
	
	//输入内容及其状态
	this.input = null;
	this.isNumber = false;
	
	//错误信息
	this.errorMessage = function(){
		self.update("非法输入，请重新输入：");
	}
	
	var self = this;
	
	this.getArray = function(){
		var arr = self.inp.value;
		arr = arr.slice(" ");
		self.update(arr);
	}
}
//F:\SC2\SC2\SC2Manager\Map
//E:\备份\Adobe Photoshop CC\Adobe CC\Deployment
//D:\openpilot\bin