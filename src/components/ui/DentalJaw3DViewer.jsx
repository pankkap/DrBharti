import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, Typography, Button, Stack, Chip, IconButton, Tooltip, Fade, Paper } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VerifiedIcon from '@mui/icons-material/Verified';

const HOTSPOTS = [
  {
    id: 'implant',
    title: 'Titanium Dental Implant',
    shortTitle: 'Titanium Implant',
    icon: '⚡',
    tag: 'Surgical Precision',
    description: 'Grade-5 bio-compatible titanium post with lifetime structural warranty. High primary stability with computer-guided surgical placement.',
    rotationY: 0.85,
  },
  {
    id: 'veneer',
    title: 'E-Max Porcelain Veneer',
    shortTitle: 'Porcelain Veneers',
    icon: '✨',
    tag: 'Aesthetic Smile',
    description: '0.2mm ultra-thin hand-crafted E-Max ceramic shells providing natural enamel translucency, stain resistance, and Hollywood smile alignment.',
    rotationY: 0.0,
  },
  {
    id: 'aligner',
    title: 'Clear Invisible Aligner',
    shortTitle: 'Clear Aligners',
    icon: '💎',
    tag: 'Orthodontics',
    description: 'SmartTrack medical polyurethane polymer tray. Discreetly straightens teeth with zero metal brackets, wires, or dietary restrictions.',
    rotationY: -0.65,
  },
  {
    id: 'whitening',
    title: 'Laser Zoom Whitening',
    shortTitle: 'Laser Whitening',
    icon: '🌟',
    tag: 'Diamond Polish',
    description: 'In-chair cold laser whitening safely eliminates decades of coffee, tea, wine, and tobacco stains by up to 8 shades in a single visit.',
    rotationY: 0.25,
  },
];

