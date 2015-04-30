define(['worldGen'], function(worldGen){
   var planet = function(gameInstance, name, temp, gravity, metal, position){
       this.position = position;
       this.name = name;
       this.temp = temp;
       this.gravity = gravity;
       this.owner = null;
       this.metal = metal;
       this.gameInstance = gameInstance;
       this.sprites = this._getPlanetSprites(temp, gravity, metal, position);
       this.bannerSprite = null;
   };
   planet.prototype = {
       setNewOwner: function(player){
           if(this.bannerSprite)this.bannerSprite.destroy();
           //draw the player banner on the planet top left
           this.owner = player;
           this.bannerSprite = this.gameInstance.add.sprite(this.position.x-10, this.position.y-10, this.name+'_banner');
           return this;
       },
       _onPlanetClick: function(){
           //make it active with halo around it plz kthxbai
           this.gameInstance.planetClickedSignal.dispatch(this);
       },
       _getPlanetSprites: function(temp, gravity, metal, position){
           //Grab updated canvas from generator
           if(this.sprites){
               this.sprites[0].destroy();
               this.sprites[1].destroy();
               this.sprites[2].destroy();
           }

           var spriteGroup = this.gameInstance.add.group();

           var bmd = this.gameInstance.add.bitmapData(100,100);

           worldGen.generateWorldCanvas(bmd.canvas, temp, gravity, metal);

           var scaleFactor = gravity/4;

           var sprite = this.gameInstance.add.sprite(position.x, position.y, bmd, null, spriteGroup);
           sprite.scale.setTo(scaleFactor);

           var sprite2 = this.gameInstance.add.sprite(position.x-(100*scaleFactor), position.y, bmd, null, spriteGroup);
           sprite2.scale.setTo(scaleFactor);

           //Add 'light' source
           var lightSprite = this.gameInstance.add.sprite(position.x, position.y, 'alphaMask', null, spriteGroup);
           lightSprite.scale.setTo(scaleFactor);

           lightSprite.inputEnabled = true;
           lightSprite.events.onInputDown.add(this._onPlanetClick, this);

           bmd = null;

           //Create sprite mask
           if(this.mask) {
               delete this.mask;
           }
           this.mask = this.gameInstance.add.graphics(position.x, position.y);
           //	Shapes drawn to the Graphics object must be filled.
           this.mask.beginFill(0xffffff);
           //	Here we'll draw a circle
           this.mask.drawCircle(50*scaleFactor, 50*scaleFactor, 50*scaleFactor);
           //	And apply it to the Sprite
           spriteGroup.mask = this.mask;

           var rotationalPeriod = (Math.random()*20000)+10000;
           //Setup tweens for sprite behind mask
           sprite.tween = this.gameInstance.add.tween(sprite)
               .to({x: position.x + (100*scaleFactor)}, rotationalPeriod, Phaser.Easing.Linear.None)
               .to({x: position.x}, 10, Phaser.Easing.Linear.None)
               .loop();
           sprite.tween.start();
           sprite2.tween = this.gameInstance.add.tween(sprite2)
               .to({x: position.x}, rotationalPeriod, Phaser.Easing.Linear.None)
               .to({x: position.x-(100*scaleFactor)}, 10, Phaser.Easing.Linear.None)
               .loop();
           sprite2.tween.start();

           return [sprite, sprite2, lightSprite];
       }
   };
   return planet;
});