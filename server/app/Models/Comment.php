<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
  public function author()
  {
    return $this->hasOne('App\Models\User');
  }

  public function task()
  {
    return $this->hasOne('App\Models\Task');
  }
}
