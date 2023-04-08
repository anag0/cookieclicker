let Utils = {
    objects: {
        'cookie': {
            id: 'bigCookie',
            coordinates: {
                x: 0,
                y: 0
            }
        },
        'upgrade': {
            id: 'upgrade0',
            coordinates: {
                x: 0,
                y: 0
            }
        },
        'Cursor': {id: 'product0', coordinates:{x:0, y:0}}, 
        'Grandma': {id: 'product1', coordinates:{x:0, y:0}}, 
        'Farm': {id: 'product2', coordinates:{x:0, y:0}}, 
        'Mine': {id: 'product3', coordinates:{x:0, y:0}}, 
        'Factory': {id: 'product4', coordinates:{x:0, y:0}}, 
        'Bank': {id: 'product5', coordinates:{x:0, y:0}}, 
        'Temple': {id: 'product6', coordinates:{x:0, y:0}}, 
        'Wizard tower': {id: 'product7', coordinates:{x:0, y:0}}, 
        'Shipment': {id: 'product8', coordinates:{x:0, y:0}}, 
        'Alchemy lab': {id: 'product9', coordinates:{x:0, y:0}}, 
        'Portal': {id: 'product10', coordinates:{x:0, y:0}}, 
        'Time machine': {id: 'product11', coordinates:{x:0, y:0}}, 
        'Antimatter condenser': {id: 'product12', coordinates:{x:0, y:0}}, 
        'Prism': {id: 'product13', coordinates:{x:0, y:0}}, 
        'Chancemaker': {id: 'product14', coordinates:{x:0, y:0}}, 
        'Fractal engine': {id: 'product15', coordinates:{x:0, y:0}}, 
        'Javascript console': {id: 'product16', coordinates:{x:0, y:0}}, 
        'Idleverse': {id: 'product17', coordinates:{x:0, y:0}}, 
        'Cortex baker': {id: 'product18', coordinates:{x:0, y:0}}
    },

    initCoordinates: function() {
        let $this = this;
        Object.keys(this.objects).forEach(function(name){
            if ( $this.objects[name].coordinates.x == 0 ) {
                let c = document.querySelector('#' + $this.objects[name].id).getBoundingClientRect();
                $this.objects[name].coordinates.x = c.left;
                $this.objects[name].coordinates.y = c.top;
                if ( name == 'cookie' ) {
                    $this.objects[name].coordinates.x += 48;
                    $this.objects[name].coordinates.y += 48;
                }
            }
        });
    },

    getNodeIdByObjectName: function(name) {
        return this.objects[name].id;
    },

    getObjectCoordinatesByName: function(name) {
        return this.objects[name].coordinates;
    },

    getObjectRandomCoordinatesByName: function(name) {
        let {x, y} = this.objects[name].coordinates;
        let cx = 0, cy = 0;

        if ( x == 0 || y == 0 ) {
            cx = this.randomInt(windowWidth/3, (windowWidth/3)*2);
            cy = this.randomInt(100, windowHeight);
        } else {
            if ( name == 'cookie' ) {
                cx = x + this.randomInt(5, 155);
                cy = y + this.randomInt(5, 155);
            } else if ( name == 'upgrade' ) {
                cx = x + this.randomInt(5, 55);
                cy = y + this.randomInt(5, 55);
            } else {
                cx = x + this.randomInt(5, 295);
                cy = y + this.randomInt(5, 59);
            }
        }

        return {x: cx, y: cy};
    },

    getCurrentGameState: function() {
        let state = {};
        Game.ObjectsById.forEach(function(building, id){
            state[building.name] = Game.cookies > building.price ? 1 : 0;
        });
        state['upgrade'] = (Game.UpgradesInStore.length > 0 && Game.cookies > Game.UpgradesInStore[0].getPrice()) ? 1 : 0;
        return state;
    },

    getStateByClickTarget: function(target) {
        let state = {};
    
        if ( target.id == 'bigCookie' ) {
            state['cookie'] = 1;
        } else if ( target.id.indexOf('product') >-1 ) {
            let id = parseInt(target.id.replace('product', ''));
            state[Game.ObjectsById[id].name] = 1;
        } else if ( target.id.indexOf('upgrade') >-1 ) {
            state['upgrade'] = 1;
        } else {
            return false;
        }
    
        return state;
    },

    getBestObjectToClick: function() {
        let state = this.getCurrentGameState(),
            name = 'cookie';
        if ( state['upgrade'] == 1 ) {
            name = 'upgrade';
        } else {
            let highestTier = -1,
                $this = this;
            console.log('states', state)
            Object.keys(state).forEach((key)=>{
                if ( state[key] == 1 && $this.objects[key].id.indexOf('product') > -1 ) {
                    const tier = parseInt($this.objects[key].id.replace('product', ''));
                    console.log('tier', tier, highestTier);
                    if ( tier > highestTier ) {
                        highestTier = tier;
                        name = key;
                    }
                }
            });
        }
        return name;
    },

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
};