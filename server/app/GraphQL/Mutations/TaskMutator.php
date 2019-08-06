<?php

namespace App\GraphQL\Mutations;

use App\Models\Task;
use App\Models\Project;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class TaskMutator
{
  public function create($root, array $args, GraphQLContext $context)
  {
    $project = Project::where('id', '=', $args['project_id']);
    if (!$project->exists() || $project->pluck('user_id')[0] != $context->user->id) return null;
    
    $task = new Task;
    $task->user_id = $context->user->id;
    $task->fill($args);
    $task->save();

    return $task;
  }
}
