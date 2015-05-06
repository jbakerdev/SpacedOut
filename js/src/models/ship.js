define(['lodash'], function(_){
   var ship = function(planet, player, type, range, speed, weapon, shield, gameInstance){
        this.type = type;
        this.id = 'ship_'+Math.random();
        this.range = range;
        this.speed = speed;
        this.weapon = weapon;
        this.shield = shield;
        this.spriteGroup = null;
        this.owner = player;
        this.gameInstance = gameInstance;
        this.destination = null;
        this.distanceToDestination = null;
        this.drawAtLocation(planet.position.x, planet.position.y, true);
   };

   ship.prototype = {
       drawAtLocation: function(x, y, options){
           this._destroySpritesAndGroup();

           //draws the ship warping in and orbiting the planet
           this._createShipSpriteGroup(x-20,
               y+(Math.random()*60), 0.2);

           if(options.warpIn && options.orbit){
               this._playWarpInAndOrbit(this.spriteGroup, x, y);
           }
           else if(options.warpOut){
               this._playWarpOut(this.spriteGroup, x, y);
           }
           else if(options.orbit){
               this._playOrbit(this.spriteGroup, x, y);
           }
           else if(options.move){
               this._playMove(this.spriteGroup, x, y);
           }
       },
       _createShipSpriteGroup: function(x, y, scale){
           this.spriteGroup = this.gameInstance.add.group(this.gameInstance.stageGroup);
           this.spriteGroup.create(0,0,this.type+'_range_'+this.range);
           this.spriteGroup.create(10,0,this.type+'_speed_'+this.speed);
           this.spriteGroup.create(20,0,this.type+'_shield_'+this.shield);
           this.spriteGroup.create(40,0,this.type+'_weapon_'+this.weapon);
           if(scale){
               this.spriteGroup.scale.y = scale;
               this.spriteGroup.scale.x = scale;
           }
           this.spriteGroup.x = x;
           this.spriteGroup.y = y;
           return this.spriteGroup;
       },
       _destroySpritesAndGroup: function(){
           if(this.spriteGroup){
               this.spriteGroup.tween.destroy();
               this.spriteGroup.destroy(true);
           }
       },
       _onOrbitComplete: function(target, tween){
           if(this.orbitIn){
               this.orbitIn = false;
               this.gameInstance.stageGroup.sendToBack(target);
           }
           else{
               this.orbitIn = true;
               this.gameInstance.stageGroup.bringToTop(target);
           }
       },
       _playOrbit: function(spriteGroup, x, y){
           spriteGroup.tween = this.gameInstance.add.tween(spriteGroup)
               .to({x: x+40, y: y+(Math.random()*60) }, 10000, Phaser.Easing.Linear.None)
               .to({x: x-20, y: y+(Math.random()*60) }, 10000, Phaser.Easing.Linear.None)
               .loop();
           spriteGroup.tween.onChildComplete.add(this._onOrbitComplete, this);
           spriteGroup.tween.start();
           this.orbitIn = true;
           console.log('running orbit animation on a ship');
       },
       _playWarpInAndOrbit: function(spriteGroup, x, y){
            //TODO
           console.log('running warp in & orbit animation on a ship');
       },
       _playWarpOut: function(spriteGroup, x, y){
           //TODO
           console.log('running warp out animation on a ship');
       },
       _playMove: function(spriteGroup, x, y){
           //TODO
           console.log('running move animation on a ship');
       }
   };

   return ship;
});