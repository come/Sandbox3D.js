/*
 * DragControls dragging of three.js objects in any scene easily.
 * 
 * Usage: new DragControls(camera, objects, renderer.domElement);
 *
 * feature requests:
 *  1. add rotation?
 *  2. axis lock
 *  3. inertia dragging
 *  4. activate/deactivate? prevent propagation?
 *
 * issues:
 *  deal with object parent's matrix?
 *
 * @author zz85 from https://github.com/zz85
 * follow on http://twitter.com/blurspline
 */
THREE.DragControls = function(_camera, _objects, _domElement, params) {

    if (_objects instanceof THREE.Scene) {
        _objects = _objects.children;
    }
    var _projector = new THREE.Projector();

    var _mouse = new THREE.Vector3(),
        _offset = new THREE.Vector3();
    var _selected,_dragging = false;

    var me = this;
    
    var params = params || {};
    
    var _offsets = params.offsets || { x: 0, y: 0 };
    
    var _screenSizes = {
      width: params.width || _domElement.width,
      height: params.height || _domElement.height
    };

    _domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    _domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    _domElement.addEventListener('mouseup', onDocumentMouseUp, false);

    // Enable Drag
    this.enabled = true; 

    /* Custom Event Handling */
    var _listeners = {

    };

    this.on = function(event, handler) {
        if (!_listeners[event]) _listeners[event] = [];

        _listeners[event].push(handler);
        return me;
    };

    this.off = function(event, handler) {
        var l = _listeners[event];
        if (!l) return me;

        if (l.indexOf(handler)>-1) {
            l.splice(handler, 1);
        }

        return me;

    };

    var notify = function(event, data, member) {
        var l = _listeners[event];
        if (!l) return;

        if (!member) {
            for (var i=0;i<l.length;i++) {
                l[i](data);
            }
        }
    };


    // Drag constrains (eg. move along x-axis only, y only, x and y, or default xyz)
    var moveX, moveY, moveZ;
    moveX = moveY = moveZ = true;

    this.constrains = function(xyz) {

        if (xyz === undefined) 
            xyz = 'xyz'; 

        moveX = moveY = moveZ = false;

        if (xyz.indexOf('x') > -1) {
            moveX = true;
        } 

        if (xyz.indexOf('y') > -1) {
            moveY = true;
        } 

        if (xyz.indexOf('z') > -1) {
            moveZ = true;
        } 

        return this;

    };


    function onDocumentMouseMove(event) {

        if (!me.enabled) {
            return;
        }

        event.preventDefault();

        _mouse.x = ((event.clientX + _offsets.x) / _screenSizes.width) * 2 - 1;
	    _mouse.y = - ((event.clientY + _offsets.y) / _screenSizes.height) * 2 + 1;

        var ray = _projector.pickingRay(_mouse, _camera);

        if (me.enabled && _selected) {
          
            var targetPos = ray.direction.clone().multiplyScalar(_selected.distance).addSelf(ray.origin);
            targetPos.subSelf(_offset);
            // _selected.object.position.copy(targetPos.subSelf(_offset));
                   
            // Reverse Matrix?
            // Hmm, quick hack - should do some kind of planar projection..

            _selected.object.lastPosition = _selected.object.position.clone();

            if (moveX) _selected.object.position.x = targetPos.x;
            if (moveY) _selected.object.position.y = targetPos.y;
            if (moveZ) _selected.object.position.z = targetPos.z;
            
            notify('drag', _selected);
            if(_dragging === false) {
                _dragging = 0;
            }
            else if( _dragging === 0) {
                _dragging = true;
            }

            return;

        }
        else {
            _dragging = false;
        }

        var intersects = ray.intersectObjects(_objects);

        if (intersects.length > 0) {

            _domElement.style.cursor = 'pointer';

        } else {

            _domElement.style.cursor = 'auto';

        }

    }

    function onDocumentMouseDown(event) {

        if (!me.enabled) {
            return;
        }

        event.preventDefault();

        _mouse.x = ((event.clientX + _offsets.x) / _screenSizes.width) * 2 - 1;
	    _mouse.y = - ((event.clientY + _offsets.y) / _screenSizes.height) * 2 + 1;

        var ray = _projector.pickingRay(_mouse, _camera);
        var intersects = ray.intersectObjects(_objects, true);

        var hit = intersects.length > 0;

        if (hit) {
      
            // Si c'est un regroupement d'objet on prend le parent
            if (!(intersects[0].object.parent instanceof THREE.Scene))
              intersects[0].object = intersects[0].object.parent;
            
            _selected = intersects[0];
            
            _offset.copy(_selected.point).subSelf(_selected.object.position);

            _domElement.style.cursor = 'move';

            _selected.hit = hit;

            notify('dragstart', _selected);
            notify('mousedown', _selected);
        } 
        else {
            notify('mousedown', { hit: hit });
        }

    }

    function onDocumentMouseUp(event) {

        if (!me.enabled) {
            return;
        }

        event.preventDefault();

        var dragged = false;
        
        if (_selected && _dragging == true) {
            _dragging = false;
            dragged = true;
            notify('dragend', _selected);
            _selected = null;
        }
        else if(_selected) {
            _selected = null;
        }

        _domElement.style.cursor = 'auto';

        notify('mouseup', {
            dragged: dragged
        });

    }

}