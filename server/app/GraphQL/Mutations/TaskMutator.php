<?php

namespace App\GraphQL\Mutations;

use App\Models\Task;
use App\Models\Project;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class TaskMutator
{
  public function create($root, array $args, GraphQLContext $context)
  {
    $project = Project::find($args['project_id']);

    if (!$project || !$project->users->where('id', $context->user->id)->count()) return null;
    
    $task = new Task;
    $task->user_id = $context->user->id;
    $task->fill($args);
    $task->save();

    return $task;
  }

  public function update($root, array $args, GraphQLContext $context)
  {
    $task = Task::find($args['id']);
    $project = Project::find($task->project_id);
    if (!$project || !$project->users->where('id', $context->user->id)->count()) return null;

    $task->fill($args);
    $task->save();

    return $task;
  }
}
