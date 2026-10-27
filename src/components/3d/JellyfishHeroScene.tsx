'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function JellyfishHeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let animationFrameId: number;
    const startTime = performance.now();

    // Scene & Deep Oceanic Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010814, 0.04);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.5, 7.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // ==========================================
    // 1. LIGHTING & VOLUMETRIC GOD RAYS
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0x04192e, 2.2);
    scene.add(ambientLight);

    // Sunlight from ocean surface piercing down
    const surfaceSun = new THREE.DirectionalLight(0x00f0ff, 3.8);
    surfaceSun.position.set(3, 10, 5);
    scene.add(surfaceSun);

    // Bioluminescent deep lights
    const bioPointLight = new THREE.PointLight(0x00ffb3, 4.5, 14);
    bioPointLight.position.set(0, 1.5, 2);
    scene.add(bioPointLight);

    const coralGlowLight = new THREE.PointLight(0xff0066, 3.5, 12);
    coralGlowLight.position.set(-2, -3, 0);
    scene.add(coralGlowLight);

    // Volumetric God Rays (Angled light cone descending from surface)
    const rayGeo = new THREE.CylinderGeometry(0.8, 3.5, 16, 16, 1, true);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.065,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const godRay1 = new THREE.Mesh(rayGeo, rayMat);
    godRay1.position.set(1.5, 3, -1);
    godRay1.rotation.z = -0.15;
    scene.add(godRay1);

    const godRay2 = new THREE.Mesh(rayGeo, rayMat);
    godRay2.position.set(-2.5, 4, -2);
    godRay2.rotation.z = 0.22;
    godRay2.scale.set(0.7, 1, 0.7);
    scene.add(godRay2);

    // ==========================================
    // 2. REALISTIC 3D JELLYFISH
    // ==========================================
    const jellyfishGroup = new THREE.Group();

    // 2a. Outer Bell Dome (Translucent with hydro-deformation)
    const bellRadius = 1.45;
    const bellSegmentsW = 64;
    const bellSegmentsH = 48;
    const bellGeometry = new THREE.SphereGeometry(
      bellRadius,
      bellSegmentsW,
      bellSegmentsH,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.52
    );

    // Save baseline positions for morphing
    const posAttr = bellGeometry.attributes.position;
    const originalPositions = posAttr.array.slice();

    const bellMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00d9ff,
      emissive: 0x00334d,
      emissiveIntensity: 0.9,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.88,
      ior: 1.34,
      transparent: true,
      opacity: 0.8,
      thickness: 1.5,
      side: THREE.DoubleSide,
    });

    const bellMesh = new THREE.Mesh(bellGeometry, bellMaterial);
    bellMesh.rotation.x = Math.PI; // Face downward
    jellyfishGroup.add(bellMesh);

    // 2b. Inner Bell Mantle (Subsurface Glow Layer)
    const innerBellGeo = new THREE.SphereGeometry(
      bellRadius * 0.88,
      32,
      24,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.48
    );
    const innerBellMat = new THREE.MeshStandardMaterial({
      color: 0x00ffb3,
      emissive: 0x00d9ff,
      emissiveIntensity: 1.8,
      transparent: true,
      opacity: 0.45,
      roughness: 0.2,
      side: THREE.BackSide,
    });
    const innerBellMesh = new THREE.Mesh(innerBellGeo, innerBellMat);
    innerBellMesh.rotation.x = Math.PI;
    jellyfishGroup.add(innerBellMesh);

    // 2c. Inner Horseshoe Gonad Organs (Bioluminescent Pink/Violet)
    const gonadsGroup = new THREE.Group();
    const gonadGeo = new THREE.TorusGeometry(0.28, 0.09, 12, 24, Math.PI * 1.5);
    const gonadMat = new THREE.MeshStandardMaterial({
      color: 0xff0088,
      emissive: 0xff0066,
      emissiveIntensity: 3.2,
      roughness: 0.25,
      transparent: true,
      opacity: 0.9,
    });

    for (let g = 0; g < 4; g++) {
      const gMesh = new THREE.Mesh(gonadGeo, gonadMat);
      const angle = (g / 4) * Math.PI * 2;
      gMesh.position.set(Math.cos(angle) * 0.45, -0.25, Math.sin(angle) * 0.45);
      gMesh.rotation.x = Math.PI / 2;
      gMesh.rotation.z = angle + Math.PI / 4;
      gonadsGroup.add(gMesh);
    }
    jellyfishGroup.add(gonadsGroup);

    // 2d. Flowing Oral Arms (Serpentine center ribbons)
    const oralArmCount = 4;
    const oralArms: { line: THREE.Line; angle: number; length: number }[] = [];

    for (let a = 0; a < oralArmCount; a++) {
      const angle = (a / oralArmCount) * Math.PI * 2;
      const armLength = 3.8;
      const armSegments = 32;
      const points: THREE.Vector3[] = [];

      for (let s = 0; s < armSegments; s++) {
        points.push(new THREE.Vector3(0, -(s / armSegments) * armLength, 0));
      }

      const armGeo = new THREE.BufferGeometry().setFromPoints(points);
      const armMat = new THREE.LineBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.85,
        linewidth: 3,
      });

      const armLine = new THREE.Line(armGeo, armMat);
      armLine.position.set(Math.cos(angle) * 0.25, -0.2, Math.sin(angle) * 0.25);
      jellyfishGroup.add(armLine);
      oralArms.push({ line: armLine, angle, length: armLength });
    }

    // 2e. Trailing Fine Tentacles (32 perimeter filaments)
    const tentacleCount = 28;
    const tentacles: { line: THREE.Line; baseAngle: number; length: number; speedOffset: number }[] = [];

    for (let t = 0; t < tentacleCount; t++) {
      const baseAngle = (t / tentacleCount) * Math.PI * 2;
      const length = 4.2 + (t % 3) * 0.9;
      const segments = 28;
      const points: THREE.Vector3[] = [];

      for (let s = 0; s < segments; s++) {
        points.push(new THREE.Vector3(0, -(s / segments) * length, 0));
      }

      const tGeo = new THREE.BufferGeometry().setFromPoints(points);
      const isViolet = t % 2 === 0;

      const tMat = new THREE.LineBasicMaterial({
        color: isViolet ? 0x00f0ff : 0xff3399,
        transparent: true,
        opacity: isViolet ? 0.6 : 0.45,
        linewidth: 1,
      });

      const tLine = new THREE.Line(tGeo, tMat);
      const radiusAtRim = 1.15 + (t % 2) * 0.15;
      tLine.position.set(
        Math.cos(baseAngle) * radiusAtRim,
        -0.1,
        Math.sin(baseAngle) * radiusAtRim
      );

      jellyfishGroup.add(tLine);
      tentacles.push({
        line: tLine,
        baseAngle,
        length,
        speedOffset: t * 0.25,
      });
    }

    jellyfishGroup.position.set(1.6, 0.4, 0);
    scene.add(jellyfishGroup);

    // ==========================================
    // 3. UNDERWATER CORAL REEF BASE & ANEMONES
    // ==========================================
    const reefGroup = new THREE.Group();
    reefGroup.position.set(0, -4.5, -1);

    // Coral branches and polyp clusters
    for (let c = 0; c < 14; c++) {
      const coralCol = c % 2 === 0 ? 0x00ffb3 : 0xff0066;
      const coralGeo = new THREE.ConeGeometry(0.35 + (c % 3) * 0.15, 1.8 + (c % 2) * 0.6, 6);
      const coralMat = new THREE.MeshStandardMaterial({
        color: coralCol,
        emissive: coralCol,
        emissiveIntensity: 0.6,
        roughness: 0.4,
      });
      const coralMesh = new THREE.Mesh(coralGeo, coralMat);
      coralMesh.position.set(
        (c - 7) * 1.1 + (Math.random() - 0.5) * 0.4,
        0.6 + (c % 3) * 0.3,
        -1 + (c % 2) * 0.8
      );
      coralMesh.rotation.z = (Math.random() - 0.5) * 0.35;
      reefGroup.add(coralMesh);
    }
    scene.add(reefGroup);

    // ==========================================
    // 4. SCHOOLING 3D TROPICAL FISH
    // ==========================================
    const fishGroup = new THREE.Group();
    const fishCount = 8;
    const fishList: {
      group: THREE.Group;
      speed: number;
      orbitRadius: number;
      baseAngle: number;
      elevation: number;
    }[] = [];

    for (let f = 0; f < fishCount; f++) {
      const fGroup = new THREE.Group();
      const isClownfish = f % 2 === 0;

      // Fish body
      const bodyGeo = new THREE.ConeGeometry(0.12, 0.48, 8);
      bodyGeo.rotateZ(Math.PI / 2);

      const bodyMat = new THREE.MeshStandardMaterial({
        color: isClownfish ? 0xff6600 : 0x0066ff,
        emissive: isClownfish ? 0x662200 : 0x002266,
        emissiveIntensity: 0.7,
        roughness: 0.3,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      fGroup.add(body);

      // Tail fin
      const tailGeo = new THREE.ConeGeometry(0.09, 0.22, 4);
      tailGeo.rotateZ(-Math.PI / 2);
      const tailMat = new THREE.MeshStandardMaterial({
        color: isClownfish ? 0xffffff : 0xffcc00,
      });
      const tail = new THREE.Mesh(tailGeo, tailMat);
      tail.position.x = -0.32;
      fGroup.add(tail);

      fGroup.scale.set(0.85, 0.85, 0.85);
      fishGroup.add(fGroup);

      fishList.push({
        group: fGroup,
        speed: 0.4 + (f % 3) * 0.15,
        orbitRadius: 4.2 + (f % 4) * 0.9,
        baseAngle: (f / fishCount) * Math.PI * 2,
        elevation: -1.2 + (f % 3) * 1.1,
      });
    }
    scene.add(fishGroup);

    // ==========================================
    // 5. MARINE PARTICLES & SPECULAR BUBBLES
    // ==========================================
    const particleCount = 500;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 18;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0x88ffff,
      size: 0.075,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const marineSnow = new THREE.Points(pGeo, pMat);
    scene.add(marineSnow);

    // Specular Bubbles
    const bubbleCount = 38;
    const bubbles: { mesh: THREE.Mesh; speed: number; wobbleRate: number; seed: number }[] = [];
    const bGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const bMat = new THREE.MeshPhysicalMaterial({
      color: 0xccffff,
      roughness: 0.05,
      transmission: 0.95,
      transparent: true,
      opacity: 0.75,
      ior: 1.15,
    });

    for (let b = 0; b < bubbleCount; b++) {
      const bMesh = new THREE.Mesh(bGeo, bMat);
      const scale = 0.35 + Math.random() * 0.95;
      bMesh.scale.set(scale, scale, scale);
      bMesh.position.set(
        (Math.random() - 0.5) * 12,
        -6 + Math.random() * 12,
        (Math.random() - 0.5) * 6
      );
      scene.add(bMesh);
      bubbles.push({
        mesh: bMesh,
        speed: 0.016 + Math.random() * 0.028,
        wobbleRate: 2 + Math.random() * 3,
        seed: Math.random() * 10,
      });
    }

    // ==========================================
    // 6. INTERACTIVE CURSOR & SCROLL
    // ==========================================
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = nx * 0.85;
      mouse.targetY = ny * 0.65;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    setIsLoaded(true);

    // ==========================================
    // 7. CINEMATIC ANIMATION LOOP
    // ==========================================
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const elapsedTime = (currentTime - startTime) * 0.001; // In seconds

      // Damped Cursor follow
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Parallax camera adjustments
      camera.position.x = mouse.x * 0.55;
      camera.position.y = 0.5 + mouse.y * 0.4 - Math.min(scrollY * 0.002, 3);
      camera.lookAt(0, -Math.min(scrollY * 0.0015, 2), 0);

      // --- Pulsing Jellyfish Hydrodynamics ---
      const pulseSpeed = 2.4;
      const pulsePhase = elapsedTime * pulseSpeed;
      const pulseCycle = Math.sin(pulsePhase);
      const isContracting = Math.cos(pulsePhase) > 0;
      const powerFactor = Math.max(0, pulseCycle);

      // Upward propulsion impulse
      const impulseY = isContracting
        ? 0.32 * Math.sin(pulsePhase)
        : -0.14 * Math.abs(Math.sin(pulsePhase * 0.5));

      jellyfishGroup.position.y = 0.35 + impulseY + Math.sin(elapsedTime * 0.9) * 0.22;
      jellyfishGroup.position.x = 1.5 + mouse.x * 0.6 + Math.cos(elapsedTime * 0.6) * 0.25;

      // Natural tilt and turn toward mouse direction
      jellyfishGroup.rotation.z = -mouse.x * 0.28 + Math.sin(elapsedTime * 0.8) * 0.06;
      jellyfishGroup.rotation.x = mouse.y * 0.22 + Math.cos(elapsedTime * 0.7) * 0.06;
      jellyfishGroup.rotation.y = elapsedTime * 0.12;

      // Bell Vertex Deformation (Contract crown & expand skirt)
      const positions = bellGeometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];
        const oz = originalPositions[i * 3 + 2];

        const rimWeight = Math.max(0, 1 - oy / (bellRadius * 0.52));
        const contraction = 1.0 - powerFactor * 0.32 * rimWeight;
        const skirtFlare = 1.0 + powerFactor * 0.2 * (1 - rimWeight);

        positions.setXYZ(
          i,
          ox * contraction,
          oy * skirtFlare,
          oz * contraction
        );
      }
      bellGeometry.computeVertexNormals();
      bellGeometry.attributes.position.needsUpdate = true;

      // Synchronized Bioluminescent Glow Pulse
      bellMaterial.emissiveIntensity = 0.55 + Math.sin(pulsePhase) * 0.5;
      innerBellMat.emissiveIntensity = 1.2 + Math.sin(pulsePhase) * 1.0;
      gonadMat.emissiveIntensity = 2.0 + Math.sin(pulsePhase) * 1.8;
      bioPointLight.intensity = 3.5 + Math.sin(pulsePhase) * 2.0;

      // Flowing Oral Arms wave dynamics
      oralArms.forEach((arm, idx) => {
        const pts = arm.line.geometry.attributes.position;
        const total = pts.count;
        for (let j = 1; j < total; j++) {
          const ratio = j / total;
          const lag = j * 0.18;
          const waveX = Math.sin(elapsedTime * 2.8 - lag + idx) * 0.28 * ratio;
          const waveZ = Math.cos(elapsedTime * 2.2 - lag + idx) * 0.28 * ratio;
          const y = -ratio * arm.length * (1 - powerFactor * 0.15);
          pts.setXYZ(j, waveX, y, waveZ);
        }
        arm.line.geometry.attributes.position.needsUpdate = true;
      });

      // Trailing Fine Tentacles fluid drag
      tentacles.forEach((t) => {
        const pts = t.line.geometry.attributes.position;
        const total = pts.count;
        for (let j = 1; j < total; j++) {
          const ratio = j / total;
          const lag = j * 0.14;
          const fx = Math.sin(elapsedTime * 3.2 - lag + t.speedOffset) * 0.22 * ratio;
          const fz = Math.cos(elapsedTime * 2.6 - lag + t.speedOffset) * 0.22 * ratio;
          const y = -ratio * t.length * (1 - powerFactor * 0.12);
          pts.setXYZ(j, fx, y, fz);
        }
        t.line.geometry.attributes.position.needsUpdate = true;
      });

      // Drifting Marine Snow
      const pArr = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pArr[i * 3 + 1] -= 0.007;
        pArr[i * 3] += Math.sin(elapsedTime + i) * 0.002;
        if (pArr[i * 3 + 1] < -7) pArr[i * 3 + 1] = 7;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Rising Specular Bubbles
      bubbles.forEach((b) => {
        b.mesh.position.y += b.speed;
        b.mesh.position.x += Math.sin(elapsedTime * b.wobbleRate + b.seed) * 0.009;
        if (b.mesh.position.y > 6.8) {
          b.mesh.position.y = -6.8;
          b.mesh.position.x = (Math.random() - 0.5) * 12;
        }
      });

      // Schooling Tropical Fish Curves
      fishList.forEach((fish) => {
        const angle = elapsedTime * fish.speed * 0.45 + fish.baseAngle;
        const x = Math.cos(angle) * fish.orbitRadius;
        const z = Math.sin(angle) * fish.orbitRadius;
        fish.group.position.set(
          x,
          fish.elevation + Math.sin(elapsedTime * 2.2 + fish.baseAngle) * 0.35,
          z
        );
        fish.group.rotation.y = -angle + Math.PI / 2;
      });

      // Swaying God Rays
      godRay1.rotation.y = elapsedTime * 0.05;
      godRay2.rotation.y = -elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bellGeometry.dispose();
      bellMaterial.dispose();
      innerBellGeo.dispose();
      innerBellMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden pointer-events-none">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        aria-label="Interactive 3D bioluminescent jellyfish underwater ecosystem simulation"
      />

      {/* Caustic & Depth Fog Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#01060e] via-transparent to-[#01060e]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#01060e]/30 to-[#01060e] pointer-events-none" />

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#01060e]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono tracking-widest text-cyan-400">
              Initializing 3D Living Ocean...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
