// import { useEffect, useRef } from 'react'
// import { useSelector } from 'react-redux'
// import * as TRecuriterEE from 'three'

// const ThreeBackground = () => {
//   const mountRef = useRef(null)
//   const { mode } = useSelector(s => s.theme)
//   const isLight = mode === 'light'

//   useEffect(() => {
//     const mount = mountRef.current
//     if (!mount) return

//     const W = mount.clientWidth, H = mount.clientHeight
//     const scene = new TRecuriterEE.Scene()
//     const camera = new TRecuriterEE.PerspectiveCamera(60, W / H, 0.1, 1000)
//     camera.position.set(0, 0, 40)

//     const renderer = new TRecuriterEE.WebGLRenderer({ antialias: true, alpha: true })
//     renderer.setSize(W, H)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//     renderer.setClearColor(0x000000, 0)
//     mount.appendChild(renderer.domElement)

//     // ── Theme-aware color palette ─────────────────────────────────────────
//     const palette = isLight
//       ? [new TRecuriterEE.Color('#6366f1'), new TRecuriterEE.Color('#8b5cf6'), new TRecuriterEE.Color('#0ea5e9'), new TRecuriterEE.Color('#a78bfa'), new TRecuriterEE.Color('#6366f1')]
//       : [new TRecuriterEE.Color('#ffffff'), new TRecuriterEE.Color('#c7d2fe'), new TRecuriterEE.Color('#818cf8'), new TRecuriterEE.Color('#38bdf8'), new TRecuriterEE.Color('#a78bfa')]

//     const coreColors = [new TRecuriterEE.Color('#6366f1'), new TRecuriterEE.Color('#8b5cf6'), new TRecuriterEE.Color('#22d3ee')]
//     const armR = 0.39, armG = 0.40, armB = 0.94

//     // ── Star field ────────────────────────────────────────────────────────
//     const starCount = 2800
//     const starPos = new Float32Array(starCount * 3)
//     const starCol = new Float32Array(starCount * 3)
//     for (let i = 0; i < starCount; i++) {
//       const r = 60 + Math.random() * 90
//       const theta = Math.random() * Math.PI * 2
//       const phi = Math.acos(2 * Math.random() - 1)
//       starPos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
//       starPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
//       starPos[i*3+2] = r * Math.cos(phi)
//       const c = palette[Math.floor(Math.random() * palette.length)]
//       starCol[i*3] = c.r; starCol[i*3+1] = c.g; starCol[i*3+2] = c.b
//     }
//     const starGeo = new TRecuriterEE.BufferGeometry()
//     starGeo.setAttribute('position', new TRecuriterEE.BufferAttribute(starPos, 3))
//     starGeo.setAttribute('color', new TRecuriterEE.BufferAttribute(starCol, 3))
//     const stars = new TRecuriterEE.Points(starGeo, new TRecuriterEE.PointsMaterial({
//       size: isLight ? 0.22 : 0.28,
//       vertexColors: true, transparent: true,
//       opacity: isLight ? 0.6 : 0.85,
//       blending: TRecuriterEE.AdditiveBlending, depthWrite: false,
//     }))
//     scene.add(stars)

//     // ── Glowing core ──────────────────────────────────────────────────────
//     const coreCount = 500
//     const corePos = new Float32Array(coreCount * 3)
//     const coreCol = new Float32Array(coreCount * 3)
//     for (let i = 0; i < coreCount; i++) {
//       const r = Math.random() * 20
//       const theta = Math.random() * Math.PI * 2
//       const phi = Math.acos(2 * Math.random() - 1)
//       corePos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
//       corePos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.4
//       corePos[i*3+2] = r * Math.cos(phi) * 0.6
//       const c = coreColors[Math.floor(Math.random() * 3)]
//       coreCol[i*3] = c.r; coreCol[i*3+1] = c.g; coreCol[i*3+2] = c.b
//     }
//     const coreGeo = new TRecuriterEE.BufferGeometry()
//     coreGeo.setAttribute('position', new TRecuriterEE.BufferAttribute(corePos, 3))
//     coreGeo.setAttribute('color', new TRecuriterEE.BufferAttribute(coreCol, 3))
//     const core = new TRecuriterEE.Points(coreGeo, new TRecuriterEE.PointsMaterial({
//       size: 0.52, vertexColors: true, transparent: true,
//       opacity: isLight ? 0.55 : 0.88,
//       blending: TRecuriterEE.AdditiveBlending, depthWrite: false,
//     }))
//     scene.add(core)

//     // ── Spiral arms ────────────────────────────────────────────────────────
//     const armGroups = []
//     for (let arm = 0; arm < 2; arm++) {
//       const n = 700
//       const pos = new Float32Array(n * 3)
//       const col = new Float32Array(n * 3)
//       const offset = (arm / 2) * Math.PI * 2
//       for (let i = 0; i < n; i++) {
//         const t = i / n
//         const angle = offset + t * Math.PI * 4
//         const radius = t * 26
//         const spread = (1 - t) * 1.5 + 0.5
//         pos[i*3]   = Math.cos(angle) * radius + (Math.random()-0.5)*spread*3
//         pos[i*3+1] = (Math.random()-0.5)*spread*0.8
//         pos[i*3+2] = Math.sin(angle) * radius + (Math.random()-0.5)*spread*3
//         col[i*3] = armR + t*0.15; col[i*3+1] = armG - t*0.05; col[i*3+2] = armB - t*0.1
//       }
//       const ag = new TRecuriterEE.BufferGeometry()
//       ag.setAttribute('position', new TRecuriterEE.BufferAttribute(pos, 3))
//       ag.setAttribute('color', new TRecuriterEE.BufferAttribute(col, 3))
//       const ap = new TRecuriterEE.Points(ag, new TRecuriterEE.PointsMaterial({
//         size: 0.42, vertexColors: true, transparent: true,
//         opacity: isLight ? 0.4 : 0.65,
//         blending: TRecuriterEE.AdditiveBlending, depthWrite: false,
//       }))
//       ap.rotation.x = Math.PI * 0.18
//       scene.add(ap)
//       armGroups.push(ap)
//     }

//     // ── Wireframe shapes ───────────────────────────────────────────────────
//     const shapeColor = isLight ? 0x6366f1 : 0x6366f1
//     const shapeOpacity = isLight ? 0.06 : 0.1
//     const shapes = []
//     const defs = [
//       { geo: new TRecuriterEE.IcosahedronGeometry(3.5, 1), pos: [-14, 6, -8],   op: shapeOpacity * 1.0 },
//       { geo: new TRecuriterEE.OctahedronGeometry(2.5, 0),  pos: [12, -5, -5],   op: shapeOpacity * 1.2 },
//       { geo: new TRecuriterEE.TetrahedronGeometry(2.0, 0), pos: [0, 10, -12],   op: shapeOpacity * 0.9 },
//       { geo: new TRecuriterEE.IcosahedronGeometry(2.0, 0), pos: [16, 8, -10],   op: shapeOpacity * 0.8 },
//       { geo: new TRecuriterEE.OctahedronGeometry(1.5, 0),  pos: [-16, -8, -6],  op: shapeOpacity * 1.0 },
//     ]
//     defs.forEach(d => {
//       const m = new TRecuriterEE.Mesh(d.geo, new TRecuriterEE.MeshBasicMaterial({ color: shapeColor, wireframe: true, transparent: true, opacity: d.op }))
//       m.position.set(...d.pos)
//       m.userData = { rx: (Math.random()-0.5)*0.006, ry: (Math.random()-0.5)*0.008, fy: Math.random()*0.004+0.002, fo: Math.random()*Math.PI*2 }
//       scene.add(m); shapes.push(m)
//     })

//     // ── Neural net lines ──────────────────────────────────────────────────
//     const nodes = Array.from({length: 55}, () =>
//       new TRecuriterEE.Vector3((Math.random()-0.5)*70, (Math.random()-0.5)*50, (Math.random()-0.5)*30-10)
//     )
//     const linesArr = []
//     nodes.forEach((a, i) => nodes.forEach((b, j) => {
//       if (j <= i) return
//       if (a.distanceTo(b) < 18) linesArr.push(a.x,a.y,a.z,b.x,b.y,b.z)
//     }))
//     const lineGeo = new TRecuriterEE.BufferGeometry()
//     lineGeo.setAttribute('position', new TRecuriterEE.BufferAttribute(new Float32Array(linesArr), 3))
//     const linesMesh = new TRecuriterEE.LineSegments(lineGeo, new TRecuriterEE.LineBasicMaterial({
//       color: 0x6366f1, transparent: true, opacity: isLight ? 0.04 : 0.055,
//     }))
//     scene.add(linesMesh)

//     // ── Mouse & resize ─────────────────────────────────────────────────────
//     let tx = 0, ty = 0
//     const onMouse = (e) => { tx = (e.clientX/window.innerWidth-0.5)*2; ty = (e.clientY/window.innerHeight-0.5)*2 }
//     const onTouch = (e) => {
//       if (!e.touches[0]) return
//       tx = (e.touches[0].clientX/window.innerWidth-0.5)*2
//       ty = (e.touches[0].clientY/window.innerHeight-0.5)*2
//     }
//     window.addEventListener('mousemove', onMouse)
//     window.addEventListener('touchmove', onTouch, { passive: true })
//     const onResize = () => {
//       camera.aspect = mount.clientWidth/mount.clientHeight
//       camera.updateProjectionMatrix()
//       renderer.setSize(mount.clientWidth, mount.clientHeight)
//     }
//     window.addEventListener('resize', onResize)

