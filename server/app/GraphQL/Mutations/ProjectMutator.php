<?php

namespace App\GraphQL\Mutations;

use App\Models\Project;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class ProjectMutator
{
  public function create($root, array $args, GraphQLContext $context)
  {
    $project = new Project;
    $project->user_id = $context->user->id;
    $project->title = $args['title'];
    $project->save();
    $project->users()->attach($project->user_id);

    return $project;
  }
}
