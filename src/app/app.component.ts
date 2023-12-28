import { Component, HostListener } from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent{
	title = '3D-Angular';

	public scene = new THREE.Scene();
	public camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	public pointOfLight = new THREE.PointLight(0xffffff);
	public ambientLight = new THREE.AmbientLight(0xffffff);

	private lightHelper = new THREE.PointLightHelper(this.pointOfLight);
	private gridHelper = new THREE.GridHelper(200,50);

	public renderer: any;

	public form: any;
	public form2: any;

	public controls: any;

	ngOnInit(){}

	ngAfterViewInit(){
		this.pointOfLight.position.set(10,10,10);
		this.pointOfLight.decay = 0;
		this.pointOfLight.distance = 50;
		
		this.scene.add(this.pointOfLight, this.ambientLight);
		this.scene.add(this.lightHelper, this.gridHelper);

		this.camera.position.setZ(30);

		this.createForm();
		this.populateStars();
		this.setBackground();
		this.createSun();
		this.render();
	}

	private createForm(){
		let geo = new THREE.TorusKnotGeometry(10, 3, 100, 16);
		let mat = new THREE.MeshStandardMaterial({color: 0xff0000});
		this.form = new THREE.Mesh(geo, mat);

		this.scene.add(this.form);
	}

	private addStar(): any{
		let geo = new THREE.SphereGeometry(0.25, 24, 24);
		let mat = new THREE.MeshStandardMaterial({color: 0xffffff});
		let star = new THREE.Mesh(geo, mat);

		let x = THREE.MathUtils.randFloatSpread(100);
		let y = THREE.MathUtils.randFloatSpread(100);
		let z = THREE.MathUtils.randFloatSpread(100);

		star.position.set(x,y,z);
		this.scene.add(star);
	}

	private populateStars(){
		for(let i=0; i < 200; i++){
			this.addStar();
		}
	}

	private setBackground(){
		let txt = new THREE.TextureLoader().load('../assets/img/Space-Background-Image-3.jpg');
		this.scene.background = txt;
	}

	private createSun(){
		let txt = new THREE.TextureLoader().load('../assets/img/2k_sun.jpg');
		let nrm = new THREE.TextureLoader().load('../assets/img/normal_sun.jpg');
		this.form2 = new THREE.Mesh(
			new THREE.SphereGeometry(20, 32, 32),
			new THREE.MeshStandardMaterial({
				map: txt,
				normalMap: nrm
			})
		)

		this.form2.position.z = 30;
		this.form2.position.setX(-10);

		this.scene.add(this.form2);
	}

	private render(): any{
		this.renderer = new THREE.WebGLRenderer({
			canvas: document.querySelector('#canvas'),
		});

		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		let comp: AppComponent = this;
		(function renderizar(){
			requestAnimationFrame(renderizar);
			
			comp.form.rotation.x += 0.001;
			comp.form.rotation.y += 0.005;
			comp.form.rotation.z += 0.001;
			
			comp.controls.update();

			comp.renderer.render(comp.scene, comp.camera);
		}());
	}

	@HostListener('window:scroll', ['$event'])
	public listenMove(event: any){
		this.moveCamera();
	}

	private moveCamera(): any{
		let t = document.body.getBoundingClientRect().top;

		this.form2.rotation.x += 0.05;
		this.form2.rotation.y += 0.075;
		this.form2.rotation.z += 0.05;

		this.camera.position.z = t * -0.01;
		this.camera.position.x = t * -0.0002;
		this.camera.position.y = t * -0.0002;
	}
}
