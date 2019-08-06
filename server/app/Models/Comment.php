<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
  protected $fillable = [
    'user_id', 'task_id', 'content'
  ];

  public function author()
  {
    return $this->belongsTo('App\Models\User', 'user_id');
  }

  public function task()
  {
    return $this->belongsTo('App\Models\Task');
  }
}