const DentalJaw3DViewer = () => {
  const mountRef = useRef(null);
  const [activeHotspot, setActiveHotspot] = useState(HOTSPOTS[0]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // References
  const sceneRef = useRef(null);
  const jawGroupRef = useRef(null);
  const alignerMeshRef = useRef(null);
  const implantGroupRef = useRef(null);
  const toothMeshesRef = useRef([]);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const targetRotationYRef = useRef(0);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 380;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera - Centered right on the jaw bite center with natural FOV
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.12, 3.05);
    camera.lookAt(0, 0.02, 0);
    cameraRef.current = camera;

    // 3. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Operatory Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaf0, 2.5);
    keyLight.position.set(4, 4, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xfff1f2, 1.8);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const backRimLight = new THREE.DirectionalLight(0xe11d48, 1.6);
    backRimLight.position.set(0, -3, -3);
    scene.add(backRimLight);

    const dentalOperatorySpot = new THREE.SpotLight(0xffffff, 3.0, 10, Math.PI / 4, 0.4);
    dentalOperatorySpot.position.set(0, 3.5, 2.5);
    scene.add(dentalOperatorySpot);

    // 5. Materials
    // A. Pearlescent Enamel Material (Natural Teeth)
    const enamelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      transmission: 0.12,
      thickness: 0.7,
      reflectivity: 0.95,
    });

    // B. Anatomical Warm Gingiva (Gums)
    const gumMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xdf7a85,
      roughness: 0.36,
      metalness: 0.02,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      sheen: 0.4,
      sheenColor: 0xffb5bc,
    });

    // C. Surgical Titanium Implant Post
    const titaniumMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.96,
      roughness: 0.16,
    });

    // D. Transmucosal Gold Abutment
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.22,
    });

    // E. Clear Aligner Polymer
    const alignerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transmission: 0.94,
      opacity: 0.48,
      transparent: true,
      roughness: 0.05,
      ior: 1.48,
      clearcoat: 1.0,
      visible: true,
    });

    // 6. Master Jaw Group
    const jawMasterGroup = new THREE.Group();
    jawGroupRef.current = jawMasterGroup;
    scene.add(jawMasterGroup);

    // Helper curve generator for parabolic dental arch
    const getArchPosition = (t, radiusX = 1.32, radiusZ = 1.42, zOffset = 0) => {
      // t from -1 (left molars) to 1 (right molars)
      const angle = (t * Math.PI * 0.73) / 2;
      const x = Math.sin(angle) * radiusX;
      const z = Math.cos(angle) * radiusZ - radiusZ * 0.32 + zOffset;
      return { x, z, angle };
    };

    const toothMeshes = [];
    toothMeshesRef.current = toothMeshes;

    // ==========================================
    // A. UPPER JAW (Maxilla)
    // ==========================================
    const upperJawGroup = new THREE.Group();
    upperJawGroup.position.y = 0.16;
    jawMasterGroup.add(upperJawGroup);

    // Upper Gum Arch (anatomical contour)
    const upperGumPoints = [];
    for (let i = -1; i <= 1.01; i += 0.04) {
      const p = getArchPosition(i, 1.34, 1.44);
      upperGumPoints.push(new THREE.Vector3(p.x, 0.18, p.z));
    }
    const upperGumCurve = new THREE.CatmullRomCurve3(upperGumPoints);
    const upperGumGeom = new THREE.TubeGeometry(upperGumCurve, 42, 0.11, 16, false);
    const upperGumMesh = new THREE.Mesh(upperGumGeom, gumMaterial);
    upperJawGroup.add(upperGumMesh);

    // Upper Teeth (14 Teeth)
    const upperCount = 14;
    for (let i = 0; i < upperCount; i++) {
      const t = -1 + (i / (upperCount - 1)) * 2;
      const pos = getArchPosition(t, 1.32, 1.42);

      const isCentralIncisor = i === 6 || i === 7;
      const isLateralIncisor = i === 5 || i === 8;
      const isCanine = i === 4 || i === 9;
      const isImplantTooth = i === 11; // Upper right first molar

      let w = 0.17;
      let h = 0.36;
      let d = 0.18;

      if (isCentralIncisor) {
        w = 0.21;
        h = 0.42;
        d = 0.19;
      } else if (isLateralIncisor) {
        w = 0.17;
        h = 0.38;
        d = 0.17;
      } else if (isCanine) {
        w = 0.19;
        h = 0.44;
        d = 0.21;
      } else {
        // Molar / Premolar
        w = 0.26;
        h = 0.32;
        d = 0.27;
      }

      const toothGeom = new THREE.BoxGeometry(w, h, d, 2, 3, 2);
      // Natural contour taper towards root & incisal edge
      const posAttr = toothGeom.attributes.position;
      for (let k = 0; k < posAttr.count; k++) {
        const vx = posAttr.getX(k);
        const vy = posAttr.getY(k);
        const vz = posAttr.getZ(k);
        const taper = 1 - 0.22 * Math.abs(vy / (h * 0.5));
        posAttr.setX(k, vx * taper);
        posAttr.setZ(k, vz * taper);
      }
      toothGeom.computeVertexNormals();

      const toothMesh = new THREE.Mesh(toothGeom, enamelMaterial.clone());
      toothMesh.position.set(pos.x, 0.08, pos.z);
      toothMesh.rotation.y = -pos.angle * 1.04;
      toothMesh.rotation.x = 0.08;
      upperJawGroup.add(toothMesh);
      toothMeshes.push(toothMesh);

      // Titanium Implant Setup
      if (isImplantTooth) {
        const implantGroup = new THREE.Group();
        implantGroupRef.current = implantGroup;

        // Threaded titanium screw
        const screwGeom = new THREE.CylinderGeometry(0.07, 0.045, 0.38, 16);
        const screwMesh = new THREE.Mesh(screwGeom, titaniumMaterial);
        screwMesh.position.set(0, 0.24, 0);
        implantGroup.add(screwMesh);

        // Screw thread ridges
        for (let r = 0; r < 4; r++) {
          const ringGeom = new THREE.TorusGeometry(0.072 - r * 0.005, 0.01, 8, 16);
          const ringMesh = new THREE.Mesh(ringGeom, titaniumMaterial);
          ringMesh.rotation.x = Math.PI / 2;
          ringMesh.position.set(0, 0.12 + r * 0.06, 0);
          implantGroup.add(ringMesh);
        }

        // Gold collar abutment
        const collarGeom = new THREE.CylinderGeometry(0.1, 0.07, 0.07, 16);
        const collarMesh = new THREE.Mesh(collarGeom, goldMaterial);
        collarMesh.position.set(0, 0.05, 0);
        implantGroup.add(collarMesh);

        implantGroup.position.copy(toothMesh.position);
        implantGroup.rotation.copy(toothMesh.rotation);
        upperJawGroup.add(implantGroup);
      }
    }

    // Clear Aligner Shell Tray Overlay
    const alignerPoints = [];
    for (let i = -1.02; i <= 1.03; i += 0.04) {
      const p = getArchPosition(i, 1.37, 1.47);
      alignerPoints.push(new THREE.Vector3(p.x, 0.12, p.z));
    }
    const alignerCurve = new THREE.CatmullRomCurve3(alignerPoints);
    const alignerGeom = new THREE.TubeGeometry(alignerCurve, 42, 0.22, 16, false);
    const alignerMesh = new THREE.Mesh(alignerGeom, alignerMaterial);
    alignerMeshRef.current = alignerMesh;
    upperJawGroup.add(alignerMesh);

    // ==========================================
    // B. LOWER JAW (Mandible)
    // ==========================================
    const lowerJawGroup = new THREE.Group();
    lowerJawGroup.position.y = -0.22;
    jawMasterGroup.add(lowerJawGroup);

    // Lower Gum Arch (anatomical contour)
    const lowerGumPoints = [];
    for (let i = -1; i <= 1.01; i += 0.04) {
      const p = getArchPosition(i, 1.28, 1.38);
      lowerGumPoints.push(new THREE.Vector3(p.x, -0.16, p.z));
    }
    const lowerGumCurve = new THREE.CatmullRomCurve3(lowerGumPoints);
    const lowerGumGeom = new THREE.TubeGeometry(lowerGumCurve, 42, 0.1, 16, false);
    const lowerGumMesh = new THREE.Mesh(lowerGumGeom, gumMaterial);
    lowerJawGroup.add(lowerGumMesh);

    // Lower Teeth (14 Teeth)
    const lowerCount = 14;
    for (let i = 0; i < lowerCount; i++) {
      const t = -1 + (i / (lowerCount - 1)) * 2;
      const pos = getArchPosition(t, 1.26, 1.35);

      const toothGeom = new THREE.BoxGeometry(0.17, 0.32, 0.18, 2, 2, 2);
      const toothMesh = new THREE.Mesh(toothGeom, enamelMaterial.clone());
      toothMesh.position.set(pos.x, -0.06, pos.z);
      toothMesh.rotation.y = -pos.angle * 1.04;
      toothMesh.rotation.x = -0.06;
      lowerJawGroup.add(toothMesh);
      toothMeshes.push(toothMesh);
    }

    // Floating Diamond Sparkles
    const sparkleCount = 16;
    const sparkleGroup = new THREE.Group();
    const starGeom = new THREE.OctahedronGeometry(0.035, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xe11d48 });

    for (let s = 0; s < sparkleCount; s++) {
      const star = new THREE.Mesh(starGeom, starMat);
      const angle = (s / sparkleCount) * Math.PI * 2;
      const rad = 1.7 + Math.random() * 0.5;
      star.position.set(Math.cos(angle) * rad, (Math.random() - 0.5) * 1.2, Math.sin(angle) * rad);
      star.userData = {
        speed: 0.015 + Math.random() * 0.02,
      };
      sparkleGroup.add(star);
    }
    jawMasterGroup.add(sparkleGroup);

    // Centering the whole assembly perfectly
    jawMasterGroup.position.set(0, 0, 0);

    // 7. Mouse & Touch 360° Drag
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velocityY = 0;
    let velocityX = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      isTransitioningRef.current = false;
      setIsAutoRotating(false);
      prevMouseX = e.clientX || (e.touches && e.touches[0].clientX);
      prevMouseY = e.clientY || (e.touches && e.touches[0].clientY);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      velocityY = deltaX * 0.007;
      velocityX = deltaY * 0.005;

      jawMasterGroup.rotation.y += velocityY;
      jawMasterGroup.rotation.x = Math.max(-0.5, Math.min(0.5, jawMasterGroup.rotation.x + velocityX));

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    dom.addEventListener('touchstart', onMouseDown, { passive: true });
    window.addEventListener('touchmove', onMouseMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    // 8. Render Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth camera / rotation interpolation when a mode is clicked
      if (isTransitioningRef.current) {
        const diff = targetRotationYRef.current - jawMasterGroup.rotation.y;
        jawMasterGroup.rotation.y += diff * 0.08;
        jawMasterGroup.rotation.x += (0.0 - jawMasterGroup.rotation.x) * 0.08;
        if (Math.abs(diff) < 0.005) {
          isTransitioningRef.current = false;
        }
      } else if (!isDragging) {
        // Continuous auto-rotation
        jawMasterGroup.rotation.y += 0.005;
        // Inertia damping
        velocityY *= 0.93;
        velocityX *= 0.93;
        jawMasterGroup.rotation.y += velocityY;
      }

      // Gentle physiological jaw breathing movement
      lowerJawGroup.position.y = -0.22 + Math.sin(elapsedTime * 1.8) * 0.012;

      // Sparkle rotation
      sparkleGroup.children.forEach((star) => {
        star.rotation.x += star.userData.speed;
        star.rotation.y += star.userData.speed * 1.5;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onMouseDown);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Visuals when Active Mode changes
  const handleSelectHotspot = (spot) => {
    setActiveHotspot(spot);
    setIsAutoRotating(false);
    targetRotationYRef.current = spot.rotationY;
    isTransitioningRef.current = true;

    if (!alignerMeshRef.current || !implantGroupRef.current) return;

    if (spot.id === 'aligner') {
      alignerMeshRef.current.visible = true;
      alignerMeshRef.current.material.opacity = 0.85;
      alignerMeshRef.current.material.color.setHex(0x38bdf8);
    } else if (spot.id === 'implant') {
      alignerMeshRef.current.visible = false;
      implantGroupRef.current.visible = true;
    } else if (spot.id === 'whitening') {
      alignerMeshRef.current.visible = false;
      toothMeshesRef.current.forEach((m) => {
        m.material.color.setHex(0xffffff);
        m.material.clearcoat = 1.0;
        m.material.roughness = 0.05;
      });
    } else if (spot.id === 'veneer') {
      alignerMeshRef.current.visible = false;
      // Front teeth veneer translucency
      toothMeshesRef.current.slice(4, 10).forEach((m) => {
        m.material.color.setHex(0xfcfcfa);
        m.material.clearcoat = 1.0;
        m.material.roughness = 0.04;
      });
    }
  };

  const handleResetCamera = () => {
    if (jawGroupRef.current) {
      targetRotationYRef.current = 0;
      isTransitioningRef.current = true;
    }
    setActiveHotspot(HOTSPOTS[0]);
    setIsAutoRotating(true);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 620,
        mx: 'auto',
        borderRadius: '28px',
        bgcolor: '#FFFFFF',
        border: '1px solid rgba(225, 29, 72, 0.18)',
        boxShadow: '0 20px 50px -10px rgba(10, 37, 64, 0.1), 0 0 0 1px rgba(225, 29, 72, 0.06)',
        p: { xs: 2, sm: 2.5 },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      {/* 1. TOP HEADER: Title Badge & Reset Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
              bgcolor: '#fce5e5',
              border: '1px solid #fecdd3',
              py: 0.6,
              px: 1.4,
              borderRadius: 3,
            }}
          >
            <RotateLeftIcon sx={{ fontSize: 17, color: '#E11D48', animation: 'spin 6s linear infinite' }} />
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#BE123C', letterSpacing: '0.03em', fontSize: '0.74rem' }}>
              360° INTERACTIVE 3D JAW ARCH
            </Typography>
          </Box>
          <Chip
            icon={<ThreeDRotationIcon sx={{ fontSize: '14px !important', color: '#0A2540 !important' }} />}
            label="Drag to Rotate"
            size="small"
            sx={{
              bgcolor: '#F1F5F9',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.68rem',
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          />
        </Box>

        <Tooltip title="Reset Camera Rotation" placement="left">
          <IconButton
            size="small"
            onClick={handleResetCamera}
            sx={{
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              '&:hover': { bgcolor: '#fce5e5', color: '#E11D48' },
              width: 34,
              height: 34,
            }}
          >
            <CenterFocusStrongIcon sx={{ fontSize: 18, color: '#475569' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 2. MODE SWITCHER TABS - Placed neatly above the 3D Canvas so it NEVER covers the model! */}
      <Stack
        direction="row"
        spacing={0.8}
        sx={{
          overflowX: 'auto',
          pb: 0.5,
          pt: 0.2,
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#E2E8F0', borderRadius: 4 },
        }}
      >
        {HOTSPOTS.map((spot) => {
          const isSelected = activeHotspot.id === spot.id;
          return (
            <Button
              key={spot.id}
              size="small"
              onClick={() => handleSelectHotspot(spot)}
              sx={{
                py: 0.6,
                px: 1.6,
                borderRadius: 9999,
                fontSize: '0.76rem',
                fontWeight: 700,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                color: isSelected ? '#FFFFFF' : '#334155',
                bgcolor: isSelected ? '#0A2540' : '#F8FAFC',
                border: '1px solid',
                borderColor: isSelected ? '#0A2540' : '#E2E8F0',
                boxShadow: isSelected ? '0 4px 12px rgba(10, 37, 64, 0.25)' : 'none',
                '&:hover': {
                  bgcolor: isSelected ? '#1E3A5F' : '#F1F5F9',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ marginRight: 6 }}>{spot.icon}</span>
              {spot.shortTitle}
            </Button>
          );
        })}
      </Stack>

      {/* 3. 3D WEBGL VIEWPORT CANVAS - 100% UNOBSTRUCTED! */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 300, sm: 340, md: 360 },
          borderRadius: '20px',
          background: 'radial-gradient(circle at 50% 50%, #fce5e5 0%, #F8FAFC 65%, #F1F5F9 100%)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        {/* Canvas DOM mount */}
        <Box
          ref={mountRef}
          sx={{
            width: '100%',
            height: '100%',
          }}
        />

        {/* Small subtle watermark hint in corner */}
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 12,
            color: '#94A3B8',
            fontSize: '0.66rem',
            fontWeight: 600,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          Click & Drag to Orbit 360°
        </Typography>
      </Box>

      {/* 4. DEDICATED CLINICAL DETAILS CARD - PLACED BELOW CANVAS IN ITS OWN SPACE (ZERO OVERLAP!) */}
      <Fade in={Boolean(activeHotspot)} key={activeHotspot.id}>
        <Box
          sx={{
            p: 1.8,
            borderRadius: '18px',
            bgcolor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.8,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0A2540', fontSize: '0.92rem' }}>
                {activeHotspot.title}
              </Typography>
              <Chip
                label={activeHotspot.tag}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  bgcolor: '#ECFDF5',
                  color: '#047857',
                  border: '1px solid #A7F3D0',
                }}
              />
            </Box>

            <Chip
              icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#E11D48 !important' }} />}
              label="Dr. Approved Clinical Standard"
              size="small"
              sx={{
                height: 22,
                fontSize: '0.68rem',
                fontWeight: 700,
                bgcolor: '#fce5e5',
                color: '#be185d',
                border: '1px solid #fecdd3',
              }}
            />
          </Box>

          <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.6 }}>
            {activeHotspot.description}
          </Typography>
        </Box>
      </Fade>
    </Paper>
  );
};

export default DentalJaw3DViewer;