//     // ── Animate ────────────────────────────────────────────────────────────
//     const clock = new TRecuriterEE.Clock()
//     let cx = 0, cy = 0, raf
//     const animate = () => {
//       raf = requestAnimationFrame(animate)
//       const t = clock.getElapsedTime()
//       cx += (tx - cx) * 0.025; cy += (ty - cy) * 0.025

//       stars.rotation.y = t * 0.012; stars.rotation.x = t * 0.004
//       core.rotation.y  = t * 0.025; core.rotation.x = Math.sin(t*0.2)*0.08
//       armGroups.forEach((a, i) => { a.rotation.y = t * 0.018 + i * Math.PI })
//       shapes.forEach(s => {
//         s.rotation.x += s.userData.rx; s.rotation.y += s.userData.ry
//         s.position.y += Math.sin(t * s.userData.fy + s.userData.fo) * 0.012
//       })
//       linesMesh.rotation.y = t * 0.008; linesMesh.rotation.x = Math.sin(t*0.15)*0.05

//       camera.position.x += (cx * 5 - camera.position.x) * 0.04
//       camera.position.y += (-cy * 3 - camera.position.y) * 0.04
//       camera.lookAt(0, 0, 0)
//       renderer.render(scene, camera)
//     }
//     animate()

//     return () => {
//       cancelAnimationFrame(raf)
//       window.removeEventListener('mousemove', onMouse)
//       window.removeEventListener('touchmove', onTouch)
//       window.removeEventListener('resize', onResize)
//       if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
//       renderer.dispose()
//     }
//   }, [mode]) // re-init when theme changes

//   return (
//     <div
//       ref={mountRef}
//       className="three-bg"
//       style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
//     />
//   )
// }

// export default ThreeBackground
// import { useEffect, useRef } from 'react'
// import * as TRecuriterEE from 'three'

// const ThreeBackground = () => {
//   const mountRef = useRef(null)

//   useEffect(() => {
//     const mount = mountRef.current
//     if (!mount) return

//     const W = mount.clientWidth, H = mount.clientHeight
//     const scene = new TRecuriterEE.Scene()
//     const camera = new TRecuriterEE.PerspectiveCamera(60, W / H, 0.1, 1000)
//     camera.position.set(0, 0, 40)

//     const renderer = new TRecuriterEE.WebGLRenderer({ antialias: true, alpha: true })
//     renderer.setSize(W, H)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//     renderer.setClearColor(0x000000, 0)
//     mount.appendChild(renderer.domElement)

//     // ── Star field ────────────────────────────────────────────────────────
//     const starCount = 3000
//     const starPos = new Float32Array(starCount * 3)
//     const starCol = new Float32Array(starCount * 3)
//     const colorOptions = [
//       new TRecuriterEE.Color('#ffffff'), new TRecuriterEE.Color('#c7d2fe'),
//       new TRecuriterEE.Color('#818cf8'), new TRecuriterEE.Color('#38bdf8'), new TRecuriterEE.Color('#a78bfa'),
//     ]
//     for (let i = 0; i < starCount; i++) {
//       const r = 60 + Math.random() * 80
//       const theta = Math.random() * Math.PI * 2
//       const phi = Math.acos(2 * Math.random() - 1)
//       starPos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
//       starPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
//       starPos[i*3+2] = r * Math.cos(phi)
//       const c = colorOptions[Math.floor(Math.random() * colorOptions.length)]
//       starCol[i*3] = c.r; starCol[i*3+1] = c.g; starCol[i*3+2] = c.b
//     }
//     const starGeo = new TRecuriterEE.BufferGeometry()
//     starGeo.setAttribute('position', new TRecuriterEE.BufferAttribute(starPos, 3))
//     starGeo.setAttribute('color', new TRecuriterEE.BufferAttribute(starCol, 3))
//     const stars = new TRecuriterEE.Points(starGeo, new TRecuriterEE.PointsMaterial({
//       size: 0.28, vertexColors: true, transparent: true, opacity: 0.85,
//       blending: TRecuriterEE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
//     }))
//     scene.add(stars)

//     // ── Glowing core ──────────────────────────────────────────────────────
//     const coreCount = 600
//     const corePos = new Float32Array(coreCount * 3)
//     const coreCol = new Float32Array(coreCount * 3)
//     const coreColors = [new TRecuriterEE.Color('#6366f1'), new TRecuriterEE.Color('#8b5cf6'), new TRecuriterEE.Color('#22d3ee')]
//     for (let i = 0; i < coreCount; i++) {
//       const r = Math.random() * 22
//       const theta = Math.random() * Math.PI * 2
//       const phi = Math.acos(2 * Math.random() - 1)
//       corePos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
//       corePos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.4
//       corePos[i*3+2] = r * Math.cos(phi) * 0.6
//       const c = coreColors[Math.floor(Math.random() * 3)]
//       coreCol[i*3] = c.r; coreCol[i*3+1] = c.g; coreCol[i*3+2] = c.b
//     }
//     const coreGeo = new TRecuriterEE.BufferGeometry()
//     coreGeo.setAttribute('position', new TRecuriterEE.BufferAttribute(corePos, 3))
//     coreGeo.setAttribute('color', new TRecuriterEE.BufferAttribute(coreCol, 3))
//     const core = new TRecuriterEE.Points(coreGeo, new TRecuriterEE.PointsMaterial({
//       size: 0.55, vertexColors: true, transparent: true, opacity: 0.9,
//       blending: TRecuriterEE.AdditiveBlending, depthWrite: false,
//     }))
//     scene.add(core)

//     // ── Spiral arms ────────────────────────────────────────────────────────
//     const armGroups = []
//     for (let arm = 0; arm < 2; arm++) {
//       const armParticles = 800
//       const armPos = new Float32Array(armParticles * 3)
//       const armCol = new Float32Array(armParticles * 3)
//       const offset = (arm / 2) * Math.PI * 2
//       for (let i = 0; i < armParticles; i++) {
//         const t = i / armParticles
//         const angle = offset + t * Math.PI * 4
//         const radius = t * 28
//         const spread = (1 - t) * 1.5 + 0.5
//         armPos[i*3]   = Math.cos(angle) * radius + (Math.random()-0.5)*spread*3
//         armPos[i*3+1] = (Math.random()-0.5)*spread*0.8
//         armPos[i*3+2] = Math.sin(angle) * radius + (Math.random()-0.5)*spread*3
//         armCol[i*3]   = 0.39 + t*0.15
//         armCol[i*3+1] = 0.40 - t*0.05
//         armCol[i*3+2] = 0.94 - t*0.1
//       }
//       const ag = new TRecuriterEE.BufferGeometry()
//       ag.setAttribute('position', new TRecuriterEE.BufferAttribute(armPos, 3))
//       ag.setAttribute('color', new TRecuriterEE.BufferAttribute(armCol, 3))
//       const ap = new TRecuriterEE.Points(ag, new TRecuriterEE.PointsMaterial({
//         size: 0.45, vertexColors: true, transparent: true, opacity: 0.65,
//         blending: TRecuriterEE.AdditiveBlending, depthWrite: false,
//       }))
//       ap.rotation.x = Math.PI * 0.18
//       scene.add(ap)
//       armGroups.push(ap)
//     }

//     // ── Wireframe shapes ───────────────────────────────────────────────────
//     const shapes = []
//     const shapeDefs = [
//       { geo: new TRecuriterEE.IcosahedronGeometry(3.5, 1), pos: [-14, 6, -8], color: 0x6366f1, opacity: 0.1 },
//       { geo: new TRecuriterEE.OctahedronGeometry(2.5, 0), pos: [12, -5, -5], color: 0x8b5cf6, opacity: 0.12 },
//       { geo: new TRecuriterEE.TetrahedronGeometry(2.0, 0), pos: [0, 10, -12], color: 0x22d3ee, opacity: 0.09 },
//       { geo: new TRecuriterEE.IcosahedronGeometry(2.0, 0), pos: [16, 8, -10], color: 0xa78bfa, opacity: 0.08 },
//       { geo: new TRecuriterEE.OctahedronGeometry(1.5, 0), pos: [-16, -8, -6], color: 0x38bdf8, opacity: 0.1 },
//     ]
//     shapeDefs.forEach(d => {
//       const m = new TRecuriterEE.Mesh(d.geo, new TRecuriterEE.MeshBasicMaterial({
//         color: d.color, wireframe: true, transparent: true, opacity: d.opacity,
//       }))
//       m.position.set(...d.pos)
//       m.userData = { rx: (Math.random()-0.5)*0.006, ry: (Math.random()-0.5)*0.008, fy: Math.random()*0.004+0.002, fo: Math.random()*Math.PI*2 }
//       scene.add(m)
//       shapes.push(m)
//     })

