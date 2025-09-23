<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::table('tasks', function (Blueprint $table) {
        $table->index('due_date');
        $table->index('priority');
        $table->index('created_at');
        // $table->fullText('title');
    });
}

public function down(): void
{
    Schema::table('tasks', function (Blueprint $table) {
        $table->dropIndex(['due_date']);
        $table->dropIndex(['priority']);
        $table->dropIndex(['created_at']);
        // $table->dropFullText('title'); // for MySQL
    });
}

};
