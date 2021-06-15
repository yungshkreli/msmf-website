//  The path where we can find the JSON file.
const PATH_CARS = 'http://path/to/cars.json';
//  Same thing, but using the fetch API for browsers that support it.
//  https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
//  The fetch API uses promises instead of callbacks to handle the results.
//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
fetch( PATH_CARS )
    .then( response => response.json())
    .then( cars => {
        console.log( cars );
    });