//     // ── Neural net lines ──────────────────────────────────────────────────
//     const nodes = Array.from({length: 60}, () =>
//       new TRecuriterEE.Vector3((Math.random()-0.5)*70, (Math.random()-0.5)*50, (Math.random()-0.5)*30-10)
//     )
//     const linesArr = []
//     nodes.forEach((a, i) => nodes.forEach((b, j) => {
//       if (j <= i) return
//       if (a.distanceTo(b) < 18) linesArr.push(a.x, a.y, a.z, b.x, b.y, b.z)
//     }))
//     const lineGeo = new TRecuriterEE.BufferGeometry()
//     lineGeo.setAttribute('position', new TRecuriterEE.BufferAttribute(new Float32Array(linesArr), 3))
//     const linesMesh = new TRecuriterEE.LineSegments(lineGeo, new TRecuriterEE.LineBasicMaterial({
//       color: 0x6366f1, transparent: true, opacity: 0.055,
//     }))
//     scene.add(linesMesh)

//     // ── Mouse & resize ────────────────────────────────────────────────────
//     let tx = 0, ty = 0
//     const onMouse = (e) => { tx = (e.clientX/window.innerWidth-0.5)*2; ty = (e.clientY/window.innerHeight-0.5)*2 }
//     window.addEventListener('mousemove', onMouse)
//     const onResize = () => {
//       camera.aspect = mount.clientWidth/mount.clientHeight
//       camera.updateProjectionMatrix()
//       renderer.setSize(mount.clientWidth, mount.clientHeight)
//     }
//     window.addEventListener('resize', onResize)

//     // ── Animate ───────────────────────────────────────────────────────────
//     const clock = new TRecuriterEE.Clock()
//     let cx = 0, cy = 0, raf
//     const animate = () => {
//       raf = requestAnimationFrame(animate)
//       const t = clock.getElapsedTime()
//       cx += (tx - cx) * 0.025; cy += (ty - cy) * 0.025

//       stars.rotation.y = t * 0.012; stars.rotation.x = t * 0.004
//       core.rotation.y = t * 0.025; core.rotation.x = Math.sin(t*0.2)*0.08
//       armGroups.forEach((a, i) => { a.rotation.y = t * 0.018 + i * Math.PI })
//       shapes.forEach(s => {
//         s.rotation.x += s.userData.rx; s.rotation.y += s.userData.ry
//         s.position.y += Math.sin(t * s.userData.fy + s.userData.fo) * 0.012
//       })
//       linesMesh.rotation.y = t * 0.008; linesMesh.rotation.x = Math.sin(t*0.15)*0.05

//       camera.position.x += (cx * 5 - camera.position.x) * 0.04
//       camera.position.y += (-cy * 3 - camera.position.y) * 0.04
//       camera.lookAt(0, 0, 0)
//       renderer.render(scene, camera)
//     }
//     animate()

//     return () => {
//       cancelAnimationFrame(raf)
//       window.removeEventListener('mousemove', onMouse)
//       window.removeEventListener('resize', onResize)
//       if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
//       renderer.dispose()
//     }
//   }, [])

//   return <div ref={mountRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
// }

// export default ThreeBackground


// import { useEffect, useRef } from 'react'
// import { useSelector } from 'react-redux'
// import * as TRecuriterEE from 'three'

// /* ─────────────────────────────────────────────────────────────────────────────
//    recruitEdge Background — Three.js
//    • Floating glowing circle rings
//    • Smooth drifting circle particles (sprite-based = always round)
//    • Soft connecting lines between nearby nodes
//    • Gentle mouse parallax
//    • Full dark / light theme support
// ───────────────────────────────────────────────────────────────────────────── */

// // Build a circular sprite texture (always renders as circle, not square)
// function makeCircleTexture(size = 128) {
//   const canvas = document.createElement('canvas')
//   canvas.width = canvas.height = size
//   const ctx = canvas.getContext('2d')
//   const half = size / 2
//   const grad = ctx.createRadialGradient(half, half, 0, half, half, half)
//   grad.addColorStop(0,   'rgba(255,255,255,1)')
//   grad.addColorStop(0.4, 'rgba(255,255,255,0.8)')
//   grad.addColorStop(1,   'rgba(255,255,255,0)')
//   ctx.fillStyle = grad
//   ctx.fillRect(0, 0, size, size)
//   return new TRecuriterEE.CanvasTexture(canvas)
// }

// // Build a glowing ring texture
// function makeRingTexture(size = 256) {
//   const canvas = document.createElement('canvas')
//   canvas.width = canvas.height = size
//   const ctx = canvas.getContext('2d')
//   const half = size / 2
//   const r = half * 0.82
//   const grad = ctx.createRadialGradient(half, half, r * 0.7, half, half, r)
//   grad.addColorStop(0,   'rgba(255,255,255,0)')
//   grad.addColorStop(0.45,'rgba(255,255,255,0.9)')
//   grad.addColorStop(0.55,'rgba(255,255,255,0.9)')
//   grad.addColorStop(1,   'rgba(255,255,255,0)')
//   ctx.fillStyle = grad
//   ctx.fillRect(0, 0, size, size)
//   return new TRecuriterEE.CanvasTexture(canvas)
// }

// const ThreeBackground = () => {
//   const mountRef = useRef(null)
//   const { mode } = useSelector(s => s.theme) || { mode: 'dark' }
//   const isLight = mode === 'light'

//   useEffect(() => {
//     const mount = mountRef.current
//     if (!mount) return

//     // ── Renderer ──────────────────────────────────────────────────────────
//     const W = mount.clientWidth, H = mount.clientHeight
//     const scene = new TRecuriterEE.Scene()
//     const camera = new TRecuriterEE.PerspectiveCamera(55, W / H, 0.1, 500)
//     camera.position.set(0, 0, 50)

//     const renderer = new TRecuriterEE.WebGLRenderer({ antialias: true, alpha: true })
//     renderer.setSize(W, H)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//     renderer.setClearColor(0x000000, 0)
//     mount.appendChild(renderer.domElement)

//     const circleTex = makeCircleTexture(128)
//     const ringTex   = makeRingTexture(256)

//     // ── Theme colours ─────────────────────────────────────────────────────
//     const COLORS = isLight
//       ? ['#6366f1','#8b5cf6','#0ea5e9','#a78bfa','#6366f1','#38bdf8']
//       : ['#6366f1','#8b5cf6','#22d3ee','#a78bfa','#818cf8','#38bdf8']

//     const threeColors = COLORS.map(c => new TRecuriterEE.Color(c))
//     const pickColor = () => threeColors[Math.floor(Math.random() * threeColors.length)]

//     // ── 1. Drifting circle particles (sprite = always round) ──────────────
//     const PARTICLE_COUNT = 220
//     const pPositions = new Float32Array(PARTICLE_COUNT * 3)
//     const pColors    = new Float32Array(PARTICLE_COUNT * 3)
//     const pSizes     = new Float32Array(PARTICLE_COUNT)
//     // Per-particle drift data stored separately
//     const drift = []

//     for (let i = 0; i < PARTICLE_COUNT; i++) {
//       const x = (Math.random() - 0.5) * 110
//       const y = (Math.random() - 0.5) * 70
//       const z = (Math.random() - 0.5) * 40 - 5
//       pPositions[i*3]   = x
//       pPositions[i*3+1] = y
//       pPositions[i*3+2] = z
//       const c = pickColor()
//       pColors[i*3] = c.r; pColors[i*3+1] = c.g; pColors[i*3+2] = c.b
//       pSizes[i] = Math.random() * 14 + 4

//       // Drift: circular orbit + gentle float
//       drift.push({
//         ox: x, oy: y, oz: z,
//         speed:  Math.random() * 0.3 + 0.05,
//         radius: Math.random() * 3 + 0.5,
//         phase:  Math.random() * Math.PI * 2,
//         phaseY: Math.random() * Math.PI * 2,
//         vy:     (Math.random() - 0.5) * 0.008,
//       })
//     }

//     const pGeo = new TRecuriterEE.BufferGeometry()
//     pGeo.setAttribute('position', new TRecuriterEE.BufferAttribute(pPositions, 3))
//     pGeo.setAttribute('color',    new TRecuriterEE.BufferAttribute(pColors, 3))
//     pGeo.setAttribute('size',     new TRecuriterEE.BufferAttribute(pSizes, 1))

//     const pMat = new TRecuriterEE.PointsMaterial({
//       map: circleTex,
//       vertexColors: true,
//       transparent: true,
//       opacity: isLight ? 0.42 : 0.65,
//       blending: TRecuriterEE.AdditiveBlending,
//       depthWrite: false,
//       sizeAttenuation: true,
//       size: 1,
//     })
//     // We'll update sizes manually; use the size attribute via ShaderMaterial trick
//     // Actually, PointsMaterial uses a single size. For per-particle size we'll use
//     // a simple ShaderMaterial instead:
//     const pMatShader = new TRecuriterEE.ShaderMaterial({
//       uniforms: { uTex: { value: circleTex }, uOpacity: { value: isLight ? 0.42 : 0.65 } },
//       vertexShader: `
//         attribute float size;
//         attribute vec3 color;
//         varying vec3 vColor;
//         void main() {
//           vColor = color;
//           vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
//           gl_PointSize = size * (300.0 / -mvPos.z);
//           gl_Position = projectionMatrix * mvPos;
//         }
//       `,
//       fragmentShader: `
//         uniform sampler2D uTex;
//         uniform float uOpacity;
//         varying vec3 vColor;
//         void main() {
//           vec4 tex = texture2D(uTex, gl_PointCoord);
//           gl_FragColor = vec4(vColor, tex.a * uOpacity);
//         }
//       `,
//       transparent: true,
//       blending: TRecuriterEE.AdditiveBlending,
//       depthWrite: false,
//     })

