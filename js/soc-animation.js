// SOC Animation - Canvas Based Network Visualization
class SOCAnimation {
    constructor() {
        this.canvas = document.getElementById('socCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.monitors = [];
        this.threats = [];
        this.attacks = [];
        this.worldLocations = [];
        this.animationId = null;

        this.colors = {
            gold: '#D4AF37',
            goldBright: '#FFD700',
            goldDark: '#B8860B',
            red: '#FF4444',
            green: '#00FF88',
            cyan: '#00D9FF',
            cyanBright: '#00F0FF',
            cyanGlow: '#00BFFF',
            blue: '#4A9EFF',
            blueLight: '#6BB3FF',
            blueDark: '#2E7FD9'
        };

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
        this.createMonitors();
        this.createWorldLocations();
        this.createAttacks();
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        // Reinitialize elements on resize to adjust for mobile/desktop
        this.createParticles();
        this.createMonitors();
        this.createWorldLocations();
        this.createAttacks();
    }

    createParticles() {
        const particleCount = Math.floor(this.canvas.width / 50); // Increased density for more particles
        this.particles = [];

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.2, // Increased speed for more movement
                vy: (Math.random() - 0.5) * 0.2, // Increased speed for more movement
                radius: Math.random() * 1.8 + 1.0,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    createMonitors() {
        this.monitors = [];
        const margin = 100;
        const isMobile = this.canvas.width < 768;

        // Enhanced monitors with more servers and routers - 8 on desktop, 4 on mobile
        const positions = isMobile ? [
            { x: this.canvas.width * 0.15, y: this.canvas.height * 0.25, type: 'shield' },
            { x: this.canvas.width * 0.85, y: this.canvas.height * 0.25, type: 'server' },
            { x: this.canvas.width * 0.25, y: this.canvas.height * 0.75, type: 'network' },
            { x: this.canvas.width * 0.75, y: this.canvas.height * 0.75, type: 'lock' }
        ] : [
            { x: this.canvas.width * 0.12, y: this.canvas.height * 0.2, type: 'shield' },
            { x: this.canvas.width * 0.25, y: this.canvas.height * 0.35, type: 'server' },
            { x: this.canvas.width * 0.35, y: this.canvas.height * 0.15, type: 'network' },
            { x: this.canvas.width * 0.5, y: this.canvas.height * 0.5, type: 'lock' },
            { x: this.canvas.width * 0.65, y: this.canvas.height * 0.25, type: 'server' },
            { x: this.canvas.width * 0.75, y: this.canvas.height * 0.65, type: 'network' },
            { x: this.canvas.width * 0.88, y: this.canvas.height * 0.35, type: 'shield' },
            { x: this.canvas.width * 0.78, y: this.canvas.height * 0.8, type: 'lock' }
        ];

        positions.forEach(pos => {
            this.monitors.push({
                x: pos.x,
                y: pos.y,
                type: pos.type,
                pulse: Math.random() * Math.PI * 2
            });
        });
    }

    createWorldLocations() {
        const isMobile = this.canvas.width < 768;

        // Reduced locations for cleaner look - 5 on desktop, 4 on mobile
        this.worldLocations = isMobile ? [
            { x: this.canvas.width * 0.15, y: this.canvas.height * 0.2, label: 'USA', pulsing: 0 },
            { x: this.canvas.width * 0.52, y: this.canvas.height * 0.18, label: 'UAE', pulsing: 0, isMain: true },
            { x: this.canvas.width * 0.85, y: this.canvas.height * 0.25, label: 'ASIA', pulsing: 0 },
            { x: this.canvas.width * 0.30, y: this.canvas.height * 0.80, label: 'SA', pulsing: 0 }
        ] : [
            { x: this.canvas.width * 0.15, y: this.canvas.height * 0.25, label: 'USA', pulsing: 0 },
            { x: this.canvas.width * 0.35, y: this.canvas.height * 0.18, label: 'EU', pulsing: 0 },
            { x: this.canvas.width * 0.52, y: this.canvas.height * 0.20, label: 'UAE', pulsing: 0, isMain: true },
            { x: this.canvas.width * 0.78, y: this.canvas.height * 0.28, label: 'ASIA', pulsing: 0 },
            { x: this.canvas.width * 0.25, y: this.canvas.height * 0.78, label: 'SA', pulsing: 0 }
        ];
    }

    createAttacks() {
        // Create attack lines that animate
        this.attacks = [];
        const isMobile = this.canvas.width < 768;
        const attackCount = isMobile ? 5 : 10; // Increased for more activity
        for (let i = 0; i < attackCount; i++) {
            const fromLoc = this.worldLocations[Math.floor(Math.random() * this.worldLocations.length)];
            let toLoc = this.worldLocations[Math.floor(Math.random() * this.worldLocations.length)];
            // Make sure they're different
            while (toLoc === fromLoc) {
                toLoc = this.worldLocations[Math.floor(Math.random() * this.worldLocations.length)];
            }

            this.attacks.push({
                from: fromLoc,
                to: toLoc,
                progress: Math.random(),
                speed: 0.0010 + Math.random() * 0.0010, // Increased speed for more active animation
                detected: Math.random() > 0.5
            });
        }
    }

    generateDataLines() {
        const lines = [];
        for (let i = 0; i < 3; i++) {
            lines.push({
                y: 20 + i * 15,
                width: Math.random() * 50 + 30,
                speed: Math.random() * 0.015 + 0.005
            });
        }
        return lines;
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 217, 255, ${particle.opacity})`;
            this.ctx.fill();
        });
    }

    drawWorldMapGrid() {
        // Draw subtle world map grid
        const isMobile = this.canvas.width < 768;
        const gridSpacing = isMobile ? 100 : 80; // Larger spacing on mobile
        const gridOpacity = isMobile ? 0.08 : 0.12; // Reduced opacity

        // Latitude lines
        for (let y = 0; y < this.canvas.height; y += gridSpacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.strokeStyle = `rgba(0, 217, 255, ${gridOpacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }

        // Longitude lines
        for (let x = 0; x < this.canvas.width; x += gridSpacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.strokeStyle = `rgba(0, 217, 255, ${gridOpacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }

        // Add some curved lines to suggest continents (simplified)
        const continentOpacity = isMobile ? 0.15 : 0.20; // Reduced opacity
        this.ctx.strokeStyle = `rgba(0, 217, 255, ${continentOpacity})`;
        this.ctx.lineWidth = 1.5;

        // Simplified continent outlines
        const continents = [
            // North America outline (simplified)
            [
                [this.canvas.width * 0.1, this.canvas.height * 0.3],
                [this.canvas.width * 0.2, this.canvas.height * 0.25],
                [this.canvas.width * 0.25, this.canvas.height * 0.4],
                [this.canvas.width * 0.15, this.canvas.height * 0.6]
            ],
            // Europe/Asia outline (simplified)
            [
                [this.canvas.width * 0.4, this.canvas.height * 0.2],
                [this.canvas.width * 0.7, this.canvas.height * 0.25],
                [this.canvas.width * 0.75, this.canvas.height * 0.5],
                [this.canvas.width * 0.5, this.canvas.height * 0.45]
            ]
        ];

        continents.forEach(continent => {
            this.ctx.beginPath();
            continent.forEach((point, index) => {
                if (index === 0) {
                    this.ctx.moveTo(point[0], point[1]);
                } else {
                    this.ctx.lineTo(point[0], point[1]);
                }
            });
            this.ctx.stroke();
        });
    }

    drawConnections() {
        const maxDistance = 200; // Increased for more visible connections

        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.5; // Increased opacity for better visibility
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
                    this.ctx.lineWidth = 1.2; // Slightly thicker lines
                    this.ctx.stroke();
                }
            });
        });
    }

    drawHexagon(x, y, size) {
        const angle = Math.PI / 3; // 60 degrees
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const xPos = x + size * Math.cos(angle * i);
            const yPos = y + size * Math.sin(angle * i);
            if (i === 0) {
                this.ctx.moveTo(xPos, yPos);
            } else {
                this.ctx.lineTo(xPos, yPos);
            }
        }
        this.ctx.closePath();
    }

    drawMonitors() {
        const time = Date.now() * 0.001;

        this.monitors.forEach((monitor, index) => {
            const pulseEffect = Math.sin(time * 2 + monitor.pulse) * 0.2 + 0.5;

            // Glowing effect (reduced)
            const glowGradient = this.ctx.createRadialGradient(
                monitor.x, monitor.y, 20,
                monitor.x, monitor.y, 70
            );
            glowGradient.addColorStop(0, `rgba(0, 240, 255, ${0.25 * pulseEffect})`);
            glowGradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(monitor.x, monitor.y, 70, 0, Math.PI * 2);
            this.ctx.fill();

            // Hexagonal frame (reduced opacity)
            this.drawHexagon(monitor.x, monitor.y, 45);
            this.ctx.strokeStyle = 'rgba(0, 217, 255, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Hexagon background (reduced opacity)
            this.drawHexagon(monitor.x, monitor.y, 45);
            this.ctx.fillStyle = 'rgba(0, 217, 255, 0.08)';
            this.ctx.fill();

            // Inner hexagon (reduced opacity)
            this.drawHexagon(monitor.x, monitor.y, 32);
            this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            // Icon/symbol in center based on type
            const iconMap = {
                'shield': '\uf3ed',
                'lock': '\uf023',
                'user': '\uf007',
                'server': '\uf233',
                'network': '\uf6ff',
                'database': '\uf1c0'
            };

            this.ctx.fillStyle = this.colors.cyanBright;
            this.ctx.font = 'bold 18px FontAwesome';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
            this.ctx.shadowBlur = 8;
            this.ctx.fillText(iconMap[monitor.type] || '\uf3ed', monitor.x, monitor.y - 8);
            this.ctx.shadowBlur = 0;

            // Label below icon
            this.ctx.font = '10px Inter, sans-serif';
            this.ctx.fillStyle = this.colors.cyan;
            this.ctx.fillText(monitor.type.toUpperCase(), monitor.x, monitor.y + 15);
        });
    }

    drawWorldLocations() {
        const time = Date.now() * 0.001;

        this.worldLocations.forEach(loc => {
            loc.pulsing = time;
            const pulse = Math.sin(loc.pulsing * 2) * 0.3 + 0.7;

            // Location marker
            const size = loc.isMain ? 8 : 5;
            this.ctx.beginPath();
            this.ctx.arc(loc.x, loc.y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = loc.isMain ? this.colors.cyanBright : this.colors.cyan;
            this.ctx.fill();

            // Pulse ring
            this.ctx.beginPath();
            this.ctx.arc(loc.x, loc.y, size + 5 * pulse, 0, Math.PI * 2);
            this.ctx.strokeStyle = loc.isMain ? `rgba(0, 240, 255, ${0.5 * pulse})` : `rgba(0, 217, 255, ${0.4 * pulse})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Label
            this.ctx.font = 'bold 11px Inter, sans-serif';
            this.ctx.fillStyle = this.colors.cyanBright;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(loc.label, loc.x, loc.y - 15);
        });
    }

    drawAttackLines() {
        this.attacks.forEach(attack => {
            attack.progress += attack.speed;
            if (attack.progress >= 1) {
                attack.progress = 0;
                // Randomize new attack occasionally
                if (Math.random() < 0.3) {
                    attack.detected = Math.random() > 0.5;
                }
            }

            const x = attack.from.x + (attack.to.x - attack.from.x) * attack.progress;
            const y = attack.from.y + (attack.to.y - attack.from.y) * attack.progress;

            // Draw attack line (reduced opacity by 10%)
            this.ctx.beginPath();
            this.ctx.setLineDash([10, 5]);
            this.ctx.moveTo(attack.from.x, attack.from.y);
            this.ctx.lineTo(attack.to.x, attack.to.y);
            this.ctx.strokeStyle = attack.detected ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 217, 255, 0.6)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.setLineDash([]);

            // Draw attack packet
            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, Math.PI * 2);
            this.ctx.fillStyle = attack.detected ? this.colors.cyanBright : this.colors.cyan;
            this.ctx.fill();

            // Glow around packet
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 20);
            gradient.addColorStop(0, attack.detected ? 'rgba(0, 240, 255, 0.8)' : 'rgba(0, 217, 255, 0.8)');
            gradient.addColorStop(1, attack.detected ? 'rgba(0, 240, 255, 0)' : 'rgba(0, 217, 255, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 20, 0, Math.PI * 2);
            this.ctx.fill();

            // Status text near packet
            if (attack.progress > 0.3 && attack.progress < 0.7) {
                this.ctx.font = 'bold 10px Inter, sans-serif';
                this.ctx.fillStyle = attack.detected ? this.colors.cyanBright : this.colors.cyan;
                this.ctx.textAlign = 'center';
                this.ctx.shadowColor = attack.detected ? 'rgba(0, 240, 255, 0.8)' : 'rgba(0, 217, 255, 0.8)';
                this.ctx.shadowBlur = 5;
                this.ctx.fillText(attack.detected ? 'BLOCKED' : 'DETECTED', x, y - 25);
                this.ctx.shadowBlur = 0;
            }
        });
    }

    drawDataStreams() {
        const time = Date.now() * 0.001;

        // Subtle connection lines between some monitors
        for (let i = 0; i < this.monitors.length - 1; i += 2) {
            const m1 = this.monitors[i];
            const m2 = this.monitors[i + 1];

            // Draw dotted connection line
            this.ctx.beginPath();
            this.ctx.setLineDash([4, 8]);
            this.ctx.moveTo(m1.x, m1.y);
            this.ctx.lineTo(m2.x, m2.y);
            this.ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }

    drawThreatIndicators() {
        const time = Date.now() * 0.001;

        // Occasionally show threat detection (reduced frequency)
        if (Math.random() < 0.003 && this.threats.length < 2) {
            this.threats.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                life: 1.0,
                detected: false
            });
        }

        this.threats = this.threats.filter(threat => {
            threat.life -= 0.01;

            if (threat.life > 0.5 && !threat.detected) {
                // Show threat
                this.ctx.beginPath();
                this.ctx.arc(threat.x, threat.y, 8, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(0, 217, 255, ${threat.life})`;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                // Warning icon
                this.ctx.fillStyle = `rgba(0, 217, 255, ${threat.life})`;
                this.ctx.font = '16px FontAwesome';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('!', threat.x, threat.y + 5);
            } else {
                // Show blocked/resolved
                threat.detected = true;
                this.ctx.beginPath();
                this.ctx.arc(threat.x, threat.y, 10, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(0, 240, 255, ${threat.life})`;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                // Checkmark
                this.ctx.strokeStyle = `rgba(0, 240, 255, ${threat.life})`;
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(threat.x - 4, threat.y);
                this.ctx.lineTo(threat.x - 1, threat.y + 4);
                this.ctx.lineTo(threat.x + 5, threat.y - 4);
                this.ctx.stroke();
            }

            return threat.life > 0;
        });
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw all elements in order (back to front)
        this.drawConnections();
        this.drawParticles();
        this.drawWorldLocations();
        this.drawAttackLines();
        this.drawDataStreams();
        this.drawMonitors();
        this.drawThreatIndicators();

        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize SOC animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const socAnimation = new SOCAnimation();
});
