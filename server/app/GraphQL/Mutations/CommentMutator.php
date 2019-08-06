<?php

namespace App\GraphQL\Mutations;

use App\Models\Task;
use App\Models\Project;
use App\Models\Comment;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class CommentMutator
{
  public function create($root, array $args, GraphQLContext $context)
  {
    $task = Task::find($args['task_id']);
    if (!$task->project->users->where('id', $context->user->id)->count()) return null;
    
    $comment = new Comment;
    $comment->user_id = $context->user->id;
    $comment->fill($args);
    $comment->save();

    return $comment;
  }

  public function update($root, array $args, GraphQLContext $context)
  {

    $comment = Comment::find($args['id']);
    if (!$comment || $comment->author->id !== $context->user->id) return null;

    $comment->fill($args);
    $comment->save();

    return $comment;
  }
}