//     const particles = new TRecuriterEE.Points(pGeo, pMatShader)
//     scene.add(particles)

//     // ── 2. Floating glowing ring circles ─────────────────────────────────
//     const RINGS = [
//       { x: -18, y:  8, z: -10, scale: 7,  color: '#6366f1', speed: 0.003, opacity: isLight ? 0.09 : 0.16 },
//       { x:  16, y: -6, z:  -8, scale: 5,  color: '#8b5cf6', speed: 0.005, opacity: isLight ? 0.07 : 0.13 },
//       { x:   2, y: 14, z: -14, scale: 9,  color: '#22d3ee', speed: 0.002, opacity: isLight ? 0.06 : 0.11 },
//       { x: -10, y:-12, z:  -6, scale: 4,  color: '#a78bfa', speed: 0.007, opacity: isLight ? 0.08 : 0.14 },
//       { x:  20, y: 10, z: -12, scale: 6,  color: '#38bdf8', speed: 0.004, opacity: isLight ? 0.05 : 0.10 },
//       { x:  -4, y: -8, z:  -4, scale: 3,  color: '#6366f1', speed: 0.009, opacity: isLight ? 0.06 : 0.12 },
//       { x:  12, y:  6, z: -16, scale: 11, color: '#8b5cf6', speed: 0.0015,opacity: isLight ? 0.04 : 0.08 },
//     ]

//     const ringMeshes = RINGS.map(r => {
//       const mat = new TRecuriterEE.SpriteMaterial({
//         map: ringTex,
//         color: new TRecuriterEE.Color(r.color),
//         transparent: true,
//         opacity: r.opacity,
//         blending: TRecuriterEE.AdditiveBlending,
//         depthWrite: false,
//       })
//       const sprite = new TRecuriterEE.Sprite(mat)
//       sprite.position.set(r.x, r.y, r.z)
//       sprite.scale.set(r.scale * 2, r.scale * 2, 1)
//       sprite.userData = {
//         ox: r.x, oy: r.y,
//         speed: r.speed,
//         floatAmp: Math.random() * 1.5 + 0.5,
//         floatPhase: Math.random() * Math.PI * 2,
//         pulseSpeed: Math.random() * 0.6 + 0.3,
//         pulsePhase: Math.random() * Math.PI * 2,
//         baseScale: r.scale * 2,
//         baseOpacity: r.opacity,
//       }
//       scene.add(sprite)
//       return sprite
//     })

//     // ── 3. Soft connecting lines between nearby nodes ─────────────────────
//     const NODE_COUNT = 45
//     const nodes = Array.from({ length: NODE_COUNT }, () => ({
//       x: (Math.random() - 0.5) * 90,
//       y: (Math.random() - 0.5) * 60,
//       z: (Math.random() - 0.5) * 20 - 8,
//       vx: (Math.random() - 0.5) * 0.018,
//       vy: (Math.random() - 0.5) * 0.012,
//     }))

//     const MAX_LINE_DIST = 22
//     // Pre-build line geometry with enough capacity
//     const maxLines = NODE_COUNT * NODE_COUNT
//     const linePositions = new Float32Array(maxLines * 6)
//     const lineGeo = new TRecuriterEE.BufferGeometry()
//     lineGeo.setAttribute('position', new TRecuriterEE.BufferAttribute(linePositions, 3))
//     const lineMat = new TRecuriterEE.LineBasicMaterial({
//       color: 0x6366f1, transparent: true,
//       opacity: isLight ? 0.07 : 0.12,
//     })
//     const linesMesh = new TRecuriterEE.LineSegments(lineGeo, lineMat)
//     scene.add(linesMesh)

//     // ── 4. Large ambient circle halos (background depth) ──────────────────
//     const HALOS = [
//       { x:  0, y:  0, z: -20, scale: 28, color: '#6366f1', opacity: isLight ? 0.025 : 0.05 },
//       { x: 20, y: -10,z: -25, scale: 18, color: '#8b5cf6', opacity: isLight ? 0.018 : 0.04 },
//       { x:-15, y: 12, z: -22, scale: 22, color: '#22d3ee', opacity: isLight ? 0.015 : 0.035 },
//     ]
//     HALOS.forEach(h => {
//       const mat = new TRecuriterEE.SpriteMaterial({
//         map: circleTex,
//         color: new TRecuriterEE.Color(h.color),
//         transparent: true,
//         opacity: h.opacity,
//         blending: TRecuriterEE.AdditiveBlending,
//         depthWrite: false,
//       })
//       const sprite = new TRecuriterEE.Sprite(mat)
//       sprite.position.set(h.x, h.y, h.z)
//       sprite.scale.set(h.scale * 2, h.scale * 2, 1)
//       scene.add(sprite)
//     })

//     // ── Mouse parallax ────────────────────────────────────────────────────
//     let tx = 0, ty = 0
//     const onMouse = e => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2 }
//     const onTouch = e => {
//       if (!e.touches[0]) return
//       tx = (e.touches[0].clientX / window.innerWidth  - 0.5) * 2
//       ty = (e.touches[0].clientY / window.innerHeight - 0.5) * 2
//     }
//     window.addEventListener('mousemove', onMouse)
//     window.addEventListener('touchmove', onTouch, { passive: true })

//     const onResize = () => {
//       camera.aspect = mount.clientWidth / mount.clientHeight
//       camera.updateProjectionMatrix()
//       renderer.setSize(mount.clientWidth, mount.clientHeight)
//     }
//     window.addEventListener('resize', onResize)

//     // ── Animation loop ────────────────────────────────────────────────────
//     const clock = new TRecuriterEE.Clock()
//     let cx = 0, cy = 0, raf

//     const animate = () => {
//       raf = requestAnimationFrame(animate)
//       const t = clock.getElapsedTime()

//       // Smooth camera parallax
//       cx += (tx - cx) * 0.028
//       cy += (ty - cy) * 0.028
//       camera.position.x += (cx * 6 - camera.position.x) * 0.04
//       camera.position.y += (-cy * 4 - camera.position.y) * 0.04
//       camera.lookAt(0, 0, 0)

//       // ── Drift particles ──────────────────────────────────────────────
//       const pos = pGeo.attributes.position.array
//       for (let i = 0; i < PARTICLE_COUNT; i++) {
//         const d = drift[i]
//         // Circular drift around origin point
//         const angle = t * d.speed + d.phase
//         pos[i*3]   = d.ox + Math.cos(angle) * d.radius
//         pos[i*3+1] = d.oy + Math.sin(angle * 0.7 + d.phaseY) * d.radius * 0.6
//         pos[i*3+2] = d.oz + Math.sin(angle * 0.4) * (d.radius * 0.3)
//       }
//       pGeo.attributes.position.needsUpdate = true

//       // ── Floating rings: pulse + float ────────────────────────────────
//       ringMeshes.forEach((sprite, i) => {
//         const ud = sprite.userData
//         const floatY = Math.sin(t * ud.floatSpeed + ud.floatPhase) * ud.floatAmp
//         sprite.position.y = ud.oy + floatY

//         // Pulse scale
//         const pulse = 1 + Math.sin(t * ud.pulseSpeed + ud.pulsePhase) * 0.08
//         sprite.scale.set(ud.baseScale * pulse, ud.baseScale * pulse, 1)

//         // Breathe opacity
//         sprite.material.opacity = ud.baseOpacity * (0.8 + Math.sin(t * ud.pulseSpeed * 0.5 + ud.pulsePhase) * 0.2)
//       })

//       // ── Animate node network ─────────────────────────────────────────
//       nodes.forEach(n => {
//         n.x += n.vx; n.y += n.vy
//         // Gentle bounce at boundaries
//         if (Math.abs(n.x) > 45) n.vx *= -1
//         if (Math.abs(n.y) > 30) n.vy *= -1
//       })

//       // Rebuild line segments
//       let lineIdx = 0
//       nodes.forEach((a, i) => {
//         nodes.forEach((b, j) => {
//           if (j <= i) return
//           const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z
//           const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
//           if (dist < MAX_LINE_DIST && lineIdx + 6 <= linePositions.length) {
//             linePositions[lineIdx++] = a.x; linePositions[lineIdx++] = a.y; linePositions[lineIdx++] = a.z
//             linePositions[lineIdx++] = b.x; linePositions[lineIdx++] = b.y; linePositions[lineIdx++] = b.z
//           }
//         })
//       })
//       // Zero out unused segment slots
//       for (let k = lineIdx; k < linePositions.length; k++) linePositions[k] = 0
//       lineGeo.attributes.position.needsUpdate = true
//       lineGeo.setDrawRange(0, lineIdx / 3)

//       renderer.render(scene, camera)
//     }
//     animate()

//     // ── Cleanup ───────────────────────────────────────────────────────────
//     return () => {
//       cancelAnimationFrame(raf)
//       window.removeEventListener('mousemove', onMouse)
//       window.removeEventListener('touchmove', onTouch)
//       window.removeEventListener('resize', onResize)
//       circleTex.dispose()
//       ringTex.dispose()
//       if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
//       renderer.dispose()
//     }
//   }, [mode])

//   return (
//     <div
//       ref={mountRef}
//       className="three-bg"
//       style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
//     />
//   )
// }

// export default ThreeBackground



// import { useEffect, useRef } from 'react'
// import { useSelector } from 'react-redux'
// import * as TRecuriterEE from 'three'

