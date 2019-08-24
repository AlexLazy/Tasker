<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
  protected $fillable = [
    'title', 'status', 'user_id', 'project_id', 'content', 'price_total', 'price', 'status'
  ];

  public function author()
  {
    return $this->belongsTo('App\Models\User', 'user_id');
  }

  public function project()
  {
    return $this->belongsTo('App\Models\Project');
  }
}
