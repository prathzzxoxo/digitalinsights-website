// Hero Page Animation - Matches home page SOC style
class HeroAnimation {
    constructor() {
        this.canvas = document.getElementById('heroCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.hexagons = [];
        this.pulsePhase = 0;

        this.colors = {
            cyan: '#00D9FF',
            cyanBright: '#00F0FF',
            cyanGlow: '#00BFFF',
            green: '#00FF88'
        };

        this.init();
        this.createParticles();
        this.createHexagons();
        this.animate();

        window.addEventListener('resize', () => {
            this.init();
            this.createParticles();
            this.createHexagons();
        });
    }

    init() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    createParticles() {
        // Dense grid-based particle distribution like home page
        const cols = Math.ceil(this.canvas.width / 60);
        const rows = Math.ceil(this.canvas.height / 60);
        const cellWidth = this.canvas.width / cols;
        const cellHeight = this.canvas.height / rows;
        this.particles = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const particlesPerCell = Math.floor(Math.random() * 2) + 2;

                for (let p = 0; p < particlesPerCell; p++) {
                    const x = col * cellWidth + Math.random() * cellWidth;
                    const y = row * cellHeight + Math.random() * cellHeight;

                    this.particles.push({
                        x: x,
                        y: y,
                        vx: (Math.random() - 0.5) * 0.25,
                        vy: (Math.random() - 0.5) * 0.25,
                        radius: Math.random() * 1.6 + 0.7,
                        opacity: Math.random() * 0.5 + 0.25
                    });
                }
            }
        }
    }

    createHexagons() {
        this.hexagons = [];
        const isMobile = this.canvas.width < 768;
        const count = isMobile ? 3 : 5;

        for (let i = 0; i < count; i++) {
            this.hexagons.push({
                x: (i + 1) * (this.canvas.width / (count + 1)),
                y: this.canvas.height * (0.3 + Math.random() * 0.4),
                size: isMobile ? 20 : 25,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around edges
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

    drawConnections() {
        const maxDistance = 150;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    drawGrid() {
        const gridSize = 80;
        this.ctx.strokeStyle = 'rgba(0, 217, 255, 0.08)';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawHexagon(x, y, size, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.beginPath();

        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const hx = size * Math.cos(angle);
            const hy = size * Math.sin(angle);
            if (i === 0) {
                this.ctx.moveTo(hx, hy);
            } else {
                this.ctx.lineTo(hx, hy);
            }
        }

        this.ctx.closePath();
        this.ctx.restore();
    }

    drawHexagons() {
        this.pulsePhase += 0.02;

        this.hexagons.forEach(hex => {
            hex.rotation += hex.rotationSpeed;

            // Pulsing effect
            const pulse = Math.sin(this.pulsePhase + hex.pulseOffset) * 0.2 + 0.8;
            const glowSize = hex.size * pulse;

            // Outer glow
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = this.colors.cyan;

            // Draw hexagon
            this.drawHexagon(hex.x, hex.y, hex.size, hex.rotation);
            this.ctx.strokeStyle = `rgba(0, 217, 255, ${0.4 * pulse})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            this.ctx.fillStyle = `rgba(0, 217, 255, ${0.05 * pulse})`;
            this.ctx.fill();

            // Inner glow hexagon
            this.drawHexagon(hex.x, hex.y, hex.size * 0.7, hex.rotation);
            this.ctx.strokeStyle = `rgba(0, 240, 255, ${0.3 * pulse})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            this.ctx.shadowBlur = 0;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid background
        this.drawGrid();

        // Draw particles and connections
        this.drawParticles();
        this.drawConnections();

        // Draw hexagons
        this.drawHexagons();

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroAnimation();
});