// /* ─────────────────────────────────────────────────────────────────────────────
//    recruitEdge Background — Three.js
//    • Floating glowing circle rings (reduced)
//    • Mixed big + small drifting circle particles
//    • Square particles (flat sprite-based squares)
//    • Dense small line network (short-range, high node count)
//    • Soft connecting lines between nearby nodes (ambient mesh)
//    • Gentle mouse parallax
//    • Full dark / light theme support
// ───────────────────────────────────────────────────────────────────────────── */

// // Circular sprite texture (smooth glow falloff)
// function makeCircleTexture(size = 128) {
//   const canvas = document.createElement('canvas')
//   canvas.width = canvas.height = size
//   const ctx = canvas.getContext('2d')
//   const half = size / 2
//   const grad = ctx.createRadialGradient(half, half, 0, half, half, half)
//   grad.addColorStop(0,   'rgba(255,255,255,1)')
//   grad.addColorStop(0.4, 'rgba(255,255,255,0.8)')
//   grad.addColorStop(1,   'rgba(255,255,255,0)')
//   ctx.fillStyle = grad
//   ctx.fillRect(0, 0, size, size)
//   return new TRecuriterEE.CanvasTexture(canvas)
// }

// // Glowing ring texture
// function makeRingTexture(size = 256) {
//   const canvas = document.createElement('canvas')
//   canvas.width = canvas.height = size
//   const ctx = canvas.getContext('2d')
//   const half = size / 2
//   const r = half * 0.82
//   const grad = ctx.createRadialGradient(half, half, r * 0.7, half, half, r)
//   grad.addColorStop(0,   'rgba(255,255,255,0)')
//   grad.addColorStop(0.45,'rgba(255,255,255,0.9)')
//   grad.addColorStop(0.55,'rgba(255,255,255,0.9)')
//   grad.addColorStop(1,   'rgba(255,255,255,0)')
//   ctx.fillStyle = grad
//   ctx.fillRect(0, 0, size, size)
//   return new TRecuriterEE.CanvasTexture(canvas)
// }

// // Soft square sprite texture (slightly rounded corners, glow edge)
// function makeSquareTexture(size = 128) {
//   const canvas = document.createElement('canvas')
//   canvas.width = canvas.height = size
//   const ctx = canvas.getContext('2d')
//   const pad = size * 0.12
//   const r = size * 0.14 // corner radius
//   const s = size - pad * 2
//   ctx.beginPath()
//   ctx.moveTo(pad + r, pad)
//   ctx.lineTo(pad + s - r, pad)
//   ctx.arcTo(pad + s, pad, pad + s, pad + r, r)
//   ctx.lineTo(pad + s, pad + s - r)
//   ctx.arcTo(pad + s, pad + s, pad + s - r, pad + s, r)
//   ctx.lineTo(pad + r, pad + s)
//   ctx.arcTo(pad, pad + s, pad, pad + s - r, r)
//   ctx.lineTo(pad, pad + r)
//   ctx.arcTo(pad, pad, pad + r, pad, r)
//   ctx.closePath()
//   // Soft glow fill
//   const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
//   grad.addColorStop(0,   'rgba(255,255,255,0.95)')
//   grad.addColorStop(0.6, 'rgba(255,255,255,0.7)')
//   grad.addColorStop(1,   'rgba(255,255,255,0)')
//   ctx.fillStyle = grad
//   ctx.fill()
//   return new TRecuriterEE.CanvasTexture(canvas)
// }

// const ThreeBackground = () => {
//   const mountRef = useRef(null)
//   const { mode } = useSelector(s => s.theme) || { mode: 'dark' }
//   const isLight = mode === 'light'

//   useEffect(() => {
//     const mount = mountRef.current
//     if (!mount) return

//     // ── Renderer ──────────────────────────────────────────────────────────
//     const W = mount.clientWidth, H = mount.clientHeight
//     const scene = new TRecuriterEE.Scene()
//     const camera = new TRecuriterEE.PerspectiveCamera(55, W / H, 0.1, 500)
//     camera.position.set(0, 0, 50)

//     const renderer = new TRecuriterEE.WebGLRenderer({ antialias: true, alpha: true })
//     renderer.setSize(W, H)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//     renderer.setClearColor(0x000000, 0)
//     mount.appendChild(renderer.domElement)

//     const circleTex = makeCircleTexture(128)
//     const ringTex   = makeRingTexture(256)
//     const squareTex = makeSquareTexture(128)

//     // ── Theme colours ─────────────────────────────────────────────────────
//     const COLORS = isLight
//       ? ['#6366f1','#8b5cf6','#0ea5e9','#a78bfa','#6366f1','#38bdf8']
//       : ['#6366f1','#8b5cf6','#22d3ee','#a78bfa','#818cf8','#38bdf8']

//     const threeColors = COLORS.map(c => new TRecuriterEE.Color(c))
//     const pickColor = () => threeColors[Math.floor(Math.random() * threeColors.length)]

//     // ── Shared ShaderMaterial factory ─────────────────────────────────────
//     const makeShaderMat = (tex, opacity) => new TRecuriterEE.ShaderMaterial({
//       uniforms: { uTex: { value: tex }, uOpacity: { value: opacity } },
//       vertexShader: `
//         attribute float size;
//         attribute vec3 color;
//         varying vec3 vColor;
//         void main() {
//           vColor = color;
//           vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
//           gl_PointSize = size * (300.0 / -mvPos.z);
//           gl_Position = projectionMatrix * mvPos;
//         }
//       `,
//       fragmentShader: `
//         uniform sampler2D uTex;
//         uniform float uOpacity;
//         varying vec3 vColor;
//         void main() {
//           vec4 tex = texture2D(uTex, gl_PointCoord);
//           gl_FragColor = vec4(vColor, tex.a * uOpacity);
//         }
//       `,
//       transparent: true,
//       blending: TRecuriterEE.AdditiveBlending,
//       depthWrite: false,
//     })

//     // ── 1. Circle particles — BIG ones (5–8 total) ────────────────────────
//     const BIG_COUNT = 7
//     const bigPos    = new Float32Array(BIG_COUNT * 3)
//     const bigCol    = new Float32Array(BIG_COUNT * 3)
//     const bigSizes  = new Float32Array(BIG_COUNT)
//     const bigDrift  = []

//     for (let i = 0; i < BIG_COUNT; i++) {
//       const x = (Math.random() - 0.5) * 90
//       const y = (Math.random() - 0.5) * 55
//       const z = (Math.random() - 0.5) * 20 - 5
//       bigPos[i*3]   = x; bigPos[i*3+1] = y; bigPos[i*3+2] = z
//       const c = pickColor()
//       bigCol[i*3] = c.r; bigCol[i*3+1] = c.g; bigCol[i*3+2] = c.b
//       bigSizes[i] = Math.random() * 20 + 28 // 28–48 → visibly large

//       bigDrift.push({
//         ox: x, oy: y, oz: z,
//         speed:  Math.random() * 0.12 + 0.04,
//         radius: Math.random() * 5 + 2,
//         phase:  Math.random() * Math.PI * 2,
//         phaseY: Math.random() * Math.PI * 2,
//       })
//     }

//     const bigGeo = new TRecuriterEE.BufferGeometry()
//     bigGeo.setAttribute('position', new TRecuriterEE.BufferAttribute(bigPos, 3))
//     bigGeo.setAttribute('color',    new TRecuriterEE.BufferAttribute(bigCol, 3))
//     bigGeo.setAttribute('size',     new TRecuriterEE.BufferAttribute(bigSizes, 1))
//     const bigMat = makeShaderMat(circleTex, isLight ? 0.28 : 0.45)
//     scene.add(new TRecuriterEE.Points(bigGeo, bigMat))

//     // ── 2. Circle particles — SMALL ones (40 total) ───────────────────────
//     const SMALL_COUNT = 40
//     const smPos   = new Float32Array(SMALL_COUNT * 3)
//     const smCol   = new Float32Array(SMALL_COUNT * 3)
//     const smSizes = new Float32Array(SMALL_COUNT)
//     const smDrift = []

//     for (let i = 0; i < SMALL_COUNT; i++) {
//       const x = (Math.random() - 0.5) * 110
//       const y = (Math.random() - 0.5) * 70
//       const z = (Math.random() - 0.5) * 40 - 5
//       smPos[i*3]   = x; smPos[i*3+1] = y; smPos[i*3+2] = z
//       const c = pickColor()
//       smCol[i*3] = c.r; smCol[i*3+1] = c.g; smCol[i*3+2] = c.b
//       smSizes[i] = Math.random() * 5 + 3 // 3–8 → small

//       smDrift.push({
//         ox: x, oy: y, oz: z,
//         speed:  Math.random() * 0.35 + 0.08,
//         radius: Math.random() * 2.5 + 0.5,
//         phase:  Math.random() * Math.PI * 2,
//         phaseY: Math.random() * Math.PI * 2,
//       })
//     }

//     const smGeo = new TRecuriterEE.BufferGeometry()
//     smGeo.setAttribute('position', new TRecuriterEE.BufferAttribute(smPos, 3))
//     smGeo.setAttribute('color',    new TRecuriterEE.BufferAttribute(smCol, 3))
//     smGeo.setAttribute('size',     new TRecuriterEE.BufferAttribute(smSizes, 1))
//     const smMat = makeShaderMat(circleTex, isLight ? 0.50 : 0.75)
//     scene.add(new TRecuriterEE.Points(smGeo, smMat))

