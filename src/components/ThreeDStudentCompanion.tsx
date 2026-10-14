import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, EyeOff, RotateCcw, Sparkles } from 'lucide-react';

interface ThreeDProps {
  className?: string;
}

export const ThreeDStudentCompanion: React.FC<ThreeDProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [exploded, setExploded] = useState(false);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setIsReducedMotion(true);
      setIsRotating(false);
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 260;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.8);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting Rig (3-point balanced lighting)
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.0); // Teal-cyan key light
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x14b8a6, 2.0, 10); // Soft teal fill
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x6366f1, 2.2); // Indigo rim
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // 4. Procedural 3D Academic Tome & Knowledge Emblem Model
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Main Book Group
    const bookGroup = new THREE.Group();
    rootGroup.add(bookGroup);

    // Materials
    const coverMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Deep Navy Blue
      roughness: 0.35,
      metalness: 0.25,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Warm Academic Gold
      roughness: 0.2,
      metalness: 0.85,
    });

    const tealGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d9488, // NEC Teal
      roughness: 0.25,
      metalness: 0.4,
      emissive: 0x0f766e,
      emissiveIntensity: 0.2,
    });

    const pagesMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Clean Ivory Pages
      roughness: 0.8,
      metalness: 0.05,
    });

    // Book Dimensions: W: 2.2, H: 2.8, Depth: 0.5
    // Pages block
    const pagesGeo = new THREE.BoxGeometry(2.0, 2.6, 0.45);
    const pagesMesh = new THREE.Mesh(pagesGeo, pagesMaterial);
    pagesMesh.position.set(0.08, 0, 0);
    bookGroup.add(pagesMesh);

    // Front Cover
    const coverGeo = new THREE.BoxGeometry(2.2, 2.76, 0.04);
    const frontCover = new THREE.Mesh(coverGeo, coverMaterial);
    frontCover.position.set(0, 0, 0.24);
    bookGroup.add(frontCover);

    // Back Cover
    const backCover = new THREE.Mesh(coverGeo, coverMaterial);
    backCover.position.set(0, 0, -0.24);
    bookGroup.add(backCover);

    // Spine
    const spineGeo = new THREE.CylinderGeometry(0.24, 0.24, 2.76, 16, 1, false, Math.PI * 0.5, Math.PI);
    const spineMesh = new THREE.Mesh(spineGeo, coverMaterial);
    spineMesh.position.set(-1.08, 0, 0);
    spineMesh.rotation.y = Math.PI * 0.5;
    bookGroup.add(spineMesh);

    // Gold Corner Protectors (4 corners)
    const cornerGeo = new THREE.BoxGeometry(0.28, 0.28, 0.06);
    const cornerPositions = [
      [1.0, 1.28, 0.24],
      [1.0, -1.28, 0.24],
      [1.0, 1.28, -0.24],
      [1.0, -1.28, -0.24],
    ];
    cornerPositions.forEach(([x, y, z]) => {
      const c = new THREE.Mesh(cornerGeo, goldMaterial);
      c.position.set(x, y, z);
      bookGroup.add(c);
    });

    // Embossed Academic Crest Shield on Front Cover
    const crestShape = new THREE.Shape();
    crestShape.moveTo(-0.4, 0.4);
    crestShape.lineTo(0.4, 0.4);
    crestShape.lineTo(0.4, -0.1);
    crestShape.quadraticCurveTo(0.4, -0.5, 0, -0.6);
    crestShape.quadraticCurveTo(-0.4, -0.5, -0.4, -0.1);
    crestShape.closePath();

    const extrudeSettings = { depth: 0.03, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const crestGeo = new THREE.ExtrudeGeometry(crestShape, extrudeSettings);
    const crestMesh = new THREE.Mesh(crestGeo, goldMaterial);
    crestMesh.position.set(0, 0.1, 0.26);
    crestMesh.scale.set(0.9, 0.9, 0.9);
    bookGroup.add(crestMesh);

    // Inner Crest Emblem (Teal Star / Gear motif)
    const emblemGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 8);
    const emblemMesh = new THREE.Mesh(emblemGeo, tealGlowMaterial);
    emblemMesh.rotation.x = Math.PI / 2;
    emblemMesh.position.set(0, 0.08, 0.29);
    bookGroup.add(emblemMesh);

    // Bookmark Ribbon Hanging Below
    const ribbonShape = new THREE.Shape();
    ribbonShape.moveTo(-0.1, 0);
    ribbonShape.lineTo(0.1, 0);
    ribbonShape.lineTo(0.1, -0.8);
    ribbonShape.lineTo(0, -0.65);
    ribbonShape.lineTo(-0.1, -0.8);
    ribbonShape.closePath();

    const ribbonGeo = new THREE.ExtrudeGeometry(ribbonShape, { depth: 0.01, bevelEnabled: false });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, tealGlowMaterial);
    ribbonMesh.position.set(0.4, -1.3, 0);
    bookGroup.add(ribbonMesh);

    // Floating Orbital Ring (represents Student Knowledge / Autonomous Circuit)
    const ringGeo = new THREE.TorusGeometry(1.9, 0.025, 12, 64);
    const ringMesh = new THREE.Mesh(ringGeo, goldMaterial);
    ringMesh.rotation.x = Math.PI * 0.4;
    ringMesh.rotation.y = Math.PI * 0.15;
    rootGroup.add(ringMesh);

    // Floating Particle Satellites
    const particleCount = 20;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 2.1 + Math.sin(i * 1.5) * 0.3;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1.4;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x2dd4bf,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particleSystem);

    // Initial Angle
    bookGroup.rotation.y = -0.35;
    bookGroup.rotation.x = 0.18;

    // Interaction handling: Mouse Move Parallax Tilt
    let targetRotX = 0.18;
    let targetRotY = -0.35;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotY += deltaX * 0.015;
        targetRotX += deltaY * 0.015;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        targetRotY = -0.35 + x * 0.4;
        targetRotX = 0.18 - y * 0.3;
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);

    // Clock and Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Exponential damping for silky smooth response
      bookGroup.rotation.y = THREE.MathUtils.damp(bookGroup.rotation.y, targetRotY, 4.0, delta);
      bookGroup.rotation.x = THREE.MathUtils.damp(bookGroup.rotation.x, targetRotX, 4.0, delta);

      // Idle float and orbital rotation if rotating enabled
      if (isRotating && !isDragging) {
        bookGroup.position.y = Math.sin(time * 1.5) * 0.08;
        ringMesh.rotation.z += delta * 0.4;
        particleSystem.rotation.y += delta * 0.2;
      }

      // Exploded state inspection
      const targetFrontZ = exploded ? 0.7 : 0.24;
      const targetBackZ = exploded ? -0.7 : -0.24;
      frontCover.position.z = THREE.MathUtils.damp(frontCover.position.z, targetFrontZ, 5.0, delta);
      backCover.position.z = THREE.MathUtils.damp(backCover.position.z, targetBackZ, 5.0, delta);

      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newW = container.clientWidth || 320;
      const newH = container.clientHeight || 260;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      renderer.dispose();
      pagesGeo.dispose();
      coverGeo.dispose();
      crestGeo.dispose();
      emblemGeo.dispose();
      ribbonGeo.dispose();
      ringGeo.dispose();
      particleGeo.dispose();
      coverMaterial.dispose();
      goldMaterial.dispose();
      tealGlowMaterial.dispose();
      pagesMaterial.dispose();
      particleMat.dispose();
    };
  }, [isRotating, exploded]);

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-56 sm:h-64 cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden relative"
        title="Interactive 3D NEC Knowledge Tome. Drag to rotate!"
      />

      {/* Minimalistic Collapsible Bottom Dock (Zero Viewport Occlusion as per guidelines) */}
      <div className="flex items-center gap-2 mt-1 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-xs text-slate-400 shadow-lg">
        <button
          onClick={() => setIsRotating((prev) => !prev)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:text-teal-300 hover:bg-slate-800 transition"
          title={isRotating ? 'Pause slow rotation' : 'Resume rotation'}
        >
          <RotateCcw className={`w-3 h-3 ${isRotating ? 'animate-spin-slow text-teal-400' : ''}`} />
          <span>{isRotating ? 'Orbiting' : 'Paused'}</span>
        </button>

        <span className="w-px h-3 bg-slate-800" />

        <button
          onClick={() => setExploded((prev) => !prev)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition ${
            exploded ? 'text-teal-300 bg-teal-950/60 font-semibold' : 'hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Inspect tome internal structure"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{exploded ? 'Collapse Tome' : 'Expand 3D'}</span>
        </button>

        <span className="w-px h-3 bg-slate-800" />

        <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
          Interactive WebGL
        </span>
      </div>
    </div>
  );
};
