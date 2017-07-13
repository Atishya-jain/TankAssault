// JavaScript Document for main Play
/**************************************************
** Controller functions for the game
**************************************************/

var alreadygenerated = 0;
var iterationTime = 10; // in milis


  
function playGame() {
	// function which controls the game 
	// called repeatedly after each 'iterationTime' milisecond
	 
	 drawmaze();
	 update();
	 
	 var i;	
	 for (i = 0; i < remotePlayers.length; i++) {
				shootTank(remotePlayers[i]);
		};
	myScore.text="SCORE: " + 7;
    myScore.update();
	changeHealth();
}

async function generate() {
	if(alreadygenerated == 0){
	drawmaze();
	alreadygenerated++;
	}
	theTank = new Tank();
	for (var i = 0; i < theTank.bulletPack; i++)
    	theTank.bullet.push(new Bullet());

	if (onceLoaded == 0) onceLoaded++;
	init();
	
	$('#maze').hide();
	$('#loading').show();
	$('#myBar').hide();
	setEventHandlers();
	// caution: this time depends on network speed
	//          when moving to actual online server test and increase this time to avoid previous
	//          'double start' errors
	await sleep(5000);
	$('#maze').show();
	$('#loading').hide();
	$('#myBar').show();
	initialize();
	if (loaded == 0){
		setInterval(playGame, iterationTime);
	}

	loaded++;
}
function reSetTank() {
	initialize();
}