//     // ── 3. Square particles (25 total, mixed sizes) ───────────────────────
//     const SQ_COUNT = 25
//     const sqPos   = new Float32Array(SQ_COUNT * 3)
//     const sqCol   = new Float32Array(SQ_COUNT * 3)
//     const sqSizes = new Float32Array(SQ_COUNT)
//     const sqDrift = []

//     for (let i = 0; i < SQ_COUNT; i++) {
//       const x = (Math.random() - 0.5) * 100
//       const y = (Math.random() - 0.5) * 65
//       const z = (Math.random() - 0.5) * 35 - 5
//       sqPos[i*3]   = x; sqPos[i*3+1] = y; sqPos[i*3+2] = z
//       const c = pickColor()
//       sqCol[i*3] = c.r; sqCol[i*3+1] = c.g; sqCol[i*3+2] = c.b
//       // Mix of small and medium squares
//       sqSizes[i] = i < 8
//         ? Math.random() * 12 + 14   // 8 medium squares: 14–26
//         : Math.random() * 6  + 4    // 17 small squares:  4–10

//       sqDrift.push({
//         ox: x, oy: y, oz: z,
//         speed:  Math.random() * 0.22 + 0.05,
//         radius: Math.random() * 3 + 0.8,
//         phase:  Math.random() * Math.PI * 2,
//         phaseY: Math.random() * Math.PI * 2,
//       })
//     }

//     const sqGeo = new TRecuriterEE.BufferGeometry()
//     sqGeo.setAttribute('position', new TRecuriterEE.BufferAttribute(sqPos, 3))
//     sqGeo.setAttribute('color',    new TRecuriterEE.BufferAttribute(sqCol, 3))
//     sqGeo.setAttribute('size',     new TRecuriterEE.BufferAttribute(sqSizes, 1))
//     const sqMat = makeShaderMat(squareTex, isLight ? 0.30 : 0.50)
//     scene.add(new TRecuriterEE.Points(sqGeo, sqMat))

//     // ── 4. Floating glowing ring circles ──────────────────────────────────
//     const RINGS = [
//       { x: -18, y:  8, z: -10, scale: 7,  color: '#6366f1', opacity: isLight ? 0.09 : 0.16 },
//       { x:  16, y: -6, z:  -8, scale: 5,  color: '#8b5cf6', opacity: isLight ? 0.07 : 0.13 },
//       { x:   2, y: 14, z: -14, scale: 9,  color: '#22d3ee', opacity: isLight ? 0.06 : 0.11 },
//       { x: -10, y:-12, z:  -6, scale: 4,  color: '#a78bfa', opacity: isLight ? 0.08 : 0.14 },
//       { x:  20, y: 10, z: -12, scale: 6,  color: '#38bdf8', opacity: isLight ? 0.05 : 0.10 },
//     ]

//     const ringMeshes = RINGS.map(r => {
//       const mat = new TRecuriterEE.SpriteMaterial({
//         map: ringTex,
//         color: new TRecuriterEE.Color(r.color),
//         transparent: true,
//         opacity: r.opacity,
//         blending: TRecuriterEE.AdditiveBlending,
//         depthWrite: false,
//       })
//       const sprite = new TRecuriterEE.Sprite(mat)
//       sprite.position.set(r.x, r.y, r.z)
//       sprite.scale.set(r.scale * 2, r.scale * 2, 1)
//       sprite.userData = {
//         ox: r.x, oy: r.y,
//         floatAmp:    Math.random() * 1.5 + 0.5,
//         floatPhase:  Math.random() * Math.PI * 2,
//         floatSpeed:  Math.random() * 0.3 + 0.15,
//         pulseSpeed:  Math.random() * 0.6 + 0.3,
//         pulsePhase:  Math.random() * Math.PI * 2,
//         baseScale:   r.scale * 2,
//         baseOpacity: r.opacity,
//       }
//       scene.add(sprite)
//       return sprite
//     })

//     // ── 5. AMBIENT node network (sparse, long-range) ──────────────────────
//     const NODE_COUNT = 35
//     const nodes = Array.from({ length: NODE_COUNT }, () => ({
//       x: (Math.random() - 0.5) * 90,
//       y: (Math.random() - 0.5) * 60,
//       z: (Math.random() - 0.5) * 20 - 8,
//       vx: (Math.random() - 0.5) * 0.015,
//       vy: (Math.random() - 0.5) * 0.010,
//     }))

//     const MAX_LINE_DIST = 22
//     const maxAmbientLines = NODE_COUNT * NODE_COUNT
//     const ambientLinePos = new Float32Array(maxAmbientLines * 6)
//     const ambientGeo = new TRecuriterEE.BufferGeometry()
//     ambientGeo.setAttribute('position', new TRecuriterEE.BufferAttribute(ambientLinePos, 3))
//     const ambientMat = new TRecuriterEE.LineBasicMaterial({
//       color: 0x6366f1, transparent: true,
//       opacity: isLight ? 0.06 : 0.10,
//     })
//     scene.add(new TRecuriterEE.LineSegments(ambientGeo, ambientMat))

//     // ── 6. SMALL dense line network (many short connections) ──────────────
//     const DENSE_COUNT = 60
//     const denseNodes = Array.from({ length: DENSE_COUNT }, () => ({
//       x: (Math.random() - 0.5) * 100,
//       y: (Math.random() - 0.5) * 65,
//       z: (Math.random() - 0.5) * 25 - 6,
//       vx: (Math.random() - 0.5) * 0.022,
//       vy: (Math.random() - 0.5) * 0.016,
//     }))

//     const DENSE_DIST = 11  // short range → tight clusters
//     const maxDenseLines = DENSE_COUNT * DENSE_COUNT
//     const denseLinePos = new Float32Array(maxDenseLines * 6)
//     const denseGeo = new TRecuriterEE.BufferGeometry()
//     denseGeo.setAttribute('position', new TRecuriterEE.BufferAttribute(denseLinePos, 3))
//     const denseMat = new TRecuriterEE.LineBasicMaterial({
//       color: 0xa78bfa, transparent: true,
//       opacity: isLight ? 0.09 : 0.16,
//     })
//     scene.add(new TRecuriterEE.LineSegments(denseGeo, denseMat))

//     // ── 7. Large ambient circle halos (background depth) ──────────────────
//     const HALOS = [
//       { x:  0,  y:  0, z: -20, scale: 28, color: '#6366f1', opacity: isLight ? 0.025 : 0.05 },
//       { x: 20,  y:-10, z: -25, scale: 18, color: '#8b5cf6', opacity: isLight ? 0.018 : 0.04 },
//       { x:-15,  y: 12, z: -22, scale: 22, color: '#22d3ee', opacity: isLight ? 0.015 : 0.035 },
//     ]
//     HALOS.forEach(h => {
//       const mat = new TRecuriterEE.SpriteMaterial({
//         map: circleTex,
//         color: new TRecuriterEE.Color(h.color),
//         transparent: true,
//         opacity: h.opacity,
//         blending: TRecuriterEE.AdditiveBlending,
//         depthWrite: false,
//       })
//       const sprite = new TRecuriterEE.Sprite(mat)
//       sprite.position.set(h.x, h.y, h.z)
//       sprite.scale.set(h.scale * 2, h.scale * 2, 1)
//       scene.add(sprite)
//     })

//     // ── Mouse parallax ────────────────────────────────────────────────────
//     let tx = 0, ty = 0
//     const onMouse = e => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2 }
//     const onTouch = e => {
//       if (!e.touches[0]) return
//       tx = (e.touches[0].clientX / window.innerWidth  - 0.5) * 2
//       ty = (e.touches[0].clientY / window.innerHeight - 0.5) * 2
//     }
//     window.addEventListener('mousemove', onMouse)
//     window.addEventListener('touchmove', onTouch, { passive: true })

//     const onResize = () => {
//       camera.aspect = mount.clientWidth / mount.clientHeight
//       camera.updateProjectionMatrix()
//       renderer.setSize(mount.clientWidth, mount.clientHeight)
//     }
//     window.addEventListener('resize', onResize)

//     // ── Animation loop ────────────────────────────────────────────────────
//     const clock = new TRecuriterEE.Clock()
//     let cx = 0, cy = 0, raf

//     // Helper: rebuild line segments from a node array into a Float32Array
//     const rebuildLines = (nodeArr, posArr, maxDist, geo) => {
//       let idx = 0
//       nodeArr.forEach((a, i) => {
//         nodeArr.forEach((b, j) => {
//           if (j <= i) return
//           const dx = a.x - b.x, dy = a.y - b.y, dz = (a.z || 0) - (b.z || 0)
//           const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
//           if (dist < maxDist && idx + 6 <= posArr.length) {
//             posArr[idx++] = a.x; posArr[idx++] = a.y; posArr[idx++] = a.z || 0
//             posArr[idx++] = b.x; posArr[idx++] = b.y; posArr[idx++] = b.z || 0
//           }
//         })
//       })
//       for (let k = idx; k < posArr.length; k++) posArr[k] = 0
//       geo.attributes.position.needsUpdate = true
//       geo.setDrawRange(0, idx / 3)
//     }

//     const animate = () => {
//       raf = requestAnimationFrame(animate)
//       const t = clock.getElapsedTime()

