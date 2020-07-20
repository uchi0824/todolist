<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/login', 'LoginController@index')->name('login');
Route::post('/login', 'LoginController@postAuth')->name('postAuth');

Route::group(['middleware' => ['auth']], function () {
Route::get('/logout', 'LoginController@logout')->name('logout');
Route::get('/works', 'WorksController@index')->name('works');

Route::group(['middleware' => ['can:admin']], function () {
Route::resource('users', 'UsersController')->except(['show']);
});
});


Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');