<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
  use Notifiable;

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
    'name', 'email', 'api_token', 'google_id', 'avatar'
  ];

  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  protected $hidden = [
    'api_token', 'google_id',
  ];

  public function tasks()
  {
    return $this->hasMany('App\Models\Task');
  }

  public function own_projects()
  {
    return $this->hasMany('App\Models\Project');
  }

  public function projects()
  {
    return $this->belongsToMany('App\Models\Project')->withTimestamps();
  }
}