//       // Smooth camera parallax
//       cx += (tx - cx) * 0.028
//       cy += (ty - cy) * 0.028
//       camera.position.x += (cx * 6 - camera.position.x) * 0.04
//       camera.position.y += (-cy * 4 - camera.position.y) * 0.04
//       camera.lookAt(0, 0, 0)

//       // ── Drift: big circles ───────────────────────────────────────────
//       for (let i = 0; i < BIG_COUNT; i++) {
//         const d = bigDrift[i]
//         const angle = t * d.speed + d.phase
//         bigPos[i*3]   = d.ox + Math.cos(angle) * d.radius
//         bigPos[i*3+1] = d.oy + Math.sin(angle * 0.7 + d.phaseY) * d.radius * 0.6
//         bigPos[i*3+2] = d.oz + Math.sin(angle * 0.4) * d.radius * 0.3
//       }
//       bigGeo.attributes.position.needsUpdate = true

//       // ── Drift: small circles ─────────────────────────────────────────
//       for (let i = 0; i < SMALL_COUNT; i++) {
//         const d = smDrift[i]
//         const angle = t * d.speed + d.phase
//         smPos[i*3]   = d.ox + Math.cos(angle) * d.radius
//         smPos[i*3+1] = d.oy + Math.sin(angle * 0.7 + d.phaseY) * d.radius * 0.6
//         smPos[i*3+2] = d.oz + Math.sin(angle * 0.4) * d.radius * 0.3
//       }
//       smGeo.attributes.position.needsUpdate = true

//       // ── Drift: squares ───────────────────────────────────────────────
//       for (let i = 0; i < SQ_COUNT; i++) {
//         const d = sqDrift[i]
//         const angle = t * d.speed + d.phase
//         sqPos[i*3]   = d.ox + Math.cos(angle) * d.radius
//         sqPos[i*3+1] = d.oy + Math.sin(angle * 0.65 + d.phaseY) * d.radius * 0.55
//         sqPos[i*3+2] = d.oz + Math.sin(angle * 0.35) * d.radius * 0.25
//       }
//       sqGeo.attributes.position.needsUpdate = true

//       // ── Floating rings ───────────────────────────────────────────────
//       ringMeshes.forEach(sprite => {
//         const ud = sprite.userData
//         sprite.position.y = ud.oy + Math.sin(t * ud.floatSpeed + ud.floatPhase) * ud.floatAmp
//         const pulse = 1 + Math.sin(t * ud.pulseSpeed + ud.pulsePhase) * 0.08
//         sprite.scale.set(ud.baseScale * pulse, ud.baseScale * pulse, 1)
//         sprite.material.opacity = ud.baseOpacity * (0.8 + Math.sin(t * ud.pulseSpeed * 0.5 + ud.pulsePhase) * 0.2)
//       })

//       // ── Ambient node network ─────────────────────────────────────────
//       nodes.forEach(n => {
//         n.x += n.vx; n.y += n.vy
//         if (Math.abs(n.x) > 45) n.vx *= -1
//         if (Math.abs(n.y) > 30) n.vy *= -1
//       })
//       rebuildLines(nodes, ambientLinePos, MAX_LINE_DIST, ambientGeo)

//       // ── Dense small line network ─────────────────────────────────────
//       denseNodes.forEach(n => {
//         n.x += n.vx; n.y += n.vy
//         if (Math.abs(n.x) > 50) n.vx *= -1
//         if (Math.abs(n.y) > 33) n.vy *= -1
//       })
//       rebuildLines(denseNodes, denseLinePos, DENSE_DIST, denseGeo)

//       renderer.render(scene, camera)
//     }
//     animate()

//     // ── Cleanup ───────────────────────────────────────────────────────────
//     return () => {
//       cancelAnimationFrame(raf)
//       window.removeEventListener('mousemove', onMouse)
//       window.removeEventListener('touchmove', onTouch)
//       window.removeEventListener('resize', onResize)
//       circleTex.dispose()
//       ringTex.dispose()
//       squareTex.dispose()
//       if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
//       renderer.dispose()
//     }
//   }, [mode])

//   return (
//     <div
//       ref={mountRef}
//       className="three-bg"
//       style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
//     />
//   )
// }

// export default ThreeBackground
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import * as TRecuriterEE from 'three'

/* ─────────────────────────────────────────────────────────────────────────────
   recruitEdge Background — Three.js  (Day / Night aware)

   NIGHT  → AdditiveBlending, bright palette, particles glow against dark bg
   DAY    → NormalBlending,   rich saturated colors, visible against light bg
───────────────────────────────────────────────────────────────────────────── */

// ── Sprite textures ──────────────────────────────────────────────────────────

function makeCircleTexture(size = 128) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d'), h = size / 2
  const g = ctx.createRadialGradient(h, h, 0, h, h, h)
  g.addColorStop(0,   'rgba(255,255,255,1)')
  g.addColorStop(0.5, 'rgba(255,255,255,0.6)')
  g.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new TRecuriterEE.CanvasTexture(c)
}

function makeRingTexture(size = 256) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d'), h = size / 2, r = h * 0.82
  const g = ctx.createRadialGradient(h, h, r * 0.68, h, h, r)
  g.addColorStop(0,    'rgba(255,255,255,0)')
  g.addColorStop(0.42, 'rgba(255,255,255,1)')
  g.addColorStop(0.58, 'rgba(255,255,255,1)')
  g.addColorStop(1,    'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new TRecuriterEE.CanvasTexture(c)
}

function makeSquareTexture(size = 128) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const pad = size * 0.10, r = size * 0.14, s = size - pad * 2
  ctx.beginPath()
  ctx.moveTo(pad + r, pad)
  ctx.lineTo(pad + s - r, pad)
  ctx.arcTo(pad + s, pad,     pad + s, pad + r,     r)
  ctx.lineTo(pad + s, pad + s - r)
  ctx.arcTo(pad + s, pad + s, pad + s - r, pad + s, r)
  ctx.lineTo(pad + r, pad + s)
  ctx.arcTo(pad,     pad + s, pad, pad + s - r,     r)
  ctx.lineTo(pad,     pad + r)
  ctx.arcTo(pad,     pad,     pad + r, pad,          r)
  ctx.closePath()
  const h = size / 2
  const g = ctx.createRadialGradient(h, h, 0, h, h, h * 0.9)
  g.addColorStop(0,   'rgba(255,255,255,1)')
  g.addColorStop(0.7, 'rgba(255,255,255,0.75)')
  g.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fill()
  return new TRecuriterEE.CanvasTexture(c)
}

// ── Shader material (per-vertex size + color, blending passed in) ────────────
function makeShaderMat(tex, opacity, blending) {
  return new TRecuriterEE.ShaderMaterial({
    uniforms: {
      uTex:     { value: tex },
      uOpacity: { value: opacity },
    },
    vertexShader: `
      attribute float size;
      attribute vec3  color;
      varying   vec3  vColor;
      void main() {
        vColor = color;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPos.z);
        gl_Position  = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform sampler2D uTex;
      uniform float     uOpacity;
      varying vec3      vColor;
      void main() {
        vec4 tex = texture2D(uTex, gl_PointCoord);
        gl_FragColor = vec4(vColor * tex.rgb, tex.a * uOpacity);
      }
    `,
    transparent: true,
    blending,
    depthWrite: false,
  })
}

// ── Theme config ──────────────────────────────────────────────────────────────
const THEME = {
  dark: {
    blending:     TRecuriterEE.AdditiveBlending,
    // particles
    bigOpacity:   0.55,
    smallOpacity: 0.80,
    sqOpacity:    0.55,
    colors: ['#6366f1','#8b5cf6','#22d3ee','#a78bfa','#818cf8','#38bdf8'],
    // lines
    ambientLine:  { color: 0x6366f1, opacity: 0.12 },
    denseLine:    { color: 0xa78bfa, opacity: 0.20 },
    // rings
    ringColors:   ['#6366f1','#8b5cf6','#22d3ee','#a78bfa','#38bdf8'],
    ringOpacities:[0.18, 0.14, 0.12, 0.15, 0.11],
    // halos
    haloColors:   ['#6366f1','#8b5cf6','#22d3ee'],
    haloOpacities:[0.06, 0.05, 0.04],
  },
  light: {
    blending:     TRecuriterEE.NormalBlending,   // ← KEY: normal blending so color shows on white
    // particles — rich saturated colors, solid enough to read on white bg
    bigOpacity:   0.55,
    smallOpacity: 0.70,
    sqOpacity:    0.60,
    // Deep saturated palette — visible on light backgrounds
    colors: ['#4f46e5','#7c3aed','#0284c7','#6d28d9','#2563eb','#0369a1'],
    // lines — darker so they show on white
    ambientLine:  { color: 0x4f46e5, opacity: 0.18 },
    denseLine:    { color: 0x7c3aed, opacity: 0.22 },
    // rings — deeper colors + higher opacity
    ringColors:   ['#4f46e5','#7c3aed','#0284c7','#6d28d9','#2563eb'],
    ringOpacities:[0.22, 0.18, 0.16, 0.20, 0.14],
    // halos — visible tint on light bg
    haloColors:   ['#4f46e5','#7c3aed','#0284c7'],
    haloOpacities:[0.08, 0.06, 0.05],
  },
}

