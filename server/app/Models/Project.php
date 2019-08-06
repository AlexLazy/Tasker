<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
  protected $fillable = [
    'title', 'status', 'user_id'
  ];

  public function author()
  {
    return $this->belongsTo('App\Models\User', 'user_id');
  }

  public function tasks()
  {
    return $this->hasMany('App\Models\Task');
  }
  
  public function users()
  {
    return $this->belongsToMany('App\Models\User')->withTimestamps();
  }
}
