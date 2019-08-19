<?php

namespace App\GraphQL\Queries;

use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use App\Models\User;

class Users
{
  public function resolve()
  {
    return User::whereNotNull('google_id')->get();
  }
}
