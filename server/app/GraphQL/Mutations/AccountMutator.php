<?php

namespace App\GraphQL\Mutations;

use Google_Client;
use App\Models\User;
use Illuminate\Support\Str;

class AccountMutator
{
  public function login($root, array $args)
  {
    $token = 'User not found';
    $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
    $payload = $client->verifyIdToken($args['id_token']);
    
    if ($payload)
    {
      $user = User::where('email', $payload['email'])->first();
      if ($user)
      {
        if (!$user->google_id)
        {
          $user->update([
            'name'      => $payload['name'],
            'google_id' => $payload['sub'],
            'avatar'    => $payload['picture'],
            'api_token' => hash('sha256', Str::random(60))
          ]);
        }

        $token = $user->api_token;
      }
    }
    return $token;
  }

  public function createAdmin($root, array $args)
  {
    $token = null;
    $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
    $payload = $client->verifyIdToken($args['id_token']);
    
    if ($payload)
    {
      if (User::where('email', $payload['email'])->first()) return null;
        
      $token = hash('sha256', Str::random(60));

      $user = User::create([
        'name'      => $payload['name'],
        'email'     => $payload['email'],
        'google_id' => $payload['sub'],
        'avatar'    => $payload['picture'],
        'api_token' => $token
      ]);
      $user->role = 'ADMIN';
      $user->save();
    }
    return $token;
  }
}
