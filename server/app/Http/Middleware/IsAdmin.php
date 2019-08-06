<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
      $token = substr($request->header('Authorization'), 7);
      $user = User::where('api_token',$token)->first();

      if ($user && $user->role !== '0' )
      {
        abort(403, 'Unauthorized action.');
      }

      return $next($request);
    }
}
