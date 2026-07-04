<?php

use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/testing/{name?}', function ($name ='this me hadil') {
    return view('testing',compact('name'));
});


// this function here take aparmetr that has the same name 
// as teh parameter between{} in te url 
// it could be not obligatory so we put ? in front of the parater between {}
//like this /about/{name?} and php variable should take an empty value 

// Route::get('/hello', function () {
//     return 'Hello World!';
// });
