document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('canvas-container');
    const content = document.getElementById('canvas-content');
    
    let isPanning = false;
    let startPoint = { x: 0, y: 0 };
    let currentTranslate = { x: 0, y: 0 };
    let scale = 1;
    
    // Initialize content position
    content.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${scale})`;
    
    // Pan functionality - attach to container for start, but document for move and end
    container.addEventListener('mousedown', startPan);
    document.addEventListener('mousemove', pan);
    document.addEventListener('mouseup', endPan);
    
    // Modify the wheel event listener and zoom function
    container.addEventListener('wheel', handleScroll);
    
    function handleScroll(e) {
        e.preventDefault();
        
        if (e.ctrlKey) {
            // Zoom functionality
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            const newScale = Math.max(0.1, Math.min(5, scale + delta));
            
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const scaleRatio = newScale / scale;
            const translateX = mouseX - (mouseX - currentTranslate.x) * scaleRatio;
            const translateY = mouseY - (mouseY - currentTranslate.y) * scaleRatio;
            
            scale = newScale;
            currentTranslate = { x: translateX, y: translateY };
            updateCanvasScale();
        } else if (e.shiftKey) {
            // Horizontal scroll
            currentTranslate.x -= e.deltaY;
        } else {
            // Vertical scroll
            currentTranslate.y -= e.deltaY;
        }
        
        content.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${scale})`;
    }
    
    function startPan(e) {
        if (e.target === container || e.target === content) {
            isPanning = true;
            container.style.cursor = 'grabbing';
            startPoint = { x: e.clientX - currentTranslate.x, y: e.clientY - currentTranslate.y };
        }
    }
    
    function pan(e) {
        if (!isPanning) return;
        
        e.preventDefault();
        currentTranslate = {
            x: e.clientX - startPoint.x,
            y: e.clientY - startPoint.y
        };
        
        content.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${scale})`;
    }
    
    function endPan() {
        if (isPanning) {
            isPanning = false;
            container.style.cursor = 'grab';
        }
    }
    
    function updateCanvasScale() {
        document.documentElement.style.setProperty('--canvas-scale', scale);
    }
    
    // Initialize the scale
    updateCanvasScale();
    
    // Make items draggable
    const draggableItems = document.querySelectorAll('.draggable');
    
    draggableItems.forEach(item => {
        let isDragging = false;
        let itemStartPoint = { x: 0, y: 0 };
        let itemStartPos = { left: 0, top: 0 };
        
        // Add header drag functionality
        const header = item.querySelector('.draggable-header');
        if (header) {
            header.style.cursor = 'move';
            header.style.pointerEvents = 'auto';
            
            header.addEventListener('mousedown', function(e) {
                e.stopPropagation();
                isDragging = true;
                
                itemStartPos = {
                    left: parseInt(item.style.left || 0),
                    top: parseInt(item.style.top || 0)
                };
                
                itemStartPoint = { 
                    x: e.clientX, 
                    y: e.clientY 
                };
            });
        }
        
        item.addEventListener('mousedown', function(e) {
            if (e.target === header) return;
            e.stopPropagation(); // Prevent container panning
            isDragging = true;
            
            // Store the initial position of the item
            itemStartPos = {
                left: parseInt(item.style.left || 0),
                top: parseInt(item.style.top || 0)
            };
            
            // Store the initial mouse position
            itemStartPoint = { 
                x: e.clientX, 
                y: e.clientY 
            };
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            // Calculate the mouse movement delta and adjust for scale
            const deltaX = (e.clientX - itemStartPoint.x) / scale;
            const deltaY = (e.clientY - itemStartPoint.y) / scale;
            
            // Apply the adjusted movement to the initial position
            const left = itemStartPos.left + deltaX;
            const top = itemStartPos.top + deltaY;
            
            item.style.left = `${left}px`;
            item.style.top = `${top}px`;
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    });
});