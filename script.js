document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // 2. Interactive Mesh Weight & Aperture Calculator
    const calcGrade = document.getElementById('calcGrade');
    const calcMesh = document.getElementById('calcMesh');
    const calcWire = document.getElementById('calcWire');
    const calcWidth = document.getElementById('calcWidth');
    const calcLength = document.getElementById('calcLength');

    const resWeight = document.getElementById('resWeight');
    const resOpenArea = document.getElementById('resOpenArea');
    const resAperture = document.getElementById('resAperture');

    function calculateMesh() {
        const density = parseFloat(calcGrade.value); // g/cm3
        const mesh = parseFloat(calcMesh.value); // mesh count per inch
        const wire = parseFloat(calcWire.value); // mm wire diameter
        const width = parseFloat(calcWidth.value); // meters
        const length = parseFloat(calcLength.value); // meters

        if (mesh > 0 && wire > 0 && width > 0 && length > 0) {
            // Pitch (distance center-to-center of adjacent wires in mm)
            const pitch = 25.4 / mesh;
            
            // Aperture / Opening size in mm
            const aperture = pitch - wire;

            if (aperture <= 0) {
                resAperture.textContent = 'Invalid (Wire too thick)';
                resOpenArea.textContent = '0 %';
                resWeight.textContent = '-- kg';
                return;
            }

            // Open Area Percentage calculation
            const openArea = Math.pow(aperture / pitch, 2) * 100;

            // Theoretical weight per sq meter (kg/m2)
            // Weight ≈ (1/2) * (12.7 * mesh * wire^2 * density) / 1000
            const weightPerSqM = (0.5 * mesh * Math.pow(wire, 2) * density * 12.7) / 100;
            const totalArea = width * length;
            const totalWeight = weightPerSqM * totalArea;

            resWeight.textContent = totalWeight.toFixed(2) + ' kg';
            resOpenArea.textContent = openArea.toFixed(1) + ' %';
            resAperture.textContent = aperture.toFixed(3) + ' mm';
        }
    }

    if (calcMesh) {
        [calcGrade, calcMesh, calcWire, calcWidth, calcLength].forEach(input => {
            input.addEventListener('input', calculateMesh);
        });
        calculateMesh(); // Initial execution
    }

    // 3. Canvas Interactive Wire Weaving Background Animation
    const canvas = document.getElementById('meshCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        let offset = 0;
        function drawWeavePattern() {
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = 'rgba(197, 160, 89, 0.12)';
            ctx.lineWidth = 1;

            const spacing = 40;
            offset += 0.3;
            if (offset > spacing) offset = 0;

            // Vertical Warp Wires
            for (let x = offset; x < width; x += spacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal Weft Wires
            for (let y = 0; y < height; y += spacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            requestAnimationFrame(drawWeavePattern);
        }
        drawWeavePattern();
    }

    // 4. Form Submission Handling
    const rfqForm = document.getElementById('rfqForm');
    if (rfqForm) {
        rfqForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('rfqName').value;
            alert(`Thank you, ${name}! Your RFQ query has been sent to PIHU INDUSTRIES sales team.`);
            rfqForm.reset();
        });
    }
});