 document.getElementById('counterType').addEventListener('change', function() {
    const counterType = this.value;
    const counterSection = document.getElementById('counter');
    const calculatorSection = document.getElementById('calculator');

    if (counterType === 'counter') {
        counterSection.style.display = 'grid';
        calculatorSection.style.display = 'none';
    } else if (counterType === 'calculator') {
        counterSection.style.display = 'none';
        calculatorSection.style.display = 'block';
    }
});

// Initial toggle based on default selection
document.getElementById('counterType').dispatchEvent(new Event('change'));

document.getElementById('calculate').addEventListener('click', function () {
    const age = parseFloat(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const workoutDays = parseFloat(document.getElementById('workoutDays').value);
    const goal = document.getElementById('goal').value;
    let totalCalories;

    // Calculate BMR using Revised Harris-Benedict Equation
    const bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);

    // Adjust BMR based on activity level
    let activityFactor;
    if (workoutDays < 1) {
        activityFactor = 1.2; // Sedentary (little or no exercise)
    } else if (workoutDays >= 1 && workoutDays <= 3) {
        activityFactor = 1.375; // Lightly active (light exercise/sports 1-3 days/week)
    } else if (workoutDays >= 4 && workoutDays <= 5) {
        activityFactor = 1.55; // Moderately active (moderate exercise/sports 3-5 days/week)
    } else if (workoutDays >= 6 && workoutDays <= 7) {
        activityFactor = 1.725; // Very active (hard exercise/sports 6-7 days/week)
    } else {
        activityFactor = 1.9; // Extra active (very hard exercise/sports & physical job)
    }

    // Calculate total calories based on goal
    if (goal === 'maintenance') {
        totalCalories = bmr * activityFactor;
    } else if (goal === 'gain') {
        totalCalories = bmr * activityFactor + 500; // Add 500 calories surplus for weight gain
    } else if (goal === 'lose') {
        totalCalories = bmr * activityFactor - 500; // Subtract 500 calories deficit for weight loss
    }

    // Display total calories in the calories input
    document.getElementById('calories').value = totalCalories.toFixed(2) + " calories/day";
});

document.getElementById('searchButton').addEventListener('click', function () {
    const foodInput = document.getElementById('foodInput').value;
    const gramsInput = document.getElementById('gramsInput').value;

    fetch(`https://api.edamam.com/api/food-database/v2/parser?ingr=${foodInput}&app_id=e5950870&app_key=6e667fb2e70e062775e7bf607ff11c49`)
        .then(response => response.json())
        .then(data => {
            const food = data.hints[0].food;
            const nutrients = food.nutrients;
            const image = food.image;

            const isValidNutrient = (nutrient) => nutrient ? (nutrient * (gramsInput / 100)).toFixed(2) : 'N/A';
            const calories = isValidNutrient(nutrients.ENERC_KCAL);
            const protein = isValidNutrient(nutrients.PROCNT);
            const carbs = isValidNutrient(nutrients.CHOCDF_KCAL);
            const fat = isValidNutrient(nutrients.FAT);
            const salt = isValidNutrient(nutrients.NA);

            const html = `
                <div class="result-item border p-4 rounded-md font-semibold">
                    <p>Food: ${food.label}</p>
                    <img class="my-2 rounded-md " src="${image}" alt="${food.label}" style="max-width: 100%; height: auto;">
                    <p>Calories: ${calories} kcal</p>
                    <p>Protein: ${protein} g</p>
                    <p>Carbs: ${carbs} g</p>
                    <p>Fat: ${fat} g</p>
                    <p>Salt: ${salt} mg</p>
                </div>
            `;
            document.getElementById('results').innerHTML = html;
        })
        .catch(error => console.error('Error:', error));
});