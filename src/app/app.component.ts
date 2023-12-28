import { Component } from '@angular/core';
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

	public controls: any;

	ngOnInit(){}

	ngAfterViewInit(){
		this.pointOfLight.position.set(0,10,10);
		
		this.scene.add(this.pointOfLight, this.ambientLight);
		this.scene.add(this.lightHelper, this.gridHelper);

		this.camera.position.setZ(30);

		this.createForm();
		this.render();
	}

	private createForm(){
		let geo = new THREE.TorusKnotGeometry(10, 3, 100, 16);
		let mat = new THREE.MeshStandardMaterial({color: 0xff0000});
		this.form = new THREE.Mesh(geo, mat);

		this.scene.add(this.form);
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
}
