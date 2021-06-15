//  FAKE FETCH, DO NOT USE IN THE REAL CODE
const fetch = url => Promise.resolve({json: () => JSON.parse('[{"availability":25,"brand":"bmw","code":"1000","id":1,"model":"m1"},{"availability":null,"brand":"bmw","code":"1001","id":2,"model":"m3"},{"availability":10,"brand":"bmw","code":"1002","id":3,"model":"m5"},{"availability":7,"brand":"ford","code":"1003","id":4,"model":"fiesta"},{"availability":14,"brand":"ford","code":"1004","id":5,"model":"mondeo"},{"availability":null,"brand":"ford","code":"1005","id":6,"model":"escort"}]')});

//  The path where we can find the JSON file.
const PATH_CARS = 'positions.json';
//  Same thing, but using the fetch API for browsers that support it.
//  https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
//  The fetch API uses promises instead of callbacks to handle the results.
//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
const getCars = url => fetch( url )
  .then( response => response.json())
  .catch( error => console.error( error ));
//  We need to group all the different cars into their respective brands.
const groupBrands = cars => {
  // Create a temporary object we'll use to store the different brands.
  const brands = {};
  //  Loop over all the car models, grouping them into the correct brand.
  cars.forEach( car => {
  //  Extract the brand name from the car item.
  const brand = car.brand;
  //  If we haven't seen this brand yet, add it to the different brands as an array.
  if ( !brands.hasOwnProperty( brand )) brands[ brand ] = [];
    //  Push the car model to the brand.
    brands[ brand ].push( car );
  });
  //  We now have an object containign all the cars grouped by brand.
  //  It would be easier however, if we had ana rray we can loop over easily.
  //  So transform the object back into an array.
  //  We loop over the entries array of the object to extarct the name and cars at the same time, then wrap them back into an object.
  return Object.entries( brands ).map(([ name, cars ]) => ({ name, cars }));
  //  This entire step can be done in one expression by using array.reduce() instead of array.forEach()
  //  We could also just return the object and loop over the entries in the render function.
  //  My personal preference is to always use an array to represent multiples of something:
  //  A 'collection' of 'brand' objects with each brand containing a 'collection' of 'car' objects.
  //  We could also already do this grouping inside the JSON file itsself, but I preferred to keep the JSON file itsself simple for this example.
};
//  We need to create a table for each brand.
//  We need to create a table row for each car model of that type.
//  For big projects, one would use a templating language to create the HTML.
//  For something as small as thing, we can resort to simple string manipulation.
const createTables = brands => {
//  Loop over all the brands, creating a table for each brand.
//  I'll use a reduction this time, to show the difference and similarities between reduce() and the forEach() we used in the previous step.
const tables = brands.reduce(( html, brand ) => {
  //  Copy the header, replacing the brand name.
  const header = `<table><thead><tr><th colspan="3">${ brand.name }</th></tr><tr><th>Product Code:</th><th>Model:</th><th>In Stock:</th></tr></thead><tbody>`;
  //  Loop over the cars and create a row for each car.
  //  Since we create the same amount of rows as we have cars inside the array, we can use .map()
  const rows = brand.cars.map( car => {
    //  Since we changed the availability to a number, we hve to recreate the string for it.
    //  This allows us to easily change the label without having to change the logic in multiple places
    const availability_label = Number.isInteger( car.availability )
        ? `${ car.availability } in stock.`
        : 'End of life.';
    return `<tr><td>${ car.code }</td><td>${ car.model }</td><td>${ availability_label }</td></tr>`;
  });
  //  Append the current header, car rows and the closing tags to the previous HTML, then return.
  return html += `${ header }${ rows.join('') }</tbody></table>`;
  }, '');
  //  Return the HTML string. We could also just return the reduction directly, wihtout using th tables variable in between.
  return tables;
};
//  We have a JSON file, we can fetch that file, we can create tables from the contents, time to put it all together.
//  Fetch the JSON file.
getCars( PATH_CARS )
  //  Group the cars into brands.
  .then( groupBrands )
  //  Create a table for each group.
  .then( createTables )
  //  Render the tables into the page.
  .then( html => {
    const tableHook = document.querySelector( '#cars' );
    if ( tableHook ) tableHook.innerHTML = html;
    // else throw new Error(); something went wrong.
  })
  //  Catch any errors encountered.
  .catch( error => console.error( error ));
