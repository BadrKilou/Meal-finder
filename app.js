const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const meals = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const singleMeal = document.getElementById('single-meal');



function searchMeal(e){
    e.preventDefault();
    // Clear Single Meal
    // singleMeal.innerHTML = '';
    
    
    // Get search term

    const word = search.value;
      
    if(word.trim()){
       fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${word}`)
       .then(res => res.json())
       .then(data =>{
           console.log(data);
           resultHeading.innerHTML = `<h2>Search results form '${word}'</h2>`;

           if(data.meals === null){
             resultHeading.innerHTML = `<p>There are no search results</p>`
           }else{
            meals.innerHTML = data.meals.map(meal => 
                `<div class="meal">
                 <img src="${meal.strMealThumb}" />
                 <div class="meal-info" data-mealID="${meal.idMeal}">
                 <h3>${meal.strMeal}</h3>
                 </div>
                </div>
                `)
                .join('')
           }
       });
       // Clear search text
       search.value = '';

    } else {
        showAlert('Please Type Something in that field')
        
        
    }
    
}

function getMealByID(mealID){

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
        addMealtoDom(meal)
    })
}

function addMealtoDom(meal){
    const ingredients = [];

    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else{
            break;
        }
    }

    singleMeal.innerHTML = `
    <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" />
    <div class="single-meal-info">
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class="main">
     <p>${meal.strInstructions}</p>
     <h2>Ingredients</h2>
     <ul>
     ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
     </ul>
    </div>
    </div>
    `
}


function showAlert(error){
    const container = document.querySelector('.container');
    const flex = document.querySelector('.flex')
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.appendChild(document.createTextNode(error));
    container.insertBefore(errorDiv,flex);

    setTimeout(clear,3000)

    function clear(){
        document.querySelector('.error').remove()
    }
}

// Event Listener

submit.addEventListener('click', searchMeal);
meals.addEventListener('click',e => {
    const mealInfo = e.path.find(item=>{
        console.log(item);
        if(item.classList){
            return item.classList.contains('meal-info')
        } else{
            return false
        }
    })
    if(mealInfo){
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealByID(mealID);
    }
})

const update = document.querySelector('.update');

window.addEventListener('offline',function(){
    document.body.textContent = 'You are Offline Now , Please check your Internet';
    document.body.className = 'update';
    
    setTimeout(clear,6000);

    function clear(){
        document.querySelector('.update').remove()
    }
}) 



