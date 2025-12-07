// Load and render the 95 Theses from markdown
document.addEventListener('DOMContentLoaded', async function() {
    const container = document.getElementById('content');
    
    try {
        const response = await fetch('ALL_THESES.md');
        const markdown = await response.text();
        
        // Parse the markdown and convert to HTML
        const html = parseThesesMarkdown(markdown);
        container.innerHTML = html;
        
        // Initialize interactive features
        initializeInteractivity();
    } catch (error) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <p style="color: #9e2b2b; font-size: 1.2rem;">Error loading theses.</p>
                <p style="margin-top: 1rem;">
                    <a href="ALL_THESES.md" style="color: #c9a467;">View the complete text here</a>
                </p>
            </div>
        `;
    }
});

function parseThesesMarkdown(markdown) {
    const lines = markdown.split('\n');
    let html = '';
    let currentSection = null;
    let currentThesis = null;
    let inThesis = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines and emoji headers
        if (!line || line.startsWith('🔥')) continue;
        
        // Detect section headers
        if (line.startsWith('### **') && line.includes('THESES')) {
            if (currentSection) {
                html += '</section>';
            }
            
            const sectionMatch = line.match(/\*\*([A-Z]+) THESES \((\d+)-(\d+)\)\*\*/);
            if (sectionMatch) {
                const sectionName = sectionMatch[1].toLowerCase();
                const start = sectionMatch[2];
                const end = sectionMatch[3];
                
                const sectionTitles = {
                    'foundation': 'Part I: Foundation Theses',
                    'language': 'Part II: Language Theses',
                    'technical': 'Part III: Technical Theses',
                    'economic': 'Part IV: Economic Theses',
                    'community': 'Part V: Community Theses',
                    'sovereignty': 'Part VI: Sovereignty Theses',
                    'covenant': 'Part VII: Covenant Theses'
                };
                
                html += `
                    <section id="${sectionName}" class="thesis-section">
                        <h2 class="section-title">${sectionTitles[sectionName]} (${start}-${end})</h2>
                `;
                currentSection = sectionName;
            }
            continue;
        }
        
        // Detect thesis start
        if (line.startsWith('**Thesis #')) {
            if (currentThesis) {
                html += `
                            </div>
                            <button class="nail-it-btn" data-thesis="${currentThesis.number}">Nail It 🔨</button>
                        </article>
                `;
            }
            
            const thesisMatch = line.match(/\*\*Thesis #(\d+) - "([^"]+)"\*\*/);
            if (thesisMatch) {
                currentThesis = {
                    number: thesisMatch[1],
                    slogan: thesisMatch[2],
                    lie: '',
                    truth: '',
                    result: ''
                };
                
                html += `
                    <article class="thesis-card" id="thesis-${currentThesis.number}">
                        <div class="thesis-number">Thesis #${currentThesis.number}</div>
                        <h3 class="thesis-slogan">"${currentThesis.slogan}"</h3>
                        <div class="thesis-content">
                `;
                inThesis = true;
            }
            continue;
        }
        
        // Parse thesis content
        if (inThesis && line.startsWith('- **The Lie:**')) {
            const content = line.replace('- **The Lie:**', '').trim();
            html += `<p><strong>The Lie:</strong> ${content}</p>`;
        } else if (inThesis && line.startsWith('- **The Covenant Truth:**')) {
            const content = line.replace('- **The Covenant Truth:**', '').trim();
            html += `<p><strong>The Covenant Truth:</strong> <em>${content}</em></p>`;
        } else if (inThesis && line.startsWith('- **The Result:**') || line.startsWith('- **Result:**')) {
            const content = line.replace('- **The Result:**', '').replace('- **Result:**', '').trim();
            html += `<p><strong>The Result:</strong> ${content}</p>`;
        }
    }
    
    // Close last thesis and section
    if (currentThesis) {
        html += `
                    </div>
                    <button class="nail-it-btn" data-thesis="${currentThesis.number}">Nail It 🔨</button>
                </article>
        `;
    }
    if (currentSection) {
        html += '</section>';
    }
    
    return html;
}

function initializeInteractivity() {
    // Nail It buttons
    const nailButtons = document.querySelectorAll('.nail-it-btn');
    nailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const thesisNum = this.getAttribute('data-thesis');
            const thesisCard = this.closest('.thesis-card');
            const slogan = thesisCard.querySelector('.thesis-slogan').textContent;
            
            const shareText = `Thesis #${thesisNum}: ${slogan}\n\nFrom The 95 Theses of Covenant Finance\n\nhttps://github.com/LibertyThroughTruthFoundation/95-theses-covenant-finance`;
            
            if (navigator.share) {
                navigator.share({
                    title: `Thesis #${thesisNum} - Covenant Finance`,
                    text: shareText
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(shareText).then(() => {
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
    
    // Smooth scrolling
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
    
    // Scroll reveal
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    const thesisCards = document.querySelectorAll('.thesis-card');
    thesisCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}
