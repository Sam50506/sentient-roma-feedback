<script>
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

    // --- NEW: Dynamic Subtitle ---
    function setDynamicSubtitle() {
        const subtitleElement = document.querySelector('.subtitle');
        const hour = new Date().getHours();
        let dynamicText = 'Rate your experience and share suggestions to help us evolve together.';

        if (hour < 12) {
            dynamicText = 'Good morning! Your feedback is the fuel for Roma’s next evolution.';
        } else if (hour < 18) {
            dynamicText = 'Welcome back! Rate your experience and share suggestions for Roma.';
        } else {
            dynamicText = 'Late night development? Tell us your thoughts on Roma before you log off.';
        }
        
        subtitleElement.textContent = dynamicText;
    }
    setDynamicSubtitle();

    // --- NEW: Feedback Wall Logic (Mock Data) ---
    const mockFeedbackData = [
        { id: 1, rating: 5, text: "Roma is incredibly fast and intuitive. The design is sleek, and the new feature set is exactly what I needed! Keep up the amazing work, team Sentient.", user: "Astro", upvotes: 42, downvotes: 3, date: "2025-10-28", voted: 0 },
        { id: 2, rating: 3, text: "I found a few bugs on the mobile version, especially around the settings page. Overall performance is good, but mobile UX needs a polish. Otherwise, a solid start!", user: "BugHunter", upvotes: 15, downvotes: 10, date: "2025-10-27", voted: 0 },
        { id: 3, rating: 4, text: "The new integration with the Discord bot is seamless! My only suggestion is to add a darker dark mode option for late-night use. Love the purple theme!", user: "DarkLord", upvotes: 28, downvotes: 1, date: "2025-10-25", voted: 0 },
        { id: 4, rating: 1, text: "The initial setup process was confusing. I spent 30 minutes trying to connect my account. The documentation needs a complete rewrite with clearer steps.", user: "FrustratedUser", upvotes: 5, downvotes: 22, date: "2025-10-23", voted: 0 }
    ];

    const feedbackListElement = document.getElementById('feedbackList');
    const loadingIndicator = document.getElementById('loadingIndicator');

    function generateStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<span style="color: ${i <= rating ? '#fbbf24' : 'rgba(196, 181, 253, 0.25)'}">★</span>`;
        }
        return `<div class="card-rating">${stars}</div>`;
    }

    function renderFeedbackCard(feedback) {
        const card = document.createElement('div');
        card.classList.add('feedback-card');
        
        const upvoteClass = feedback.voted === 1 ? 'active' : '';
        const downvoteClass = feedback.voted === -1 ? 'active' : '';

        card.innerHTML = `
            <div class="card-header">
                ${generateStarRating(feedback.rating)}
                <div class="card-meta-user">
                    <strong>${feedback.user}</strong>
                </div>
            </div>
            <p class="card-text">${feedback.text}</p>
            <div class="card-meta">
                <span class="card-date">${feedback.date}</span>
                <div class="vote-controls">
                    <button class="upvote ${upvoteClass}" data-id="${feedback.id}" onclick="handleVote(${feedback.id}, 'up')">👍 ${feedback.upvotes}</button>
                    <button class="downvote ${downvoteClass}" data-id="${feedback.id}" onclick="handleVote(${feedback.id}, 'down')">👎 ${feedback.downvotes}</button>
                    <button class="comment-btn" onclick="alert('Comment functionality would be implemented on a backend system.')">💬 Comment</button>
                </div>
            </div>
        `;
        feedbackListElement.appendChild(card);
    }

    function loadFeedback() {
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            feedbackListElement.innerHTML = ''; // Clear before loading
            mockFeedbackData.forEach(renderFeedbackCard);
        }, 1500);
    }

    function handleVote(id, type) {
        const feedback = mockFeedbackData.find(f => f.id === id);
        if (!feedback) return;

        // Voting logic
        if (type === 'up') {
            if (feedback.voted === 1) { feedback.upvotes--; feedback.voted = 0; } 
            else if (feedback.voted === -1) { feedback.downvotes--; feedback.upvotes++; feedback.voted = 1; } 
            else { feedback.upvotes++; feedback.voted = 1; }
        } else if (type === 'down') {
            if (feedback.voted === -1) { feedback.downvotes--; feedback.voted = 0; } 
            else if (feedback.voted === 1) { feedback.upvotes--; feedback.downvotes++; feedback.voted = -1; } 
            else { feedback.downvotes++; feedback.voted = -1; }
        }
        
        // Re-render
        feedbackListElement.innerHTML = '';
        mockFeedbackData.forEach(renderFeedbackCard);
    }
    
    // Load the feedback when the page loads
    window.onload = loadFeedback;

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

        // Extract data (for real submission)
        const formData = new FormData(document.getElementById('submitForm'));
        const data = Object.fromEntries(formData.entries());

        // --- IMPORTANT: GOOGLE FORM INTEGRATION ---
        const GOOGLE_FORM_URL = 'https://forms.gle/8KPmpcyMuaQBQTjJA';
        // (In a production environment, you would handle the form submission via a proper backend API)
        // -------------------------------------------

        // Show success message and reset
        setTimeout(() => {
            // Simulate adding the new feedback to the wall
            const newId = mockFeedbackData.length + 1;
            const newFeedback = {
                id: newId,
                rating: parseInt(data.rating),
                text: data.feedback,
                user: data.discord || data.twitter || 'Anonymous User',
                upvotes: 1, // Start with one upvote
                downvotes: 0,
                date: new Date().toISOString().slice(0, 10),
                voted: 1 // Automatically voted up by the submitter
            };
            mockFeedbackData.unshift(newFeedback); // Add to the top
            loadFeedback(); // Re-render the list

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
</script>