// ── Component ─────────────────────────────────────────────────────────────────
const ThreeBackground = () => {
  const mountRef = useRef(null)
  const { mode } = useSelector(s => s.theme) || { mode: 'dark' }
  const isLight  = mode === 'light'
  const T        = isLight ? THEME.light : THEME.dark

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth, H = mount.clientHeight
    const scene  = new TRecuriterEE.Scene()
    const camera = new TRecuriterEE.PerspectiveCamera(55, W / H, 0.1, 500)
    camera.position.set(0, 0, 50)

    const renderer = new TRecuriterEE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Textures ──────────────────────────────────────────────────────────
    const circleTex = makeCircleTexture(128)
    const ringTex   = makeRingTexture(256)
    const squareTex = makeSquareTexture(128)

    const threeColors = T.colors.map(c => new TRecuriterEE.Color(c))
    const pickColor   = () => threeColors[Math.floor(Math.random() * threeColors.length)]

    // ── Particle builder ──────────────────────────────────────────────────
    const buildParticles = (count, tex, opacity, sizeRange, spreadX, spreadY, spreadZ) => {
      const pos   = new Float32Array(count * 3)
      const col   = new Float32Array(count * 3)
      const sizes = new Float32Array(count)
      const drift = []

      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * spreadX
        const y = (Math.random() - 0.5) * spreadY
        const z = (Math.random() - 0.5) * spreadZ - 5
        pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z
        const c = pickColor()
        col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b
        sizes[i] = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0]
        drift.push({
          ox: x, oy: y, oz: z,
          speed:  Math.random() * 0.25 + 0.05,
          radius: Math.random() * 4 + 0.8,
          phase:  Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
        })
      }

      const geo = new TRecuriterEE.BufferGeometry()
      geo.setAttribute('position', new TRecuriterEE.BufferAttribute(pos,   3))
      geo.setAttribute('color',    new TRecuriterEE.BufferAttribute(col,   3))
      geo.setAttribute('size',     new TRecuriterEE.BufferAttribute(sizes, 1))
      scene.add(new TRecuriterEE.Points(geo, makeShaderMat(tex, opacity, T.blending)))
      return { geo, pos, drift, count }
    }

    // 7 big circles (28–48 px, slow)
    const big = buildParticles(7,  circleTex, T.bigOpacity,   [28, 48], 90,  55, 20)
    // 40 small circles (3–8 px, fast sparkle)
    const sm  = buildParticles(40, circleTex, T.smallOpacity, [3,   8], 110, 70, 40)
    // 25 squares mixed sizes
    const sq  = buildParticles(25, squareTex, T.sqOpacity,    [4,  26], 100, 65, 35)

    // ── Ring sprites ──────────────────────────────────────────────────────
    const RING_DEFS = [
      { x: -18, y:  8, z: -10, scale: 7 },
      { x:  16, y: -6, z:  -8, scale: 5 },
      { x:   2, y: 14, z: -14, scale: 9 },
      { x: -10, y:-12, z:  -6, scale: 4 },
      { x:  20, y: 10, z: -12, scale: 6 },
    ]

    const ringMeshes = RING_DEFS.map((r, i) => {
      const opacity = T.ringOpacities[i]
      const mat = new TRecuriterEE.SpriteMaterial({
        map: ringTex,
        color: new TRecuriterEE.Color(T.ringColors[i]),
        transparent: true,
        opacity,
        blending: isLight ? TRecuriterEE.NormalBlending : TRecuriterEE.AdditiveBlending,
        depthWrite: false,
      })
      const sprite = new TRecuriterEE.Sprite(mat)
      sprite.position.set(r.x, r.y, r.z)
      sprite.scale.set(r.scale * 2, r.scale * 2, 1)
      sprite.userData = {
        ox: r.x, oy: r.y,
        floatAmp:    Math.random() * 1.5 + 0.5,
        floatPhase:  Math.random() * Math.PI * 2,
        floatSpeed:  Math.random() * 0.25 + 0.12,
        pulseSpeed:  Math.random() * 0.5  + 0.25,
        pulsePhase:  Math.random() * Math.PI * 2,
        baseScale:   r.scale * 2,
        baseOpacity: opacity,
      }
      scene.add(sprite)
      return sprite
    })

    // ── Line network builder ──────────────────────────────────────────────
    const mkLineSystem = (nodeCount, spreadX, spreadY, speed, maxDist, color, opacity) => {
      const nodes = Array.from({ length: nodeCount }, () => ({
        x:  (Math.random() - 0.5) * spreadX,
        y:  (Math.random() - 0.5) * spreadY,
        z:  (Math.random() - 0.5) * 20 - 8,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed * 0.7,
      }))
      const buf = new Float32Array(nodeCount * nodeCount * 6)
      const geo = new TRecuriterEE.BufferGeometry()
      geo.setAttribute('position', new TRecuriterEE.BufferAttribute(buf, 3))
      const mat = new TRecuriterEE.LineBasicMaterial({ color, transparent: true, opacity })
      scene.add(new TRecuriterEE.LineSegments(geo, mat))
      return { nodes, buf, geo, maxDist, hx: spreadX / 2, hy: spreadY / 2 }
    }

    const ambient = mkLineSystem(35, 90, 60, 0.015, 22,
      T.ambientLine.color, T.ambientLine.opacity)
    const dense   = mkLineSystem(60, 100, 65, 0.022, 11,
      T.denseLine.color, T.denseLine.opacity)

    // ── Halo sprites ──────────────────────────────────────────────────────
    const HALO_DEFS = [
      { x:  0, y:  0, z:-20, scale:28 },
      { x: 20, y:-10, z:-25, scale:18 },
      { x:-15, y: 12, z:-22, scale:22 },
    ]
    HALO_DEFS.forEach((h, i) => {
      const mat = new TRecuriterEE.SpriteMaterial({
        map: circleTex,
        color: new TRecuriterEE.Color(T.haloColors[i % T.haloColors.length]),
        transparent: true,
        opacity: T.haloOpacities[i],
        blending: isLight ? TRecuriterEE.NormalBlending : TRecuriterEE.AdditiveBlending,
        depthWrite: false,
      })
      const sprite = new TRecuriterEE.Sprite(mat)
      sprite.position.set(h.x, h.y, h.z)
      sprite.scale.set(h.scale * 2, h.scale * 2, 1)
      scene.add(sprite)
    })

    // ── Mouse / touch parallax ────────────────────────────────────────────
    let tx = 0, ty = 0
    const onMouse = e => {
      tx = (e.clientX / window.innerWidth  - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const onTouch = e => {
      if (!e.touches[0]) return
      tx = (e.touches[0].clientX / window.innerWidth  - 0.5) * 2
      ty = (e.touches[0].clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Helpers ───────────────────────────────────────────────────────────
    const driftPoints = ({ pos, drift, count, geo }, t) => {
      for (let i = 0; i < count; i++) {
        const d = drift[i], a = t * d.speed + d.phase
        pos[i*3]   = d.ox + Math.cos(a) * d.radius
        pos[i*3+1] = d.oy + Math.sin(a * 0.7 + d.phaseY) * d.radius * 0.6
        pos[i*3+2] = d.oz + Math.sin(a * 0.4) * d.radius * 0.3
      }
      geo.attributes.position.needsUpdate = true
    }

    const rebuildLines = ({ nodes, buf, geo, maxDist, hx, hy }) => {
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (Math.abs(n.x) > hx) n.vx *= -1
        if (Math.abs(n.y) > hy) n.vy *= -1
      })
      let idx = 0
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = a.x-b.x, dy = a.y-b.y, dz = a.z-b.z
          if (Math.sqrt(dx*dx + dy*dy + dz*dz) < maxDist && idx+6 <= buf.length) {
            buf[idx++]=a.x; buf[idx++]=a.y; buf[idx++]=a.z
            buf[idx++]=b.x; buf[idx++]=b.y; buf[idx++]=b.z
          }
        }
      }
      for (let k = idx; k < buf.length; k++) buf[k] = 0
      geo.attributes.position.needsUpdate = true
      geo.setDrawRange(0, idx / 3)
    }

    // ── Animation loop ────────────────────────────────────────────────────
    const clock = new TRecuriterEE.Clock()
    let cx = 0, cy = 0, raf

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      cx += (tx - cx) * 0.028
      cy += (ty - cy) * 0.028
      camera.position.x += (cx * 6 - camera.position.x) * 0.04
      camera.position.y += (-cy * 4 - camera.position.y) * 0.04
      camera.lookAt(0, 0, 0)

      driftPoints(big, t)
      driftPoints(sm,  t)
      driftPoints(sq,  t)

      ringMeshes.forEach(sprite => {
        const ud = sprite.userData
        sprite.position.y = ud.oy + Math.sin(t * ud.floatSpeed + ud.floatPhase) * ud.floatAmp
        const pulse = 1 + Math.sin(t * ud.pulseSpeed + ud.pulsePhase) * 0.08
        sprite.scale.set(ud.baseScale * pulse, ud.baseScale * pulse, 1)
        sprite.material.opacity = ud.baseOpacity * (0.8 + Math.sin(t * ud.pulseSpeed * 0.5 + ud.pulsePhase) * 0.2)
      })

      rebuildLines(ambient)
      rebuildLines(dense)

      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('resize', onResize)
      circleTex.dispose()
      ringTex.dispose()
      squareTex.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [mode])  // full re-init on day ↔ night toggle

  return (
    <div
      ref={mountRef}
      className="three-bg"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}

export default ThreeBackground