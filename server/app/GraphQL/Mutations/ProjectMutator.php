<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
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

  public function addUser($root, array $args, GraphQLContext $context)
  {
    $project = Project::find($args['project_id']);
    $user = User::find($args['user_id']);
    if (!$project || $project->author->id !== $context->user->id || !$user || !$user->name) return null;

    $project->users()->syncWithoutDetaching([$args['user_id']]);

    return $project;
  }

  public function removeUser($root, array $args, GraphQLContext $context)
  {
    $project = Project::find($args['project_id']);
    if (!$project ||
      $project->author->id !== $context->user->id ||
      !$project->users->where('id', $args['user_id'])->count() ||
      $args['user_id'] === $context->user->id) return null;

    $project->users()->detach($args['user_id']);

    return $project;
  }
}
