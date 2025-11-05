// Particle system
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 60;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw connections
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Form functionality
let selectedRating = 0;

function openModal() {
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        document.getElementById('feedbackForm').style.display = 'block';
        document.getElementById('successMessage').classList.remove('active');
        document.getElementById('submitForm').reset();
        resetRating();
    }, 300);
}

function closeModalOnOverlay(event) {
    if (event.target === document.getElementById('modalOverlay')) {
        closeModal();
    }
}

function setRating(rating) {
    selectedRating = rating;
    document.getElementById('ratingValue').value = rating;
    
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function resetRating() {
    selectedRating = 0;
    document.getElementById('ratingValue').value = '';
    document.querySelectorAll('.star').forEach(star => {
        star.classList.remove('active');
    });
}

function handleSubmit(event) {
    event.preventDefault();
    
    if (selectedRating === 0) {
        alert('Please select a rating before submitting.');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // ============================================
    // GOOGLE FORM INTEGRATION
    // ============================================
    const GOOGLE_FORM_URL = 'https://forms.gle/8KPmpcyMuaQBQTjJA';
    
    // Open Google Form in new tab
    window.open(GOOGLE_FORM_URL, '_blank');
    // ============================================

    // Show success message
    setTimeout(() => {
        document.getElementById('feedbackForm').style.display = 'none';
        document.getElementById('successMessage').classList.add('active');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Feedback';

        // Auto close after 3 seconds
        setTimeout(() => {
            closeModal();
        }, 3000);
    }, 1000);
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
