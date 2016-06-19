/*
 * Worded analysis for displaying
 */

function analyseTemp(temp){
    // Temperature is in degrees celsius
    String result = "";
    if (temp > 35){
        result = "Temperature is getting rather high, conditions for HAB is ideal. Please monitor pH and oxygen content for early signs of HAB growth.";
    } else if (temp < 25){
        result = "Temperature is rather low. While HAB won't grow in such conditions, neither do fish grow well in such conditions. Consider transferring to a warmer environment.";
    }
    return result;
}

function analysePH(pH){
    //TODO add the time condition to check whether it is night or day, or maybe check light conditions
    String result = "";
    if (pH < 6.5 && !lightIsIdeal()){
        // If water is acidic at night
        result = "Water is slightly more acidic than normal. There may be large amounts of algae present in the water.";
    } else if (ph > 6.5 && ph < 7.5 && !lightIsIdeal()){
        // If water is neutral at night
        result = "Water is in the perfect pH range for fishes. No symptoms of HAB growth!";
    }
    return result;
}

function analyseOxygen(oxygen){
    var result = "";
    if (oxygen < 100 && lightIsIdeal){
        // If its morning and there is regular amount of oxygen due to photosynthesis
        result = "";
    } else if (oxygen > 100 && lightIsIdeal){
        // If its morning and oxygen is abnormally high, its probably due to large amounts of algae.
        result = "";
    } else if (oxygen < 70 && !lightIsIdeal){
        // If its nighttime and oxygen is abnormally low, it is probably due to algae.
        restul = "";
    } else if (oxygen > 70 && !lightIsIdeal){
        // If its nighttime and oxygen is low, but its normal, then all is well.
        result = "";
    }
    return result;
}

function analyseLight(){
    // Check time of day, and see if light amount is ok
    // Maybe can check the weather too, to see if its normal

}

function analyseMotion(){
    // Just poll the sensro to see if there's anything anomaly
}

/*
 * Combination score analysis
 */

function temperatureScore(){
    // Maximum of 30
    return getTemperature() * 0.3;
}

function motionScore(){
    // Maximum of 20
}

function lightScore(){
    // Maximum of 20
}

function oxygenScore(){
    // Maximum of 15
}

function phScore(){
    // Maximum of 15
}

function habScore(){
    var score = 0;
    //TODO come up with a formula to calculate HAB score out of 100
    // Temp = 30, motion = 20, light = 20 (the less light there is the more dangerous HAB is), oxygen = 15, ph = 15
    return score;
}

function habScoreAnalysis(){
    var score = habScore();
    var result = "";
    if (score >= 85){
        result = "Chance of HAB is certain/is happening!";
    } else if (score >= 70){
        result = "Chance of HAB happening is quite high. Most of the symptoms of a HAB are present. Consider taking mitigative measures ASAP!";
    } else if (score >= 50){
        result = "Please keep close tabs on the water. There may be a chance of HAB happening as some of the symptoms of a HAB are present. Consider preparing for preventive measures!";
    } else if (score >= 35){
        result = "Chance of a HAB happening is rather low. Temperature of water might be higher than expected, or the water might be rather still.";
    } else {
        result = "HAB is not going to happen anytime soon! Have a great day ahead!";
    }
    return result;
}


/*
 * Check for ideal conditions
 */

// If there is enough light, then photosynthesis should take place, and oxygen levels will be higher than normal
// If there is enough light, but oxygen levels remain the same, presence of algae is minimal
// If there isn't enough light, then respiration will take place, and if CO2 is higher than normal, algae is present
function lightIsIdeal(light){
    if (light > 100){
        return true;
    } else {
        return false;
    }
}


/*
 * Getters and Setters for each of the data types
 */


function getOxygen(){
    return 10.0;
}

function getPH(){
    return 7.0;
}

function getLight(){
    return 100;
}

function getMotion(){
    return 500;
}

function getTemperature(){
    return 30.0;
}
