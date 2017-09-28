<?php

namespace App\Http\Controllers\Api;

use App\Conversation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Transformers\ConversationTransformer;
use App\Http\Requests\StoreConversationUserRequest;
use App\Events\ConversationUsersCreated;

class ConversationUserController extends Controller
{
    public function store(StoreConversationUserRequest $request, Conversation $conversation)
    {
        $this->authorize('affect', $conversation);

        $conversation->users()->syncWithoutDetaching($request->recipients);

        $conversation->load(['users']);

        broadcast(new ConversationUsersCreated($conversation))->toOthers();

        return fractal()
            ->item($conversation)
            ->parseIncludes(['user', 'users'])
            ->transformWith(new ConversationTransformer)
            ->toArray();
    }
}
