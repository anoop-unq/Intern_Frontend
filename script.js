
        // Sample images with 16:9 aspect ratio
        const images = [
            { id: 1, src: 'https://picsum.photos/400/225?random=1', label: 'Image 1' },
            { id: 2, src: 'https://picsum.photos/400/225?random=2', label: 'Image 2' },
            { id: 3, src: 'https://picsum.photos/400/225?random=3', label: 'Image 3' },
            { id: 4, src: 'https://picsum.photos/400/225?random=4', label: 'Image 4' },
            { id: 5, src: 'https://picsum.photos/400/225?random=5', label: 'Image 5' },
            { id: 6, src: 'https://picsum.photos/400/225?random=6', label: 'Image 6' }
        ];

        // DOM Elements
        const carousel = document.getElementById('imageCarousel');
        const imagePreview = document.getElementById('imagePreview');
        const noImageMessage = document.getElementById('noImageMessage');
        const textInput = document.getElementById('textInput');
        const fontFamily = document.getElementById('fontFamily');
        const fontSize = document.getElementById('fontSize');
        const fontWeight = document.getElementById('fontWeight');
        const textColor = document.getElementById('textColor');
        const textAlign = document.getElementById('textAlign');
        const lineHeight = document.getElementById('lineHeight');
        const colorPreview = document.getElementById('colorPreview');
        const addTextBtn = document.getElementById('addTextBtn');
        const removeTextBtn = document.getElementById('removeTextBtn');

        // State variables
        let activeImage = null;
        let activeTextElement = null;
        let textElements = [];

        // Initialize the carousel
        function initCarousel() {
            images.forEach(image => {
                const carouselItem = document.createElement('div');
                carouselItem.className = 'carousel-item';
                carouselItem.dataset.id = image.id;
                
                const img = document.createElement('img');
                img.src = image.src;
                img.alt = image.label;
                
                const label = document.createElement('div');
                label.className = 'item-label';
                label.textContent = image.label;
                
                carouselItem.appendChild(img);
                carouselItem.appendChild(label);
                carousel.appendChild(carouselItem);
                
                // Add click event to select image
                carouselItem.addEventListener('click', () => selectImage(image, carouselItem));
            });
            
            // Select first image by default
            if (images.length > 0) {
                const firstItem = carousel.querySelector('.carousel-item');
                selectImage(images[0], firstItem);
            }
        }

        // Select an image from the carousel
        function selectImage(image, element) {
            // Remove active class from all items
            document.querySelectorAll('.carousel-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to selected item
            element.classList.add('active');
            
            // Update active image
            activeImage = image;
            
            // Clear previous text elements
            textElements = [];
            
            // Update image preview
            imagePreview.innerHTML = '';
            const previewImg = document.createElement('img');
            previewImg.src = image.src;
            previewImg.alt = image.label;
            imagePreview.appendChild(previewImg);
            
            // Hide no image message
            noImageMessage.style.display = 'none';
        }

        // Add text to the active image
        function addText() {
            if (!activeImage) return;
            
            const text = textInput.value.trim();
            if (!text) {
                alert('Please enter some text');
                return;
            }
            
            const textElement = document.createElement('div');
            textElement.className = 'text-overlay';
            textElement.textContent = text;
            textElement.style.fontFamily = fontFamily.value;
            textElement.style.fontSize = `${fontSize.value}px`;
            textElement.style.fontWeight = fontWeight.value;
            textElement.style.color = textColor.value;
            textElement.style.textAlign = textAlign.value;
            textElement.style.lineHeight = lineHeight.value;
            textElement.style.left = '50%';
            textElement.style.top = '50%';
            textElement.style.transform = 'translate(-50%, -50%)';
            
            // Make text draggable
            makeDraggable(textElement);
            
            // Add click event to select text
            textElement.addEventListener('click', (e) => {
                e.stopPropagation();
                selectTextElement(textElement);
            });
            
            imagePreview.appendChild(textElement);
            textElements.push(textElement);
            selectTextElement(textElement);
            
            // Clear input
            textInput.value = '';
        }

        // Remove selected text
        function removeText() {
            if (activeTextElement) {
                const index = textElements.indexOf(activeTextElement);
                if (index > -1) {
                    textElements.splice(index, 1);
                }
                activeTextElement.remove();
                activeTextElement = null;
            }
        }

        // Select a text element for editing
        function selectTextElement(element) {
            // Remove active class from all text elements
            textElements.forEach(text => {
                text.classList.remove('active');
            });
            
            // Add active class to selected text
            element.classList.add('active');
            activeTextElement = element;
            
            // Update controls with selected text properties
            textInput.value = element.textContent;
            fontFamily.value = element.style.fontFamily || 'Arial, sans-serif';
            fontSize.value = parseInt(element.style.fontSize) || 16;
            fontWeight.value = element.style.fontWeight || 'normal';
            textColor.value = rgbToHex(element.style.color) || '#000000';
            textAlign.value = element.style.textAlign || 'left';
            lineHeight.value = parseFloat(element.style.lineHeight) || 1.2;
            
            updateColorPreview();
        }

        // Make text elements draggable
        function makeDraggable(element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            
            element.onmousedown = dragMouseDown;
            
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // Get the mouse cursor position at startup
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // Call a function whenever the cursor moves
                document.onmousemove = elementDrag;
            }
            
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // Calculate the new cursor position
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // Set the element's new position
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
                element.style.transform = 'none';
            }
            
            function closeDragElement() {
                // Stop moving when mouse button is released
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        // Update text properties when controls change
        function updateTextProperties() {
            if (activeTextElement) {
                activeTextElement.style.fontFamily = fontFamily.value;
                activeTextElement.style.fontSize = `${fontSize.value}px`;
                activeTextElement.style.fontWeight = fontWeight.value;
                activeTextElement.style.color = textColor.value;
                activeTextElement.style.textAlign = textAlign.value;
                activeTextElement.style.lineHeight = lineHeight.value;
                
                updateColorPreview();
            }
        }

        // Update color preview
        function updateColorPreview() {
            colorPreview.style.backgroundColor = textColor.value;
        }

        // Convert RGB to Hex
        function rgbToHex(rgb) {
            if (!rgb) return '#000000';
            
            // If already in hex format, return as is
            if (rgb.startsWith('#')) return rgb;
            
            // If in rgb format, convert to hex
            const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
            if (!result) return '#000000';
            
            const r = parseInt(result[1]);
            const g = parseInt(result[2]);
            const b = parseInt(result[3]);
            
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        // Event Listeners
        fontFamily.addEventListener('change', updateTextProperties);
        fontSize.addEventListener('input', updateTextProperties);
        fontWeight.addEventListener('change', updateTextProperties);
        textColor.addEventListener('input', updateTextProperties);
        textAlign.addEventListener('change', updateTextProperties);
        lineHeight.addEventListener('input', updateTextProperties);
        
        addTextBtn.addEventListener('click', addText);
        removeTextBtn.addEventListener('click', removeText);
        
        // Initialize color preview
        updateColorPreview();
        
        // Initialize the application
        initCarousel();
