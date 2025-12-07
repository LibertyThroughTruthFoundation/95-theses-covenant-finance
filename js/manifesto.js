// The 95 Theses of Covenant Finance - Interactive Features

// Nail It - Share functionality
document.addEventListener('DOMContentLoaded', function() {
    const nailButtons = document.querySelectorAll('.nail-it-btn');
    
    nailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const thesisNum = this.getAttribute('data-thesis');
            const thesisCard = this.closest('.thesis-card');
            const slogan = thesisCard.querySelector('.thesis-slogan').textContent;
            
            // Create share text
            const shareText = `Thesis #${thesisNum}: "${slogan}"\n\nFrom The 95 Theses of Covenant Finance\n\nhttps://github.com/LibertyThroughTruthFoundation/95-theses-covenant-finance`;
            
            // Try to use Web Share API if available
            if (navigator.share) {
                navigator.share({
                    title: `Thesis #${thesisNum} - The 95 Theses of Covenant Finance`,
                    text: shareText
                }).catch(err => console.log('Share cancelled'));
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(shareText).then(() => {
                    // Visual feedback
                    const originalText = this.textContent;
                    this.textContent = '✓ Copied!';
                    this.style.backgroundColor = '#2d7a2d';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.backgroundColor = '';
                    }, 2000);
                });
            }
        });
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-sections a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Scroll reveal animation for thesis cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Apply initial state and observe all thesis cards
    const thesisCards = document.querySelectorAll('.thesis-card');
    thesisCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
