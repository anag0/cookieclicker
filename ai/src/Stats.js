class Stats {
    drawGameStats( bigBrain, smallBrain ) {
        fill('rgba(0, 0, 0, 0.7)');
        rect(0, 0, 360, windowHeight);

        textAlign(LEFT);
        fill(255, 255, 255);
        textSize(24);
        text( 'BigBrain Stats', 40 , windowHeight - 630, 320, 24 );
        textSize(14);
        text( 'Hits: ' + bigBrain.hits, 40 , windowHeight - 600, 320, 14 );
        text( 'Misses: ' + bigBrain.misses, 40 , windowHeight - 580, 320, 14 );
        text( 'Accuracy: ' + ((bigBrain.hits / (bigBrain.hits + bigBrain.misses)) * 100).toFixed(2)  + '%', 40 , windowHeight - 560, 320, 14 );

        textSize(24);
        text( 'SmallBrain Stats', 40 , windowHeight - 530, 320, 24 );
        textSize(14);
        text( 'Hits: ' + smallBrain.hits, 40 , windowHeight - 500, 320, 14 );
        text( 'Misses: ' + smallBrain.misses, 40 , windowHeight - 480, 320, 14 );
        text( 'Accuracy: ' + ((smallBrain.hits / (smallBrain.hits + smallBrain.misses)) * 100).toFixed(2) + '%', 40 , windowHeight - 460, 320, 14 );
    }

    drawPopulationStats( population ) {
        fill('rgba(0, 0, 0, 0.7)');
        rect(0, 0, 360, windowHeight);

        textAlign(LEFT);
        fill(255, 255, 255);
        textSize(24);
        text( 'Generation: ' + population.generation, 40 , windowHeight - 660, 320, 24 );
        text( 'Population Stats', 40 , windowHeight - 630, 320, 24 );
        textSize(12);
        text( 'Number    Hits      Misses      S      Fitness    Parameter', 40 , windowHeight - 600, 320, 14 );
        textSize(10);

        population.smallBrains.forEach(function(smallBrain, i){
            if ( smallBrain.generation > 0 ) {
                fill(255, 255, 0);
            } else {
                fill(255, 255, 255);
            }

            if ( i == population.getFittest() ) {
                fill(255, 0, 0);
            }

            let offsetY = windowHeight - 590 + (i*10);
            text( '#'+ (i+1), 40 , offsetY, 280, 14 );
            text( smallBrain.hits + '(' + smallBrain.objectHits + ')', 96 , offsetY, 280, 14 );
            text( smallBrain.misses + '(' + smallBrain.objectMisses + ')', 136 , offsetY, 280, 14 );
            text( smallBrain.generation, 194 , offsetY, 280, 14 );
            text( smallBrain.fitness().toFixed(3), 222 , offsetY, 280, 14 );
            text( smallBrain.cookieClickChance.toFixed(3), 274 , offsetY, 280, 14 );
        });
    }
}