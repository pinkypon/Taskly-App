<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'completed',
        'due_date',
        'priority', // ✅ Add this line
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
